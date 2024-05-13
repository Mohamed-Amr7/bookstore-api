import express from 'express'
import {cartController} from '../../controllers/index.mjs'
import {cartValidation} from '../../validations/index.mjs'
import {isLoggedIn} from '../../middlewares/auth.mjs'
import validate from "../../middlewares/validate.mjs";

const router = express.Router()
router.use(isLoggedIn)

router.route('/')
    .get(cartController.getCart)
    .post(validate(cartValidation.addToCart), cartController.addToCart)
    .put(validate(cartValidation.updateCartQuantities), cartController.updateCartQuantities)
    .delete(validate(cartValidation.removeFromCart), cartController.removeFromCart);

router.delete('/:bookId',validate(cartValidation.removeBookFromCart), cartController.removeBookFromCart);

export default router
