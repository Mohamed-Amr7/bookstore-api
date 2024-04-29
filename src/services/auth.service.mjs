import httpStatus from "http-status";
import tokenService from './token.service.mjs'
import userService from './user.service.mjs'
import {Token} from "../models/index.mjs";
import ApiError from "../utils/ApiError.mjs";
import {tokenTypes} from "../config/tokens.mjs";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.deleteOne({token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false});
    if (refreshTokenDoc.deletedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found');
    }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await userService.getUserById(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.deleteOne({_id: refreshTokenDoc._id})
        return tokenService.generateAuthTokens(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};


const authService = {
    loginUserWithEmailAndPassword,
    logout,
    refreshAuth,
}

export default authService
