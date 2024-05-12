import express from "express"
import {userController} from "../../controllers/index.mjs"
import {isAdmin, isLoggedIn} from "../../middlewares/auth.mjs"
import userValidation from "../../validations/user.validation.mjs";
import validate from "../../middlewares/validate.mjs";

const router = express.Router();
router.use(isLoggedIn, isAdmin)

router.route('/:id')
    .get(validate(userValidation.getUser), userController.getUser)
    .put(validate(userValidation.updateUser), userController.updateUser)

router.route('/:id/admin')
    .post(validate(userValidation.grantAdmin), userController.grantAdmin)
    .delete(validate(userValidation.revokeAdmin), userController.revokeAdmin);

router.route('/:id/order-manager')
    .post(validate(userValidation.grantOrderManager), userController.grantOrderManager)
    .delete(validate(userValidation.revokeOrderManager), userController.revokeOrderManager);

export default router