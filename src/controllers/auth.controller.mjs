import httpStatus from "http-status"
import catchAsync from "../utils/catchAsync.mjs"
import {authService, tokenService, userService} from '../services/index.mjs'
import config from "../config/config.mjs";

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body)
    const tokens = await tokenService.generateAuthTokens(user)
    res.status(httpStatus.CREATED).send({user, tokens})
})

const login = catchAsync(async (req, res) => {
    const {email, password} = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const {access, refresh} = await tokenService.generateAuthTokens(user);
    res.cookie('jwt', refresh.token, config.jwt.refreshCookieOptions);
    res.status(httpStatus.OK).send({message: "Login successful", user, access});

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
    })
;

const authController = {
    register,
    login,
    logout,
    refreshTokens,
};

export default authController