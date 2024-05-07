import mongoose from "mongoose";
import {toJSON} from "./plugins/index.mjs";
import {TOKEN_TYPES} from "../constants/tokens.mjs";

/**
 * @typedef Token
 * @property {string} token - The token value.
 * @property {mongoose.Types.ObjectId} user - The user associated with the token.
 * @property {string} type - The type of token (e.g., refresh, reset password, verify email).
 * @property {Date} expires - The expiration date of the token.
 * @property {boolean} blacklisted - Indicates whether the token is blacklisted.
 * @property {Date} createdAt - The timestamp when the token was created.
 * @property {Date} updatedAt - The timestamp when the token was last updated.
 */
const tokenSchema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: [TOKEN_TYPES.REFRESH, TOKEN_TYPES.RESET_PASSWORD, TOKEN_TYPES.VERIFY_EMAIL],
            required: true,
        },
        expires: {
            type: Date,
            required: true,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

const Token = mongoose.model('Token', tokenSchema);

export default Token;
