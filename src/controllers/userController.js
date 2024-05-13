import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync.mjs'
import {userService} from '../services/index.mjs'
import {ROLES} from '../constants/index.mjs'

const getUser = catchAsync(async (req, res) => {
    const {id: userId} = req.params
    const user = await userService.getUserById(userId);
    res.status(httpStatus.OK).json({message: "User retrieved successfully", data: {user}});
})

const updateUser = catchAsync(async (req, res) => {
    const {id: userId} = req.params
    const userData = req.body;
    const updatedUser = await userService.updateUserById(userId, userData);
    res.status(httpStatus.OK).json({message: "User details updated successfully", data: {user: updatedUser}});
})

const grantAdmin = catchAsync(async (req, res) => {
    const {id: userId} = req.params
    const user = await userService.grantAdmin(userId)
    res.status(httpStatus.OK).json({message: "Admin role granted successfully", data: {user}})
})

const grantOrderManager = catchAsync(async (req, res) => {
    const {id: userId} = req.params
    const user = await userService.grantOrderManager(userId);
    res.status(httpStatus.OK).json({message: "Order manager role granted successfully", data: {user}});
})

const revokeAdmin = catchAsync(async (req, res) => {
    const {id: userId} = req.params
    const user = await userService.setRole(userId, ROLES.USER)
    res.status(httpStatus.OK).json({message: "Admin role revoked successfully", data: {user}})
})

const revokeOrderManager = catchAsync(async (req, res) => {
    const {id: userId} = req.params
    const user = await userService.setRole(userId, ROLES.USER);
    res.status(httpStatus.OK).json({message: "Order manager role revoked successfully", data: {user}});
})


const userController = {
    getUser,
    updateUser,
    grantAdmin,
    grantOrderManager,
    revokeAdmin,
    revokeOrderManager,
};

export default userController