const router = require("express").Router();
const logger = require("../../util/logger");
const { getQueue, getStats } = require("../../util/queueManager");

const { QUEUE_NAME } = process.env;

const queue = getQueue(QUEUE_NAME);

router.get("/:n", async (req, res) => {
  const { n } = req.params;

  // Handle Send to Queue here.
  if (n && n > 0) {
    logger.info(`Adding ${n} items...`);

    for (i = 0; i < n; i++) {
      await queue.add({ id: Date.now(), number: i });
    }
  }

  res.redirect("/");
});

module.exports = router;
