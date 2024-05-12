import httpStatus from "http-status"
import catchAsync from "../utils/catchAsync.mjs"
import {userService} from '../services/index.mjs'

const getUserProfile = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.user.id);
    res.send(user);
});

const updateUserProfile = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.user.id, req.body)
    res.send(user)
});

const deleteUserProfile = catchAsync(async (req, res) => {
    await userService.deleteUserById(req.user.id, req.body.password);
    res.status(httpStatus.OK).json({message: "Account deleted successfully"})
});

const changePassword = catchAsync(async (req, res) => {
    await userService.changePassword(req.user.id, req.body);
    res.status(httpStatus.OK).json({message: "Password Changed Successfully"})
});

const profileController = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    changePassword
};

export default profileController