require('dotenv').config();

const logger = require('../util/logger');
const { createQueue, addListeners } = require('../util/queueManager');

const {
  QUEUE_NAME,
  TIMEOUT = 1000,
  CONCURRENCY = 1,
  REDIS_URL,
  SQREEN_TOKEN
} = process.env;

// Enable Sqreen to check app vulerabilities
require('../util/sqreen')(SQREEN_TOKEN);

// Create a Queue
const queue = createQueue(QUEUE_NAME, REDIS_URL, {
  limiter: { max: 12000, duration: 3600000 }, // 12k per hour
  settings: {
    lockDuration: 90000,
    stalledInterval: 75000,
    maxStalledCount: 2
  }
});

addListeners(queue, logger);

queue.process(CONCURRENCY, (job, done) => {
  const { replyTo = null, correlationId = null } = job.data;

  setTimeout(() => {
    logger.info(`
      JOB ID: ${job.id}
      FROM: ${replyTo || 'NONE'}
      REFERENCE: ${correlationId || 'NULL'}
      DATA: ${JSON.stringify(job.data)}
    `);

    done();
  }, TIMEOUT);
});

logger.info(`
  Starting Worker: ${QUEUE_NAME}
  Concurrency: ${CONCURRENCY}
  Process ID: ${process.pid}
  Redis Server: ${REDIS_URL || 'DEFAULT'}
`);
