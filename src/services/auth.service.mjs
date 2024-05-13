import httpStatus from 'http-status'
import tokenService from './token.service.mjs'
import userService from './user.service.mjs'
import {Token} from '../models/index.mjs'
import {TOKEN_TYPES} from '../constants/index.mjs'
import ApiError from '../utils/ApiError.mjs'

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
    const refreshTokenDoc = await Token.deleteOne({token: refreshToken, type: TOKEN_TYPES.REFRESH, blacklisted: false});
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
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
        const user = await userService.getUserById(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.deleteOne({ _id: refreshTokenDoc._id })
        return tokenService.generateAuthTokens(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, TOKEN_TYPES.RESET_PASSWORD);
        const user = await userService.getUserById(resetPasswordTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await userService.updateUserById(user.id, {password: newPassword});
        await Token.deleteMany({user: user.id, type: TOKEN_TYPES.RESET_PASSWORD});
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, TOKEN_TYPES.VERIFY_EMAIL);
        const user = await userService.getUserById(verifyEmailTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await Token.deleteMany({user: user.id, type: TOKEN_TYPES.VERIFY_EMAIL});
        await userService.updateUserById(user.id, {isEmailVerified: true});
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
};

const authService = {
    loginUserWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
    verifyEmail,
}

export default authService
