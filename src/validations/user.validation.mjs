import Joi from 'joi'
import {objectId, password, phoneNumber} from './custom.validation.mjs'
import {ROLES} from "../constants/roles.mjs";

export const getUser = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

export const updateUser = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
    body: Joi.object()
        .keys({
            name: Joi.string().required(),
            email: Joi.string().email(),
            password: Joi.string().custom(password),
            isEmailVerified: Joi.bool(),
            role: Joi.string().valid(...Object.values(ROLES)),
            address: Joi.string(),
            phone: Joi.string().trim().custom(phoneNumber),
        }).min(1),
};

export const grantAdmin = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

export const revokeAdmin = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

export const grantOrderManager = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

export const revokeOrderManager = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

export default {
    getUser,
    updateUser,
    grantAdmin,
    revokeAdmin,
    grantOrderManager,
    revokeOrderManager,
};

