import express from 'express';
import passport from '../../../config/passport.config';
import catchAsyncHandler from '../../../middlewares/catchAsyncHandler.middleware';
import {requireAuthenticationMiddleware} from '../../../middlewares/requireAuthentication.middleware';

import {
  googleLogin,
  login,
  logout,
  recoverPassword,
  resetPassword,
  returnUserLogged,
  signup,
} from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', catchAsyncHandler(signup));
authRouter.post('/login', catchAsyncHandler(login));
authRouter.post('/logout', catchAsyncHandler(logout));
authRouter.post('/recover-password', catchAsyncHandler(recoverPassword));
authRouter.post('/reset-password', catchAsyncHandler(resetPassword));
authRouter.get(
  '/me',
  requireAuthenticationMiddleware,
  catchAsyncHandler(returnUserLogged)
);

/**
 * Social Authentication: Google
 */
authRouter.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
);
// callback route for Google authentication
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
  googleLogin
);

export default authRouter;
