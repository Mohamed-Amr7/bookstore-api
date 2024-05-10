import express from "express"
import {orderController} from "../../controllers/index.mjs";
import {isLoggedIn} from "../../middlewares/auth.mjs";

const router = express.Router()
router.use(isLoggedIn)

router.route('/')
    .get(orderController.getOrders)
    .post(orderController.addOrder)

router.route('/:id')
    .get(orderController.getOrder)
    .delete(orderController.deleteOrder);

router.route('/:id/status')
    .patch(orderController.updateOrderStatus);


export default router

