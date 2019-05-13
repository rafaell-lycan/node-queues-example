const path = require("path");
const process = require("process");
const Queue = require("bull");
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const app = express();
const winston = require("winston");

const logger = require("../../common/util/Logger")(winston);
const getQueueStats = require("../../common/util/QueueStats");
const AddQueueTracking = require("../../common/util/CreateQueueListeners");
const buyItem = require("./events/addItem");
require("../../common/util/Env")(process.cwd());

const { PORT = 3000, SERVER_NAMESPACE = "server", REDIS_URL } = process.env;

const queue = new Queue(SERVER_NAMESPACE, REDIS_URL);
AddQueueTracking(queue, logger);

// Application params
let queueParams = {
  isStoreEnabled: true,
  isWorkerEnabled: true,
  isConnected: true,
  queueName: queue.name || "NONE",
  workerName: queue.token || "NONE"
};

// Enable public as static folder
app.use("/", express.static(path.join(__dirname, "public")));

// Add morgan to log events on Express
app.use(morgan("debug", { stream: logger.stream }));

// Add Handlebars support
app.engine(
  ".hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views", "layouts"),
    defaultLayout: "main",
    extname: ".hbs"
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".hbs");

app.get("/", async (req, res) => {
  const stats = await getQueueStats(queue);

  res.render("index", { ...queueParams, queue: stats });
});

// Adds items to the queue
app.get("/add/:n", async (req, res) => {
  const { n } = req.params;

  // Handle Send to Queue here.
  if (n && n > 0) {
    logger.info(`Adding ${n} items...`);

    for (i = 0; i < n; i++) {
      await buyItem(queue);
    }
  }

  res.redirect("/");
});

app.listen(PORT, () => {
  logger.info(`Example app is running → PORT ${PORT}`);
});
