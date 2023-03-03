import {Response} from 'express';
import {CustomError} from '../../../errors/CustomError.error';
import {ICustomExpressRequest} from '../../../middlewares/currentUser.middleware';

import Logger from '../../../lib/logger';
import {
  publishMessageToPubSubTopic,
  listenForPubSubPullSubscription,
  PubSubPublishError,
} from '../../../services/google-pub-sub/pubsub.service';
import {generatePDF, IPDFObject} from '../../../services/pdf/pdf.service';
import {generateXML, IXMLObject} from '../../../services/xml/xml.service';
import {
  IFirebaseMessage,
  sendMulticastFirebaseMessage,
  sendSingleFirebaseMessage,
} from '../../../services/messaging/firebase.service';

/**
 * Test controller - Protected router test
 * @param req - Custom request object
 * @param res - Response object
 */
const checkRouteProtection = (
  req: ICustomExpressRequest,
  res: Response
): void => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Yes you are authenticated and the test is completed',
    },
  });
};

/**
 * Test controller - Check authenticated user
 * @param req
 * @param res
 */
const checkUserLogged = async (req: ICustomExpressRequest, res: Response) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'User logged retrieved',
      userInPassport: req?.user,
      userInSession: req?.session,
      userInCustomMiddleware: req.currentUser,
    });
  } catch (error) {
    Logger.debug(error);
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message);
    }
  }
};

/**
 * Test controller - Check PubSub publish message to a topic
 * @param req
 * @param res
 */
const checkPubSubPublish = async (
  req: ICustomExpressRequest,
  res: Response
) => {
  try {
    const message = await publishMessageToPubSubTopic(
      {test: 'test', message: 'this is a message'},
      'test'
    );

    res.status(200).json({
      status: 'success',
      message: 'Message published to PubSub',
      response: {messageId: message},
    });
  } catch (error) {
    if (error instanceof PubSubPublishError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to publish message to PubSub. Reason not known',
      });
    }
  }
};

/**
 * Test controller - Check PubSub message from a pull subscription
 * @param req
 * @param res
 */
const checkPubSubPullSubscription = async (
  req: ICustomExpressRequest,
  res: Response
) => {
  try {
    const response = await listenForPubSubPullSubscription(
      'test-pull-subscription',
      10
    );

    res.status(200).json({
      status: 'success',
      message: 'Message received from PubSub Pull Subscription',
      response,
    });
  } catch (error) {
    if (error instanceof PubSubPublishError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to listen for pull message. Reason not known',
      });
    }
  }
};

/**
 * Test controller - Check PubSub message from a push subscription
 * @param req
 * @param res
 */
const checkPubsubPushSubscription = async (
  req: ICustomExpressRequest,
  res: Response
) => {
  try {
    const data = Buffer.from(req.body.message.data, 'base64').toString('utf-8');

    const response = await JSON.parse(data);
    Logger.debug(response);

    res.status(200).send('Message received from PubSub Push Subscription');
  } catch (error) {
    Logger.error(error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to listen for push message. Reason not known',
      });
    }
  }
};

/**
 * Test controller - Check PDF generation
 * @param req
 * @param res
 * @returns
 */
const checkPDFMake = async (req: ICustomExpressRequest, res: Response) => {
  try {
    const body: IPDFObject = {
      key: 'value',
    };

    const directory = 'pdfs';

    const response = await generatePDF(body, directory);

    return res.status(200).json({
      status: 'success',
      message: 'PDF generated',
      response,
    });
  } catch (error) {
    Logger.error(error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: `Failed to generate PDF. Reason error: ${error}`,
      });
    }
  }
};

/**
 * Test controller - Check XML generation
 * @param req
 * @param res
 * @returns
 */
const checkXMLBuilder = async (req: ICustomExpressRequest, res: Response) => {
  try {
    const body: IXMLObject = {
      key: 'value',
    };

    const response = await generateXML(body);

    return res.status(200).json({
      status: 'success',
      message: 'XML generated',
      response,
    });
  } catch (error) {
    Logger.error(error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: `Failed to generate PDF. Reason error: ${error}`,
      });
    }
  }
};

/**
 * Test controller - Check Firebase single notification
 * @param req
 * @param res
 */
const checkFirebaseSingleNotification = async (
  req: ICustomExpressRequest,
  res: Response
) => {
  try {
    const {message, userId} = req.body;

    // validate that the message object has the correct interface
    const validatedMessage: IFirebaseMessage = message;

    const response = await sendSingleFirebaseMessage(validatedMessage, userId);

    res.status(200).json({
      status: 'success',
      message: 'Message sent to Firebase',
      response,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to send message to Firebase',
        error,
      });
    }
  }
};

/**
 * Test controller - Check Firebase multicast notification
 * @param req
 * @param res
 */
const checkFirebaseMulticastNotification = async (
  req: ICustomExpressRequest,
  res: Response
) => {
  try {
    const {message, usersId} = req.body;

    // validate that the message object has the correct interface
    const validatedMessage: IFirebaseMessage = message;

    if (!Array.isArray(usersId)) {
      throw new CustomError(400, 'usersId must be an array');
    }

    const response = await sendMulticastFirebaseMessage(
      validatedMessage,
      usersId
    );

    res.status(200).json({
      status: response.status,
      message: response.message,
      response: response.response,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to send message to Firebase',
        error,
      });
    }
  }
};

export {
  checkRouteProtection,
  checkUserLogged,
  checkPubSubPublish,
  checkPubSubPullSubscription,
  checkPubsubPushSubscription,
  checkPDFMake,
  checkXMLBuilder,
  checkFirebaseSingleNotification,
  checkFirebaseMulticastNotification,
};
