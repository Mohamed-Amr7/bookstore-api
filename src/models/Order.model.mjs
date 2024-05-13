import mongoose from "mongoose"
import {paginate, toJSON} from "./plugins/index.mjs"
import {User} from "./index.mjs"
import {ORDER_STATUS} from "../constants/index.mjs";

/**
 * @typedef {Object} OrderItem
 * @property {mongoose.Types.ObjectId} book - The ID of the book.
 * @property {number} quantity - The quantity of the book.
 */

/**
 * @typedef {Object} Order
 * @property {mongoose.Types.ObjectId} user - The ID of the user who placed the order.
 * @property {OrderItem[]} items - The items in the order.
 * @property {string} status - The status of the order (pending, confirmed, shipped, delivered).
 * @property {Date} createdAt - The creation date of the order.
 * @property {Date} updatedAt - The last update date of the order.
 * @property {string} [shippingAddress] - The shipping address for the order.
 * @property {string} [paymentMethod] - The payment method used for the order.
 * @property {string} [contactNumber] - The contact number associated with the order.
 * @property {string} [additionalDetails] - Additional details or notes for the order.
 */
const orderSchema = new mongoose.Schema({
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
        ],
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: 'pending'
        },
        shippingAddress: {
            type: String,
        },
        paymentMethod: {
            type: String,
            enum: ['credit_card', 'paypal', 'cash_on_delivery'],
        },
        contactNumber: {
            type: String,
            trim: true
        },
        additionalDetails: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
    }
)

orderSchema.pre('save', async function(next) {
    if(this.shippingAddress && this.contactNumber) next();
    try {
        const user = await User.findById(this.user).exec();
        if (user && !this.shippingAddress) {
            this.shippingAddress = user.address;
        }
        if (user && !this.contactNumber) {
            this.contactNumber = user.phone;
        }
        next();
    } catch (error) {
        next(error);
    }
});

orderSchema.options.toJSON = {
    transform: (doc, ret) => {
        if (ret.items && Array.isArray(ret.items)) {
            ret.items.forEach(item => {
                item.id = item._id.toString();
                delete item._id;
            });
        }
    }
};

orderSchema.plugin(toJSON)
orderSchema.plugin(paginate)

const Order = mongoose.model('Order', orderSchema)

export default Order
