import {Message, PubSub, Subscription, Topic} from '@google-cloud/pubsub';
import DatabaseLog, {
  IDatabaseLog,
} from '../../api/v1/database-logs/databaseLog.model';
import Logger from '../../lib/logger';
import {HydratedDocument} from 'mongoose';

const pubSubClient = new PubSub();

/**
 * declare custom payload interface
 */
export interface IPubSubPayload<T> {
  [key: string]: T;
}
/**
 * declare custom error interface
 */
export interface IPubSubPublishError extends Error {
  statusCode: number;
}

export type TPubSubMessage = Message;

/**
 * declare custom error class for PubSub publish error
 * We define a custom class since we want to throw a custom error with a custom status code
 */
class PubSubPublishError extends Error implements IPubSubPublishError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Publish message to PubSub
 * @param payload
 * @param topicName
 * @returns
 */
const publishMessageToPubSubTopic = async <T>(
  payload: IPubSubPayload<T>,
  topicName: string
): Promise<string> => {
  try {
    const dataBuffer = Buffer.from(JSON.stringify(payload));

    const topic: Topic = pubSubClient.topic(topicName);

    if (!(await topic.exists())) {
      throw new PubSubPublishError(`Topic ${topicName} does not exist`, 404);
    }

    const message = {
      data: dataBuffer,
    };

    const response = await topic.publishMessage(message);

    return response;
  } catch (error) {
    Logger.error(error);
    if (error instanceof PubSubPublishError) {
      throw error;
    } else {
      throw new PubSubPublishError(
        `Failed to publish message to topic ${topicName} with error: ${error}`,
        404
      );
    }
  }
};

/**
 *
 * @param subscriptionName
 * @returns {Promise<string>}
 */
const listenForPubSubPullSubscription = async (
  subscriptionName: string,
  timeout: number
): Promise<string> => {
  try {
    const subscriberOptions = {
      flowControl: {
        maxMessages: 10,
      },
    };

    const subscription: Subscription = pubSubClient.subscription(
      subscriptionName,
      subscriberOptions
    );

    const checkSubscriptionExists = await subscription.exists();

    /**
     * Check if subscription exists
     */
    if (!checkSubscriptionExists[0]) {
      throw new PubSubPublishError(
        `Subscription ${subscriptionName} does not exist`,
        404
      );
    }

    // Instantiate the message counter
    let messageCount = 0;

    /**
     * Create an event handler to handle messages
     * @param message
     */
    const messageHandler = async (message: TPubSubMessage): Promise<void> => {
      const data = Buffer.from(message.data).toString('utf8');

      const response = JSON.parse(data);

      /**
       * Create a database log for the message retrieved from PubSub
       * This is jsut for testing purposes to see if the message is being received
       */
      const databaseLog: HydratedDocument<IDatabaseLog> = new DatabaseLog({
        type: 'pubsub-message',
        date: new Date(),
        level: 'info',
        details: {
          channel: 'pubsub',
          message: 'Message retried from PubSub pull subscription',
          status: 'SUCCESS',
          response: {
            ...response,
            messageId: message.id,
          },
        },
      });

      await databaseLog.save();

      Logger.debug(`Received message ${message.id}:`);
      Logger.debug(`\tData: ${message.data}`);
      Logger.debug(`\tAttributes: ${JSON.stringify(message.attributes)}`);
      messageCount += 1;

      message.ack();
    };

    subscription.on('message', messageHandler);

    /**
     * Create an error handler to handle errors
     * @param error
     */
    const errorHandler = (error: Error): void => {
      Logger.error(`Error: ${error}`);
      subscription.removeListener('message', messageHandler);
    };

    subscription.on('error', errorHandler);

    /**
     * Set the timeout to 60 seconds to close the subscriptions
     */
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      subscription.removeListener('error', errorHandler);
      Logger.warn(
        `Subscription: ${subscriptionName} closed after ${timeout}s  - ${messageCount} message(s) received.`
      );
    }, timeout * 1000);

    return `Subscription ${subscriptionName} listening for messages`;
  } catch (error) {
    Logger.error(error);
    if (error instanceof PubSubPublishError) {
      throw error;
    } else {
      throw new PubSubPublishError(
        `Failed to pull message from topic ${subscriptionName} with error: ${error}`,
        404
      );
    }
  }
};

export {
  publishMessageToPubSubTopic,
  listenForPubSubPullSubscription,
  PubSubPublishError,
};
