import Joi from 'joi';
import {objectId} from './custom.validation.mjs';
import {ORDER_STATUS, PAYMENT_METHODS} from "../constants/index.mjs";

export const queryOrders = {
    query: Joi.object()
        .keys({
            page: Joi.number().integer().min(1),
            limit: Joi.number().integer().min(1),
            status: Joi.string().valid(...Object.values(ORDER_STATUS)),
        }),
};


export const addOrder = {
    body: Joi.object()
        .keys({
            paymentMethod: Joi.string().valid(...Object.values(PAYMENT_METHODS)).required(),
            shippingAddress: Joi.string(),
            contactNumber: Joi.string(),
            additionalDetails: Joi.string(),
        }),
};

export const getOrder = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

export const deleteOrder = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

export const updateOrderStatus = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
    body: Joi.object()
        .keys({
            status: Joi.string().valid(...Object.values(ORDER_STATUS)).required(),
        }),
};

const orderValidation = {
    queryOrders,
    addOrder,
    getOrder,
    deleteOrder,
    updateOrderStatus,
}

export default orderValidation
