import jwt from 'jsonwebtoken'
import moment from 'moment'
import httpStatus from "http-status";
import config from "../config/config.mjs";
import userService from './user.service.mjs'
import {Token} from "../models/index.mjs";
import {TOKEN_TYPES} from "../constants/tokens.mjs";
import ApiError from "../utils/ApiError.mjs";

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({token, type, user: payload.sub, blacklisted: false});
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, TOKEN_TYPES.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
    const user = await userService.getUserByEmail(email)
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email')
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes')
    const resetPasswordToken = generateToken(user.id, expires, TOKEN_TYPES.RESET_PASSWORD)
    await saveToken(resetPasswordToken, user.id, expires, TOKEN_TYPES.RESET_PASSWORD)
    return resetPasswordToken
}

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, TOKEN_TYPES.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user.id, expires, TOKEN_TYPES.VERIFY_EMAIL);
    return verifyEmailToken;
};

const tokenService = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken
};

export default tokenService