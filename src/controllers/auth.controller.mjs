import httpStatus from "http-status"
import catchAsync from "../utils/catchAsync.mjs"
import {authService, emailService, tokenService, userService} from '../services/index.mjs'
import config from "../config/config.mjs";

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body)
    res.status(httpStatus.CREATED).json({message: "User created successfully", data: {user}})
})

const login = catchAsync(async (req, res) => {
    const {email, password} = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const {access: accessToken, refresh} = await tokenService.generateAuthTokens(user);
    res.cookie('jwt', refresh.token, config.jwt.refreshCookieOptions);
    res.status(httpStatus.OK).json({message: "Login successful", data: {user, accessToken}});

});

const logout = catchAsync(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(httpStatus.NO_CONTENT)
    }
    await authService.logout(cookies.jwt);
    res.clearCookie('jwt', config.jwt.refreshCookieOptions);
    res.sendStatus(httpStatus.NO_CONTENT);
});

const refreshTokens = catchAsync(async (req, res) => {
    const {access, refresh} = await authService.refreshAuth(req.cookies.jwt)
    res.cookie('jwt', refresh.token, config.jwt.refreshCookieOptions)
    res.send({access});
});

const forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
    await authService.resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.OK).json({message: 'Password reset successful'});
});

const sendVerificationEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
    await authService.verifyEmail(req.query.token);
    res.status(httpStatus.OK).json({message: 'Email verified successfully'});
});

const authController = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
};

export default authController