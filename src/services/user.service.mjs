import httpStatus from "http-status";
import {User} from "../models/index.mjs";
import ApiError from "../utils/ApiError.mjs";

/**
 * Create a user.
 * @param {Object} userBody - The data to create the user with.
 * @param {string} userBody.email - The email of the user.
 * @param {string} userBody.username - The username of the user.
 * @param {string} userBody.password - The password of the user.
 * @returns {Promise<User>} - The created user object.
 * @throws {ApiError} - If the email is already taken.
 */
export const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userBody);
};

/**
 * Get user by ID.
 * @param {ObjectId} id - The ID of the user to retrieve.
 * @returns {Promise<User>} - The user object.
 */
export const getUserById = async (id) => {
    return User.findById(id);
};

/**
 * Get user by email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<User>} - The user object.
 */
export const getUserByEmail = async (email) => {
    return User.findOne({email});
};

/**
 * Update user by ID.
 * @param {ObjectId} userId - The ID of the user to update.
 * @param {Object} updateBody - The data to update the user with.
 * @returns {Promise<User>} - The updated user object.
 * @throws {ApiError} - If the user is not found or the email is already taken.
 */
export const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Delete user by ID.
 * @param {ObjectId} userId - The ID of the user to delete.
 * @returns {Promise<User>} - The deleted user object.
 * @throws {ApiError} - If the user is not found.
 */
export const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await User.findByIdAndDelete(userId)
    return user;
};

/**
 * Change user's password.
 * @param {ObjectId} userId - The ID of the user to change the password for.
 * @param {Object} updateBody - The data containing the current and new passwords.
 * @param {string} updateBody.currentPassword - The user's current password.
 * @param {string} updateBody.newPassword - The new password for the user.
 * @returns {Promise<User>} - The updated user object.
 * @throws {ApiError} - If the user is not found or the current password is incorrect.
 */
export const changePassword = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (!await user.isPasswordMatch(updateBody.currentPassword)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect current password. Please try again.');
    }
    user.password = updateBody.newPassword
    await user.save()
    return user
};


const userService = {
    createUser,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
    changePassword
};

export default userService;