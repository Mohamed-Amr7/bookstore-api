import mongoose from "mongoose"
import {toJSON} from "./plugins/index.mjs";

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
            enum: ['pending', 'shipped', 'delivered'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
    }
)
orderSchema.plugin(toJSON)

const Order = mongoose.model('Order', orderSchema)

export default Order
