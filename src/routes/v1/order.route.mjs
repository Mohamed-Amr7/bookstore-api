import express from 'express'
import {orderController} from '../../controllers/index.mjs'
import {orderValidation} from '../../validations/index.mjs'
import {isLoggedIn} from '../../middlewares/auth.mjs'
import validate from '../../middlewares/validate.mjs'

const router = express.Router()
router.use(isLoggedIn)

router.route('/')
    .get(validate(orderValidation.queryOrders), orderController.queryOrders)
    .post(validate(orderValidation.addOrder), orderController.addOrder)

router.route('/:id')
    .get(validate(orderValidation.getOrder), orderController.getOrder)
    .delete(validate(orderValidation.deleteOrder), orderController.deleteOrder);

router.route('/:id/status')
    .patch(validate(orderValidation.updateOrderStatus), orderController.updateOrderStatus);


export default router

