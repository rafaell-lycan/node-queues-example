const Queue = require('bull');

const defaultQueueName = 'TEST';
const queueList = {};

const createQueue = (name = defaultQueueName, uri, config = {}) => {
  const queue = new Queue(name, uri, config);
  queueList[name] = queue;
  return queue;
};

const getQueue = (queueName = defaultQueueName) => {
  if (queueList[queueName]) {
    return queueList[queueName];
  }

  throw Error(`Queue ${queueName} not found.`);
};

const getStats = async queue => {
  const stats = await queue.getJobCounts();
  return stats;
};

const makeMetricKey = (queue, event) => {
  return ['app', 'bull', queue.name, event].join('.');
};

const addListeners = (queue, logger) => {
  queue.on('error', function(err) {
    logger.info('METRIC', makeMetricKey(queue, 'error'));
    logger.warn(
      `Queue ${queue.name} encountered an unexpected error: ${err.message}`
    );
  });

  queue.on('active', function() {
    logger.info('METRIC', makeMetricKey(queue, 'active'));
  });

  queue.on('completed', function(job) {
    logger.info(
      'TIMING',
      makeMetricKey(queue, 'elapsed'),
      new Date() - job.timestamp
    );
    logger.info('METRIC', makeMetricKey(queue, 'completed'));
  });

  queue.on('stalled', function(job) {
    logger.info('METRIC', makeMetricKey(queue, 'stalled'));
    logger.warn(`Queue ${queue.name} job stalled: '${JSON.stringify(job)}'`);
  });

  queue.on('failed', function(job, err) {
    logger.info('METRIC', makeMetricKey(queue, 'failed'));
    logger.warn(
      `Queue ${queue.name} failed to process job '${JSON.stringify(job)}': ${
        err.message
      }`
    );
  });

  queue.on('paused', function() {
    logger.info('METRIC', makeMetricKey(queue, 'paused'));
  });

  queue.on('resumed', function() {
    logger.info('METRIC', makeMetricKey(queue, 'resumed'));
  });
};

module.exports = {
  createQueue,
  getQueue,
  addListeners,
  getStats
};
