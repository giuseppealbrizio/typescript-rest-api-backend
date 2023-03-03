import {Response} from 'express';
import {IUserMethods} from '../api/v1/user/user.model';
import {ICustomExpressRequest} from '../middlewares/currentUser.middleware';

/**
 *
 * This function returns a json with user data,
 * token and the status and set a cookie with
 * the name jwt. We use this in the response
 * of login or signup
 * @param user:
 * @param statusCode
 * @param req
 * @param res
 */
const createCookieFromToken = (
  user: IUserMethods,
  statusCode: number,
  req: ICustomExpressRequest,
  res: Response
) => {
  const token = user.generateVerificationToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    token_expires: cookieOptions.expires,
    data: {
      user,
    },
  });
};

export default createCookieFromToken;
