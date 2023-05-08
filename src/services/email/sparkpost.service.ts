import SparkPost from 'sparkpost';
import {CustomError} from '../../errors';
import Logger from '../../lib/logger';

/**
 * Send reset password token to user email
 * @param email
 * @param token
 * @returns Promise<SparkPost.ResultsPromise<{ total_rejected_recipients: number; total_accepted_recipients: number; id: string; }>>
 */
const sendResetPasswordToken = async (
  email: string,
  token: string
): Promise<
  SparkPost.ResultsPromise<{
    total_rejected_recipients: number;
    total_accepted_recipients: number;
    id: string;
  }>
> => {
  const {SPARKPOST_API_KEY, SPARKPOST_SENDER_DOMAIN} = process.env;
  try {
    const euClient = new SparkPost(SPARKPOST_API_KEY, {
      origin: 'https://api.eu.sparkpost.com:443',
    });

    const transmission = {
      recipients: [
        {
          address: {
            email,
            name: email,
          },
        },
      ],
      content: {
        from: {
          email: `support@${SPARKPOST_SENDER_DOMAIN}`,
          name: 'Support Email',
        },
        subject: 'Reset your password',
        reply_to: `support@${SPARKPOST_SENDER_DOMAIN}`,
        text: `Hello ${email}, we heard you lost your password. You can recover with this token: ${token}`,
      },
    };
    return await euClient.transmissions.send(transmission);
  } catch (error) {
    Logger.error(error);
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message);
    }
    // here we are throwing an error instead of returning it
    throw error;
  }
};

export {sendResetPasswordToken};
