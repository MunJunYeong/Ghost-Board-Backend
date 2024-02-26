import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import { GetEnvPath, ProdEnvPath } from "../utils/path";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// production level 일 경우 `warn` level 이상만 log 저장함.
const level = () => {
  return GetEnvPath() === ProdEnvPath ? "warn" : "debug";
};

// error
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
});

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => `[${info.timestamp}] | [${info.level}] | ${info.message}`)
);

const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
  new winstonDaily({
    level: "info",
    datePattern: "YYYY-MM-DD",
    dirname: `logs/info`,
    filename: `info.log`,
    maxFiles: 30,
    zippedArchive: true,
  }),

  new winstonDaily({
    level: "error",
    datePattern: "YYYY-MM-DD",
    dirname: `logs/error`,
    filename: `error.log`,
    maxFiles: 30,
    zippedArchive: true,
  }),
];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
