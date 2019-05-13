module.exports = winston => {
  const options = {
    file: {
      level: "info",
      filename: `${process.cwd()}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    },
    console: {
      level: "debug",
      prettyPrint: true,
      json: true,
      handleExceptions: true,
      colorize: true,
      format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint()
      )
    }
  };

  const logger = new winston.createLogger({
    transports: [
      new winston.transports.Console(options.console),
      new winston.transports.File(options.file)
    ],
    exitOnError: false // do not exit on handled exceptions
  });

  logger.stream = {
    write: function(message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.info(message);
    }
  };

  return logger;
};
