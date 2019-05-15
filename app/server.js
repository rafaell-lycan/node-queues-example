const path = require('path');
const process = require('process');
const express = require('express');
const pino = require('express-pino-logger');
const handlebars = require('express-handlebars');
require('dotenv').config();

const logger = require('../util/logger');
const { PORT = 3000, QUEUE_NAME, REDIS_URL, SQREEN_TOKEN } = process.env;

// Enable Sqreen to check app vulerabilities
require('../util/sqreen')(SQREEN_TOKEN);

const { createQueue, addListeners } = require('../util/queueManager');
const queue = createQueue(QUEUE_NAME, REDIS_URL);
addListeners(queue, logger);

const app = express();
app.use('/', require('./routes'));

// Enable public as static folder
app.use('/', express.static(path.join(__dirname, 'public')));

// Add pino to log events on Express
app.use(pino());

// Add Handlebars support
app.engine(
  '.hbs',
  handlebars({
    defaultLayout: 'main',
    extname: '.hbs'
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.listen(PORT, () => {
  logger.info(`Example app is running → PORT ${PORT}`);
});
