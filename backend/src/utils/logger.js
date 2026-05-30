/**
 * Simple console logger with timestamps and log levels
 */
const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;

const format = (level, ...args) => {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}] ${args.join(" ")}`;
};

const logger = {
  error: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.error) console.error(format("error", ...args));
  },
  warn: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.warn) console.warn(format("warn", ...args));
  },
  info: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.info) console.log(format("info", ...args));
  },
  debug: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.debug) console.log(format("debug", ...args));
  },
};

module.exports = logger;
