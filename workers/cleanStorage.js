require('dotenv').config();

const logger = require('../util/logger');
const { createQueue, addListeners } = require('../util/queueManager');

const { QUEUE_NAME, REDIS_URL, SQREEN_TOKEN } = process.env;

// Enable Sqreen to check app vulerabilities
require('../util/sqreen')(SQREEN_TOKEN);

// Create a Queue
const queue = createQueue('housekeeper', REDIS_URL);
addListeners(queue, logger);

queue.process(async () => {
  logger.info(`Cleaning storage for queue ${QUEUE_NAME}...`);
  try {
    const dirtyQueue = createQueue(QUEUE_NAME, REDIS_URL);
    await dirtyQueue.clean(1000);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
});

queue.add(null, { repeat: { cron: '0 0 * * *' } });
