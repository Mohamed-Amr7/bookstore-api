import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config();

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3000),
        CLIENT_URL: Joi.string().uri().description('full URL (including protocol) where the frontend application is hosted.'),
        MONGODB_URI: Joi.string().required().description('Mongo DB URI'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which verify email token expires'),
        SMTP_SERVICE: Joi.string().description('service used to send emails'),
        SMTP_USERNAME: Joi.string().description('username for email server'),
        SMTP_PASSWORD: Joi.string().description('password for email server'),
    })
    .unknown();

const {value: envVars, error} = envVarsSchema.prefs({errors: {label: 'key'}}).validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    clientUrl: envVars.CLIENT_URL,
    mongoose: {
        uri: envVars.MONGODB_URI + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        refreshCookieOptions: {
            httpOnly: true,
            sameSite: 'Strict',
            secure: true,
            maxAge: envVars.JWT_REFRESH_EXPIRATION_DAYS  * 24 * 60 * 60 * 1000,
        }
    },
    email: {
        smtp: {
            service:envVars.SMTP_SERVICE,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
    },
}

export default config
