import mongoose from "mongoose";
import {toJSON} from "./plugins/index.mjs";

const cartSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        items: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Book'
                },
                quantity: Number
            }
        ]
    },
    {
        timestamps: true,
    }
)

cartSchema.plugin(toJSON)

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
