import winston from 'winston'
import config from './config.js'

const enumerateErrorFormat = winston.format((info) => {
  info instanceof Error && Object.assign(info, { message: info.stack });

  return info;
});

export default
winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

