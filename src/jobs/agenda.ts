import dotenv from 'dotenv';
import {Agenda} from '@hokify/agenda';
import Logger from '../lib/logger';

dotenv.config();

const {MONGO_URI, MONGO_URI_TEST} = process.env;

interface AgendaDBOptions {
  address: string;
  collection?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
  ensureIndex?: boolean;
}

const agenda = new Agenda({
  db: {
    address:
      <string>process.env.NODE_ENV === 'production'
        ? <string>MONGO_URI
        : <string>MONGO_URI_TEST,
    collection: 'agendaJobs',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ensureIndex: true,
    // maxConcurrency: 20,
  } as AgendaDBOptions,
});

/**
 * CRON JOB
 * @description Check if agenda is working
 */
agenda.define('check_agenda_status', async job => {
  Logger.info('Agenda is working!', job.attrs.data);
});

(async function () {
  const dailyAgendaStatusCheck = agenda.create('check_agenda_status');

  await agenda.start();

  dailyAgendaStatusCheck.repeatEvery('0 8 * * 1-7', {
    skipImmediate: true,
    timezone: 'Europe/Rome',
  });

  dailyAgendaStatusCheck.unique({jobId: 0});

  await dailyAgendaStatusCheck.save();
})();
