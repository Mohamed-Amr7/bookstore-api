import Joi from 'joi'
import {password, phoneNumber} from './custom.validation.mjs'

const updateProfile = {
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            name: Joi.string(),
            address: Joi.string(),
            phone: Joi.string().trim().custom(phoneNumber),
        })
        .min(1),
}

const changePassword = {
    body: Joi.object()
        .keys({
            currentPassword: Joi.string().required().custom(password).label('currentPassword'),
            newPassword: Joi.string()
                .required()
                .custom(password)
                .not(Joi.ref('currentPassword'))
                .messages({
                    'any.invalid': '{{#label}} must be different from "currentPassword"',
                }),
        })
};


const deleteProfile = {
    body: Joi.object()
        .keys({
            password: Joi.string().required().custom(password),
        })
};

const profileValidation = {
    updateProfile,
    deleteProfile,
    changePassword,
};
export default profileValidation
