const express = require('express');
const router = express.Router();
const Queue = require('bull')
const Arena = require('bull-arena');
require('dotenv').config({ silent: true });

const {
  SERVER_NAMESPACE = 'server',
  CLIENT_NAMESPACE = 'client',
  REDIS_URL
} = process.env;

const arena = Arena({
  queues: [
    {
      name: SERVER_NAMESPACE,
      hostId: 'Worker',
      url: REDIS_URL
    },
    {
      name: CLIENT_NAMESPACE,
      hostId: 'Worker',
      url: REDIS_URL
    }
  ]
});
router.use('/', arena);
