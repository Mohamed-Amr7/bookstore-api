import mongoose from "mongoose"
import {toJSON} from "./plugins/index.mjs"
import {bookService} from "../services/index.mjs";

/**
 * @typedef {Object} CartItem
 * @property {string} book - The ID of the book.
 * @property {number} quantity - The quantity of the book.
 */

/**
 * @typedef Cart
 * @property {string} _id - The ID of the cart.
 * @property {mongoose.Types.ObjectId} user - The user associated with the cart.
 * @property {CartItem[]} items - Array of items in the cart, each containing the book ID and quantity.
 * @property {Date} createdAt - The timestamp when the cart was created.
 * @property {Date} updatedAt - The timestamp when the cart was last updated.
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

cartSchema.pre('save', async function (next) {
    const cart = this;
    const updatedItems = [];

    for (const item of cart.items) {
        const book = await bookService.getBookById(item.book);
        if (!book) {
            continue;
        }
        updatedItems.push(item);
    }

    cart.items = updatedItems;
    next();
});

cartSchema.plugin(toJSON);

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
