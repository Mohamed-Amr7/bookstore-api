import express from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'

const app = express();

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
module.exports = app;
