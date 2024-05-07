import mongoose from "mongoose";
import {toJSON} from "./plugins/index.mjs";

/**
 * @typedef Cart
 * @property {string} _id - The ID of the cart
 * @property {string} user - The user associated with the cart
 * @property {Array<{ book: string, quantity: number }>} items - Array of items in the cart, each containing the book ID and quantity
 * @property {Date} createdAt - The timestamp when the cart was created
 * @property {Date} updatedAt - The timestamp when the cart was last updated
 */
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
cartSchema.options.toJSON = {
    transform: (doc, ret) => {
        if (ret.items && Array.isArray(ret.items)) {
            ret.items.forEach(item => {
                item.id = item._id.toString();
                delete item._id;
            });
        }
    }
};

cartSchema.plugin(toJSON);

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
