import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose, {
  HydratedDocument,
  Document,
  Model,
  Schema,
  Types,
} from 'mongoose';

import validator from 'validator';
import {CustomError} from '../../../errors';
import {apiRoles} from '../../config/roles.config';

dotenv.config();

if (!process.env.JWT_KEY) {
  throw new CustomError(
    404,
    'Please provide a JWT_KEY as global environment variable'
  );
}

const jwtKey = process.env.JWT_KEY;

/**
 * Define the Google Passport interface
 */

export interface IGooglePassport {
  id: string;
  sync: boolean;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * define user messages interface
 */
export interface IUserMessages {
  title: string;
  body: string;
  type: string;
  read: boolean;
  firebaseMessageId: string;
}

/**
 * Define the User model...
 */
export interface IUser {
  // isModified(arg0: string): unknown;
  _id: Types.ObjectId;
  username: string;
  fullName: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  google: IGooglePassport;
  role: string;
  active: boolean;
  pictureUrl: string;
  pictureBlob: string;
  lastLoginDate: Date;
  notification: {
    fcmPermission: string;
    firebaseMessageToken: string;
  };
  messages: IUserMessages[];
  featureFlags?: {
    [key: string]: string;
  };
}

/**
 * Exporting methods for User
 */
export interface IUserMethods {
  toJSON(): Document<this>;
  comparePassword(password: string): Promise<boolean>;
  generateVerificationToken(): string;
  generatePasswordResetToken(): void;
}

/**
 * Create a new Model type that knows about Methods and stati and IUser...
 */
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  checkExistingField: (
    field: string,
    value: string
  ) => Promise<HydratedDocument<IUser, IUserMethods>>;
}

const MessageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    firebaseMessageId: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  }
);

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email can't be blank"],
      unique: true,
      lowercase: true,
      index: true,
      // TODO: Re-enable the validation once migration is completed
      validate: [validator.isEmail, 'Please provide an email address'],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      trim: true,
    },
    password: {type: String, required: true, minlength: 8},
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    google: {
      id: String,
      sync: {type: Boolean}, // authorisation to sync with google
      tokens: {
        accessToken: String,
        refreshToken: String,
      },
    },
    role: {
      type: String,
      enum: apiRoles,
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    pictureUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) =>
          validator.isURL(value, {
            protocols: ['http', 'https', 'ftp'],
            require_tld: true,
            require_protocol: true,
          }),
        message: 'Must be a Valid URL',
      },
    },
    pictureBlob: {
      type: String,
    },
    lastLoginDate: {type: Date, required: false, default: null},
    notification: {
      fcmPermission: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'default',
      },
      firebaseMessageToken: {type: String, trim: true, default: null},
    },
    messages: [MessageSchema],
    featureFlags: {
      allowSendEmail: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'granted',
      },
      allowSendSms: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'granted',
      },
      betaFeatures: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'default',
      },
      darkMode: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'default',
      },
      personalization: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'default',
      },
      geolocationBased: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'default',
      },
      security: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'default',
      },
      payment: {
        type: String,
        enum: ['granted', 'denied', 'default'],
        default: 'default',
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  }
);

UserSchema.index({username: 1, email: 1, googleId: 1});

/**
 * MONGOOSE MIDDLEWARE
 */
UserSchema.pre<HydratedDocument<IUser, IUserMethods>>(
  'save',
  async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
);

/**
 * MONGOOSE METHODS
 */
UserSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  userObj.id = userObj._id; // remap _id to id

  delete userObj._id;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateVerificationToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      active: this.active,
      role: this.role,
      employeeId: this.employeeId,
      clientId: this.clientId,
      vendorId: this.vendorId,
      deleted: this.deleted,
      featureFlags: this.featureFlags,
    },
    jwtKey,
    {
      expiresIn: '1d',
      // algorithm: 'RS256',
    }
  );
};

UserSchema.methods.generatePasswordResetToken = async function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

/**
 * MONGOOSE STATIC METHODS
 */
UserSchema.statics.checkExistingField = async function (
  field: string,
  value: string
) {
  return this.findOne({[`${field}`]: value});
};

const User = mongoose.model<IUser, IUserModel>('User', UserSchema, 'users');

export default User;
