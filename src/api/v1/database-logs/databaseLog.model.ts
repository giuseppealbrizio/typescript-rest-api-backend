import dotenv from 'dotenv';
import mongoose, {
  Types,
  Document,
  HydratedDocument,
  Model,
  Schema,
} from 'mongoose';
import {CustomError} from '../../../errors';

dotenv.config();

if (!process.env.JWT_KEY) {
  throw new CustomError(
    404,
    'Please provide a JWT_KEY as global environment variable'
  );
}

export interface IDatabaseLog {
  _id: Types.ObjectId;
  type: string;
  date: Date;
  level: string;
  details: {
    channel: string;
    message: string;
    status: string;
    response?: Schema.Types.Mixed;
  };
}

export interface IDatabaseLogMethods {
  toJSON(): Document<this>;
}

export interface IDatabaseLogModel
  extends Model<IDatabaseLog, {}, IDatabaseLogMethods> {
  checkExistingField: (
    field: string,
    value: string
  ) => Promise<HydratedDocument<IDatabaseLog, IDatabaseLogMethods>>;
}

const DatabaseLogSchema = new Schema<
  IDatabaseLog,
  IDatabaseLogModel,
  IDatabaseLogMethods
>(
  {
    type: {type: String, required: true},
    date: {type: Date, required: true},
    level: {type: String, required: true},
    details: {
      channel: {type: String, required: true},
      message: {type: String, required: true},
      status: {type: String, required: true},
      response: Schema.Types.Mixed,
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

DatabaseLogSchema.index({
  type: 1,
  date: 1,
  level: 1,
  'details.channel': 1,
  'details.message': 1,
  'details.status': 1,
});

DatabaseLogSchema.methods.toJSON = function () {
  const logObj = this.toObject();
  logObj.id = logObj._id; // remap _id to id

  delete logObj._id;
  delete logObj.__v;
  return logObj;
};

DatabaseLogSchema.statics.checkExistingField = async function (
  field: string,
  value: string
) {
  const log = await this.findOne({[field]: value});
  return log;
};

const DatabaseLog = mongoose.model<IDatabaseLog, IDatabaseLogModel>(
  'DatabaseLog',
  DatabaseLogSchema,
  'logs'
);

export default DatabaseLog;
