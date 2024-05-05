import Joi from 'joi'
import {password} from './custom.validation.mjs'

const updateUserProfile = {
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            name: Joi.string(),
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


const deleteUserProfile = {
    body: Joi.object()
        .keys({
            password: Joi.string().required().custom(password),
        })
};

const userValidation = {
    updateUserProfile,
    deleteUserProfile,
    changePassword,
};
export default userValidation