import {initClient, ConversationParameter} from 'messagebird';
import Logger from '../../lib/logger';
import DatabaseLog, {
  IDatabaseLog,
} from '../../api/v1/database-logs/databaseLog.model';
import {HydratedDocument} from 'mongoose';

const sendWhatsappMessageWithMessagebird = (toNumber: string): void => {
  const {
    MESSAGEBIRD_ACCESS_KEY,
    MESSAGEBIRD_WHATSAPP_CHANNEL_ID,
    MESSAGEBIRD_TEMPLATE_NAMESPACE_ID,
    MESSAGEBIRD_TEMPLATE_NAME_TEST,
  } = process.env;

  const messagebird = initClient(<string>MESSAGEBIRD_ACCESS_KEY);

  const params: ConversationParameter = {
    to: toNumber,
    from: <string>MESSAGEBIRD_WHATSAPP_CHANNEL_ID,
    type: 'hsm',
    reportUrl: 'https://your.report.url',
    content: {
      hsm: {
        namespace: <string>MESSAGEBIRD_TEMPLATE_NAMESPACE_ID,
        templateName: <string>MESSAGEBIRD_TEMPLATE_NAME_TEST,
        language: {
          code: 'en',
          policy: 'deterministic',
        },
        components: [
          {
            type: 'body',
            parameters: [{type: 'text', text: 'Variable 1'}],
          },
        ],
      },
    },
  };

  messagebird.conversations.send(params, async (err, response) => {
    if (err) {
      Logger.error(err);
      const databaseLog: HydratedDocument<IDatabaseLog> = new DatabaseLog({
        type: 'message',
        date: new Date(),
        level: 'error',
        details: {
          channel: 'whatsapp',
          message: 'No message was sent',
          status: 'ERROR',
          response: {...err, recipient: toNumber},
        },
      });

      await databaseLog.save();
    } else {
      console.log('response', response);
      Logger.info(response);

      /**
       * Save the message to the database using the log model
       */
      const databaseLog: HydratedDocument<IDatabaseLog> = new DatabaseLog({
        type: 'message',
        date: new Date(),
        level: 'info',
        details: {
          channel: 'whatsapp',
          message: <string>MESSAGEBIRD_TEMPLATE_NAME_TEST,
          status: 'SUCCESS',
          response: {...response, recipient: toNumber},
        },
      });
      await databaseLog.save();
    }
  });
};

export {sendWhatsappMessageWithMessagebird};
