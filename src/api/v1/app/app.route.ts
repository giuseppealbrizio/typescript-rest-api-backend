import express from 'express';
import catchAsyncHandler from '../../../middlewares/catchAsyncHandler.middleware';

import {requireAuthenticationMiddleware} from '../../../middlewares/requireAuthentication.middleware';
import {
  checkPubSubPullSubscription,
  checkPubsubPushSubscription,
  checkPubSubPublish,
  checkRouteProtection,
  checkUserLogged,
  checkPDFMake,
  checkXMLBuilder,
  checkFirebaseSingleNotification,
  checkFirebaseMulticastNotification,
} from './app.controller';

const appRouter = express.Router();

appRouter.get(
  '/test-route-protection',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkRouteProtection)
);

appRouter.get(
  '/test-check-authenticated-user',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkUserLogged)
);

appRouter.post(
  '/test-pubsub-publish',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkPubSubPublish)
);

appRouter.post(
  '/test-pubsub-pull-subscription',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkPubSubPullSubscription)
);

appRouter.post(
  '/test-pubsub-push-subscription',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkPubsubPushSubscription)
);

appRouter.post(
  '/test-pdf-make',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkPDFMake)
);

appRouter.post(
  '/test-xml-builder',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkXMLBuilder)
);

appRouter.post(
  '/test-firebase-single-message',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkFirebaseSingleNotification)
);

appRouter.post(
  '/test-firebase-multicast-message',
  requireAuthenticationMiddleware,
  catchAsyncHandler(checkFirebaseMulticastNotification)
);

export default appRouter;
