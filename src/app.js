import express from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'
import config from './config/config'
import morgan from './config/morgan'
import httpStatus from 'http-status'
import { errorConverter, errorHandler } from './middlewares/error'
import ApiError from './utils/ApiError'

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(passport.initialize());

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app

