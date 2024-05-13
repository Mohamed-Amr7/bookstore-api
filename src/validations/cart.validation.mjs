import Joi from 'joi';
import {objectId} from './custom.validation.mjs';


export const addToCart = {
    body: Joi.object()
        .keys({
            bookId: Joi.string().required().custom(objectId),
            quantity: Joi.number().integer().min(1).required(),
        }).required(),
}

export const updateCartQuantities = {
    body: Joi.object()
        .keys({
            items: Joi.array().items(Joi.object().keys({
                bookId: Joi.string().required().custom(objectId),
                quantity: Joi.number().integer().min(0).required(),
            })).required(),
        }),
};

export const removeFromCart = {
    body: Joi.object()
        .keys({
            items: Joi.array().items(Joi.object().keys({
                bookId: Joi.string().required().custom(objectId),
                quantity: Joi.number().integer().min(1).required(),
            })).required(),
        }),
};

export const removeBookFromCart = {
    params: Joi.object()
        .keys({
            bookId: Joi.string().required().custom(objectId),
        }).required(),
};

const cartValidation = {
    addToCart,
    updateCartQuantities,
    removeFromCart,
    removeBookFromCart,
}

export default cartValidation