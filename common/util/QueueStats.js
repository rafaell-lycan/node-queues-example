module.exports = async function(queue, logger = null) {
  const {
    completed,
    active,
    waiting,
    delayed,
    paused,
    failed
  } = await queue.getJobCounts();

  if (logger) {
    logger.info(`
      Queues Stats:
      Completed: ${completed}
      Active: ${active}
      Waiting: ${waiting}
      Delayed: ${delayed}
      Paused: ${paused}
      Failed: ${failed}
    `);
  }

  return { completed, active, waiting, delayed, paused, failed };
};
