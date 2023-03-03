import {NextFunction, Response} from 'express';
import {IVerifyOptions} from 'passport-local';

import {ICustomExpressRequest} from '../../../middlewares/currentUser.middleware';
import createCookieFromToken from '../../../utils/createCookieFromToken.utils';
import {CustomError} from '../../../errors';
import Logger from '../../../lib/logger';
import passport from '../../../config/passport.config';
import User, {IUserMethods} from '../user/user.model';
import {sendResetPasswordToken} from '../../../services/email/sparkpost.service';

/**
 * Signup Local strategy
 * @param req
 * @param res
 * @param next
 * @returns
 */
const signup = (
  req: ICustomExpressRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return passport.authenticate(
    'signup',
    {session: false},
    async (err: Error, user: IUserMethods, info: IVerifyOptions) => {
      try {
        if (err || !user) {
          const {message} = info;
          return res.status(400).json({
            status: 'error',
            error: {
              message,
            },
          });
        }
        createCookieFromToken(user, 201, req, res);
      } catch (error) {
        Logger.error(error);
        if (error instanceof CustomError) {
          throw new CustomError(error.statusCode, error.message);
        }
      }
    }
  )(req, res, next);
};

/**
 * Login Local strategy
 * @param req
 * @param res
 * @param next
 */
const login = (
  req: ICustomExpressRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'login',
    {session: false},
    async (err: Error, user: IUserMethods, info: IVerifyOptions) => {
      try {
        if (err || !user) {
          return res.status(401).json({
            status: 'error',
            error: {
              message: info.message,
            },
          });
        }
        // call req.login manually to set the session and
        // init passport correctly in serialize & deserialize
        req.logIn(user, error => {
          if (error) {
            return next(error);
          }
        });

        // generate a signed json web token with the contents of user
        // object and return it in the response
        createCookieFromToken(user, 200, req, res);
      } catch (error) {
        console.log(error);
        Logger.error(error);
        if (error instanceof CustomError) {
          throw new CustomError(error.statusCode, error.message);
        }
      }
    }
  )(req, res, next);
};

/**
 * Logout
 * @param req
 * @param res
 * @param next
 */
const logout = (
  req: ICustomExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('jwt');
    res.clearCookie('connect.sid');
    req.session.destroy(error => {
      if (error) {
        return next(error);
      }
      return res.status(200).json({
        status: 'success',
        message: 'You have successfully logged out',
      });
    });
  } catch (error) {
    Logger.error(error);
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message);
    }
  }
};

/**
 * Recover password
 * @param req
 * @param res
 * @returns
 */
const recoverPassword = async (req: ICustomExpressRequest, res: Response) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email}).exec();

    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: {
          status: 'error',
          message: 'User not found',
        },
      });
    }

    // Destroy session and remove any cookie
    req.session.destroy(() => {
      res.clearCookie('jwt');
    });

    res.clearCookie('jwt');

    // Generate and set password reset token
    user.generatePasswordResetToken();

    // Save the updated user object with a resetPasswordToken and expire
    await user.save();

    // Send email to the user with the token
    const sendEmail = await sendResetPasswordToken(
      user.email as string,
      user.resetPasswordToken as string
    );

    res.status(200).json({
      status: 'success',
      message: `A reset email has been sent to ${user.email}.`,
      user: {
        email: user.email,
        token: user.resetPasswordToken,
      },
      emailStatus: sendEmail,
    });
  } catch (error) {
    Logger.error(error);
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message);
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Email could not be sent',
        error,
      });
    }
  }
};

/**
 * Reset password
 * @param req
 * @param res
 * @param next
 */
const resetPassword = (
  req: ICustomExpressRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'reset-password',
    {session: false},
    async (err: Error, user: IUserMethods, info: IVerifyOptions) => {
      try {
        if (err || !user) {
          return res.status(400).json({
            status: 'error',
            error: {
              message: info.message,
            },
          });
        }

        res.status(200).json({
          status: 'success',
          message: 'Password successfully updated',
        });
      } catch (error) {
        Logger.error(error);

        if (error instanceof CustomError) {
          throw new CustomError(error.statusCode, error.message);
        }
      }
    }
  )(req, res, next);
};

/**
 * Return authenticated user
 * @param req
 * @param res
 * @returns
 */
const returnUserLogged = async (req: ICustomExpressRequest, res: Response) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({
        status: 'error',
        error: {
          message:
            'If you can see this message there is something wrong with authentication',
        },
      });
    }

    const user = await User.findById(req.currentUser?.id);

    res.status(200).json({
      status: 'success',
      message: 'User logged retrieved',
      data: {
        user,
      },
    });
  } catch (error) {
    Logger.error(error);
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message);
    }
  }
};

/**
 * Google login
 * @param req
 * @param res
 */
const googleLogin = async (req: ICustomExpressRequest, res: Response) => {
  try {
    const user = req.user as IUserMethods;

    createCookieFromToken(user, 201, req, res);
  } catch (error) {
    Logger.debug(error);
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message);
    }
  }
};

export {
  signup,
  login,
  logout,
  recoverPassword,
  resetPassword,
  returnUserLogged,
  googleLogin,
};
