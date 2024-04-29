import express from "express"
import validate from "../../middlewares/validate.mjs"
import {authValidation} from "../../validations/index.mjs"
import {authController} from "../../controllers/index.mjs"

const router = express.Router()

router.post('/register', validate(authValidation.register), authController.register)
router.post('/login', validate(authValidation.login), authController.login)
router.post('/logout', authController.logout)
router.post('/refresh-tokens', authController.refreshTokens)

export default router
