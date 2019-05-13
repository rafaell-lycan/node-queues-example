const router = require("express").Router();
const { getQueue, getStats } = require("../../util/queueManager");

const { QUEUE_NAME } = process.env;

const queue = getQueue(QUEUE_NAME);

// Application params
const queueParams = {
  isStoreEnabled: true,
  isWorkerEnabled: true,
  isConnected: true,
  queueName: queue.name || "NONE",
  workerName: queue.token || "NONE"
};

router.get("/", async (_, res) => {
  const stats = await getStats(queue);

  res.render("index", { ...queueParams, queue: stats });
});

module.exports = router;
