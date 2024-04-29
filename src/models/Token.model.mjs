import mongoose from "mongoose";
import {toJSON} from "./plugins/index.mjs";
import {TOKEN_TYPES} from "../constants/tokens.mjs";

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

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);

export default Token;
