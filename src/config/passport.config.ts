import dotenv from 'dotenv';
import passport from 'passport';
import passportLocal, {IStrategyOptionsWithRequest} from 'passport-local';
import passportGoogle from 'passport-google-oauth20';

import User, {IUser} from '../api/v1/user/user.model';
import Logger from '../lib/logger';
import {ICustomExpressRequest} from '../middlewares/currentUser.middleware';

dotenv.config();

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

const LocalStrategy = passportLocal.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

passport.serializeUser((user, done) => {
  /* Store only the id in passport req.session.passport.user */
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findOne({_id: id}, (err: NativeError, user: IUser) => {
    done(null, user);
  });
});

const authFields: IStrategyOptionsWithRequest = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

/**
 * Login strategy
 */
passport.use(
  'login',
  new LocalStrategy(
    authFields,
    async (req: ICustomExpressRequest, email, password, cb) => {
      try {
        const user = await User.findOne({
          $or: [{email}, {username: email.toLowerCase()}],
        }).exec();

        if (!user || !user.password) {
          return cb(null, false, {message: 'User not found.'});
        }

        const checkPassword = await user.comparePassword(password);

        if (!checkPassword) {
          return cb(null, false, {message: 'Incorrect email or password.'});
        }

        if (!user || !user.active) {
          return cb(null, false, {message: 'Account is deactivated.'});
        }

        const {active} = user;

        if (!active) {
          return cb(null, false, {message: 'Account is deactivated.'});
        }

        user.lastLoginDate = new Date();
        await user.save();

        return cb(null, user, {message: 'Logged In Successfully'});
      } catch (err: unknown) {
        if (err instanceof Error) {
          Logger.debug(err);
          return cb(null, false, {message: err.message});
        }
      }
    }
  )
);

/**
 * Sign up strategy
 */
passport.use(
  'signup',
  new LocalStrategy(authFields, async (req, email, password, cb) => {
    try {
      const checkEmail = await User.checkExistingField('email', email);

      if (checkEmail) {
        return cb(null, false, {
          message: 'Email already registered, log in instead',
        });
      }

      const checkUserName = await User.checkExistingField(
        'username',
        req.body.username
      );

      if (checkUserName) {
        return cb(null, false, {
          message: 'Username exists, please try another',
        });
      }

      const newUser = new User();
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      newUser.username = req.body.username;

      await newUser.save();

      return cb(null, newUser);
    } catch (err: unknown) {
      if (err instanceof Error) {
        Logger.debug(err);
        return cb(null, false, {message: err.message});
      }
    }
  })
);

/**
 * The password Reset method is with a token generated
 */
passport.use(
  'reset-password',
  new LocalStrategy(authFields, async (req, email, password, cb) => {
    try {
      const {token} = await req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {$gt: Date.now()},
      }).exec();

      if (!user) {
        return cb(null, false, {
          message: 'Password reset token is invalid or has expired.',
        });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return cb(null, user, {message: 'Password Changed Successfully'});
    } catch (err: unknown) {
      if (err instanceof Error) {
        Logger.debug(err);
        return cb(null, false, {message: err.message});
      }
    }
  })
);

/**
 * Google strategy
 */
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: <string>GOOGLE_CLIENT_ID,
      clientSecret: <string>GOOGLE_CLIENT_SECRET,
      callbackURL: `/api/v1/${process.env.SERVICE_NAME}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const username = profile.emails && profile?.emails[0]?.value;
        const email = profile.emails && profile?.emails[0]?.value;
        const pictureUrl = profile.photos && profile.photos[0].value;

        // 1. Check if user has already a Google profile and return it
        const googleUser = await User.findOne({
          'google.id': profile.id,
        }).exec();

        if (googleUser) {
          return done(null, googleUser, {statusCode: 200});
        }

        // 2. If user email is in the db and tries to google auth
        // update only with Google id and token
        const checkEmail = await User.checkExistingField(
          'email',
          <string>email
        );

        const fieldsToUpdate = {
          pictureUrl,
          'google.id': profile.id,
          'google.sync': true,
          'google.tokens.accessToken': accessToken,
          'google.tokens.refreshToken': refreshToken,
        };

        if (checkEmail) {
          const user = await User.findByIdAndUpdate(
            checkEmail._id,
            fieldsToUpdate,
            {new: true}
          ).exec();

          return done(null, <IUser>user, {statusCode: 200});
        }

        // 3. If nothing before is verified create a new User
        const userObj = new User({
          username, // the same as the email
          email,
          pictureUrl,
          password: accessToken,
          'google.id': profile.id,
          'google.sync': true,
          'google.tokens.accessToken': accessToken,
          'google.tokens.refreshToken': refreshToken,
        });

        const user = await userObj.save({validateBeforeSave: false});

        return done(null, user, {statusCode: 201});
      } catch (err: unknown) {
        if (err instanceof Error) {
          Logger.debug(err);
          return done(err, false);
        }
      }
    }
  )
);

export default passport;
