import express from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'
import auth from 'express-rbac'
import httpStatus from 'http-status'
import config from './config/config.mjs'
import morgan from './config/morgan.mjs'
import cookieParser from "cookie-parser"
import routes from './routes/v1/index.mjs'
import ApiError from './utils/ApiError.mjs'
import {authLimiter} from "./middlewares/rateLimiter.mjs";
import {jwtStrategy} from "./config/passport.mjs";
import {errorConverter, errorHandler} from './middlewares/error.mjs'
import {ROLES} from "./constants/roles.mjs";

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

app.use(cookieParser())

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({extended: true}));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use(jwtStrategy)

// Role-Based Access Control middleware for authorization
app.use(auth.authorize({
        bindToProperty: 'user'
    }, (req, done) => {
        let auth = {
            roles: Object.values(ROLES),
        };
        done(auth);
    })
)

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/v1/auth', authLimiter);
}

app.use('/v1', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app

