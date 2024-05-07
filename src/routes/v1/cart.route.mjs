import express from "express"
import {cartController} from "../../controllers/index.mjs";
import {isLoggedIn} from "../../middlewares/auth.mjs";

const router = express.Router()
router.use(isLoggedIn)

router.route('/')
    .get(cartController.getCart)
    .post(cartController.addToCart)
    .put(cartController.updateCartQuantities)
    .delete(cartController.removeFromCart);

router.delete('/:bookId', cartController.removeBookFromCart);

export default router
