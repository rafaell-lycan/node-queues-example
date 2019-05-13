const router = require("express").Router();
const Arena = require("bull-arena");
require("dotenv").config({ silent: true });

const {
  SERVER_NAMESPACE = "server",
  CLIENT_NAMESPACE = "client",
  REDIS_URL
} = process.env;

const queues = [];
const queuesEnv = [SERVER_NAMESPACE, CLIENT_NAMESPACE];

queuesEnv.forEach(name => {
  queues.push({
    name,
    hostId: "Worker",
    url: REDIS_URL
  });
});

const arena = Arena({
  queues
});
router.use("/", arena);
