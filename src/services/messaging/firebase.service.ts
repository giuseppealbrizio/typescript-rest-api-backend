import {getMessaging} from 'firebase-admin/messaging';
import {CustomError} from '../../errors';

export interface IFirebaseMessage {
  title: string;
  body: string;
}

/**
 * Send a single firebase message
 * @param message
 * @param userFirebaseToken
 * @returns
 */
const sendSingleFirebaseMessage = async (
  message: IFirebaseMessage,
  userFirebaseToken: string
): Promise<object> => {
  const {title, body} = message;

  const messageObject = {
    data: {
      title,
      body,
    },
    token: userFirebaseToken,
  };

  try {
    const response = await getMessaging().send(messageObject);

    return {message: 'Successfully sent message', response};
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message);
    }

    throw error;
  }
};

/**
 * Send a multicast firebase message
 * @param message
 * @param usersFirebaseTokens
 * @returns
 */
const sendMulticastFirebaseMessage = async (
  message: IFirebaseMessage,
  usersFirebaseTokens: Array<string>
): Promise<{
  status: string;
  message: string;
  response: object;
  failedTokens?: string[];
}> => {
  const {title, body} = message;

  const messageObject = {
    data: {
      title,
      body,
    },
    tokens: usersFirebaseTokens,
  };

  try {
    const response = await getMessaging().sendMulticast(messageObject);

    if (response.failureCount > 0 && response.successCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(usersFirebaseTokens[idx]);
        }
      });

      return {
        status: 'incomplete',
        message: 'Some messages were not sent to users',
        response,
        failedTokens,
      };
    } else if (response.successCount === 0) {
      return {
        status: 'error',
        message: 'Failed to send all messages to users',
        response,
        failedTokens: usersFirebaseTokens,
      };
    } else {
      return {
        status: 'success',
        message: 'Successfully sent message to all users',
        response,
        failedTokens: [],
      };
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message);
    }

    throw error;
  }
};

export {sendSingleFirebaseMessage, sendMulticastFirebaseMessage};
