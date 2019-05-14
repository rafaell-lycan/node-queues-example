const path = require('path');
const fs = require('fs');
const pino = require('pino');
const prettifier = require('pino-pretty');

const logPath = path.resolve(process.cwd(), 'logs');

try {
  fs.statSync(logPath);
} catch (e) {
  fs.mkdirSync(logPath);
}

const prettyOptions = {
  prettyPrint: {
    levelFirst: true
  },
  prettifier
};

class Logger {
  constructor(options = {}, pinoOptions = {}) {
    this.options = Object.assign({}, options);
    this.pinoOptions = Object.assign(
      {
        name: 'app'
      },
      pinoOptions
    );

    this.logger = this.createLogger(null, this.options.destination);
    this.consoleLogger = this.createConsoleLogger();
  }

  createLogger(options, destination) {
    return pino(
      Object.assign(this.pinoOptions, options),
      destination || pino.destination(path.join(logPath, 'app.log'))
    );
  }

  createConsoleLogger(options) {
    return pino(Object.assign(prettyOptions, options));
  }

  log(type = 'info', ...rest) {
    this.consoleLogger[type](...rest);
    this.logger[type](...rest);
  }

  trace(...rest) {
    this.log('trace', ...rest);
  }
  debug(...rest) {
    this.log('debug', ...rest);
  }
  info(...rest) {
    this.log('info', ...rest);
  }
  warn(...rest) {
    this.log('warn', ...rest);
  }
  fatal(...rest) {
    this.log('fatal', ...rest);
  }
  error(...rest) {
    this.log('error', ...rest);
  }
}

module.exports = new Logger();
