const Arena = require("bull-arena");
const router = require("express").Router();

const { QUEUE_NAME, REDIS_URL } = process.env;

const arena = Arena(
  {
    queues: [
      {
        name: QUEUE_NAME,
        hostId: "worker",
        url: REDIS_URL
      }
    ]
  },
  {
    basePath: "/monitor",
    disableListen: true
  }
);

module.exports = router.use("/", arena);
