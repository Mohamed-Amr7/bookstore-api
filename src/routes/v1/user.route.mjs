import express from "express";
import validate from "../../middlewares/validate.mjs";
import {isLoggedIn} from "../../middlewares/auth.mjs";
import {userController} from "../../controllers/index.mjs";
import {userValidation} from "../../validations/index.mjs";

const router = express.Router();

router
    .route('/me')
    .get(isLoggedIn,userController.getUserProfile)
    .put(isLoggedIn, validate(userValidation.updateUserProfile), userController.updateUserProfile)
    .delete(isLoggedIn, validate(userValidation.deleteUserProfile), userController.deleteUserProfile);

router.post('/me/password',isLoggedIn, validate(userValidation.changePassword), userController.changePassword)

export default router