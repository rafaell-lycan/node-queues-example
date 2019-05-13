const makeMetricKey = require("./CreateQueueKey");

module.exports = function(queue, logger) {
  queue.on("error", function(err) {
    logger.info("METRIC", makeMetricKey(queue, "error"));
    logger.warn(
      "WARNING",
      `Queue ${queue.name} encountered an unexpected error: ${err.message}`
    );
  });

  queue.on("active", function(job, jobPromise) {
    logger.info("METRIC", makeMetricKey(queue, "active"));
  });

  queue.on("completed", function(job, result) {
    logger.info(makeMetricKey(queue, "elapsed"), new Date() - job.timestamp);
    logger.info("METRIC", makeMetricKey(queue, "completed"));
  });

  queue.on("stalled", function(job) {
    logger.info("METRIC", makeMetricKey(queue, "stalled"));
    logger.warn(`Queue ${queue.name} job stalled: '${JSON.stringify(job)}'`);
  });

  queue.on("failed", function(job, err) {
    logger.info("METRIC", makeMetricKey(queue, "failed"));
    logger.warn(
      `Queue ${queue.name} failed to process job '${JSON.stringify(job)}': ${
        err.message
      }`
    );
  });

  queue.on("paused", function() {
    logger.info("METRIC", makeMetricKey(queue, "paused"));
  });

  queue.on("resumed", function(job) {
    logger.info("METRIC", makeMetricKey(queue, "resumed"));
  });
};
