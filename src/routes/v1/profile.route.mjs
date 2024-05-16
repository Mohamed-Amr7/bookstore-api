import express from "express"
import validate from "../../middlewares/validate.mjs"
import {isLoggedIn} from "../../middlewares/auth.mjs"
import {profileController} from "../../controllers/index.mjs"
import {profileValidation} from "../../validations/index.mjs"

const router = express.Router();
router.use(isLoggedIn)

router.route('/')
    .get(profileController.getUserProfile)
    .put(validate(profileValidation.updateProfile), profileController.updateUserProfile)
    .delete(validate(profileValidation.deleteProfile), profileController.deleteUserProfile);

router.post('/password', validate(profileValidation.changePassword), profileController.changePassword)

export default router