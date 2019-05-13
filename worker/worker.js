const Queue = require("bull");
const winston = require("winston");

const logger = require("../common/util/Logger")(winston);
const AddQueueTracking = require("../common/util/CreateQueueListeners");
require("../common/util/Env")();

const {
  SERVER_NAMESPACE = "server",
  TIMEOUT = 1000,
  CONCURRENCY = 2,
  REDIS_URL
} = process.env;

// Create a Queue
const queue = new Queue(SERVER_NAMESPACE, REDIS_URL, {
  limiter: { max: 12000, duration: 3600000 }, // 12k per hour
  settings: {
    lockDuration: 90000,
    stalledInterval: 75000,
    maxStalledCount: 2
  }
});

AddQueueTracking(queue, logger);

queue.process(CONCURRENCY, (job, done) => {
  const { replyTo = null, correlationId = null } = job.data;

  setTimeout(() => {
    logger.info(`
      JOB ID: ${job.id}
      FROM: ${replyTo || "NONE"}
      REFERENCE: ${correlationId || "NULL"}
      DATA: ${JSON.stringify(job.data)}
    `);

    done();
  }, TIMEOUT);
});

logger.debug(`
  Starting Worker: ${SERVER_NAMESPACE}
  Process ID: ${process.pid}
  Redis Server: ${REDIS_URL || "DEFAULT"}
`);
