import express from "express"
import validate from "../../middlewares/validate.mjs"
import {authValidation} from "../../validations/index.mjs"
import {authController} from "../../controllers/index.mjs"
import {isLoggedIn} from "../../middlewares/auth.mjs";

const router = express.Router()

router.post('/register', validate(authValidation.register), authController.register)
router.post('/login', validate(authValidation.login), authController.login)
router.post('/logout', authController.logout)
router.post('/refresh-tokens', authController.refreshTokens)
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword)
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword)
router.post('/send-verification-email', isLoggedIn, authController.sendVerificationEmail)
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail)

export default router
