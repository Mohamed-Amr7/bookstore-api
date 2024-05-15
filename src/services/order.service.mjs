import httpStatus from "http-status"
import ApiError from "../utils/ApiError.mjs"
import {Book, Order} from "../models/index.mjs"
import {bookService, cartService} from "./index.mjs";
import logger from "../config/logger.mjs";

const MAX_RETRY_COUNT = 5

const queryOrders = async (userId, query) => {
    const {page = 1, limit = 10, ...filters} = query
    let status, paginatedOrders
    if (filters?.status) {
        status = filters.status
    }
    const options = {
        page,
        limit,
        sort: {createdAt: -1}
    }
    try {
        paginatedOrders = await Order.paginate(status ? {"status": status} : {}, options);
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error fetching orders")
    }
    if (paginatedOrders.docs.length === 0 && Object.keys(filters).length !== 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No orders found matching your search criteria")
    }
    if (paginatedOrders.docs.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No orders found")
    }
    return paginatedOrders;
}

const getOrder = async (userId, id) => {
    let order
    try {
        order = await (await Order.findOne({_id: id, user: userId})).populate('items.book');
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error Fetching Order")
    }
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    return order;
}

const addOrder = async (userId, orderDetails) => {
    let order
    let updatedBooks = []
    const cart = await cartService.getCartByUserId(userId)
    if (cart.items.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Cannot create order because the cart is empty");
    }
    try {
        order = await (await Order.create({
            user: userId,
            items: cart.items,
            paymentMethod: orderDetails.paymentMethod,
            ...(orderDetails.shippingAddress && {shippingAddress: orderDetails.shippingAddress}),
            ...(orderDetails.contactNumber && {contactNumber: orderDetails.contactNumber}),
            ...(orderDetails.additionalDetails && {additionalDetails: orderDetails.additionalDetails})
        })).populate('items.book');
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to add order", true, error.message);
    }
    if (!order.shippingAddress) {
        await Order.findByIdAndDelete(order.id);
        throw new ApiError(httpStatus.BAD_REQUEST, "Please provide a shipping address");
    }
    for (const item of order.items) {
        let retryCount = 0;
        let isRetryRequired = true;
        let lastError;

        while (isRetryRequired && retryCount < MAX_RETRY_COUNT) {
            try {
                const updatedBook = await Book.findOneAndUpdate(
                    {_id: item.book.id, stock: {$gte: item.quantity}},
                    {$inc: {stock: -item.quantity, __v: 1}, $set: {updatedAt: new Date()}},
                    {new: true}
                )

                if (!updatedBook) {
                    await Order.findByIdAndDelete(order.id)
                    await bookService.revertStockUpdates(updatedBooks)
                    throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient stock for book with ${item.book.id}`)
                }

                updatedBooks.push({bookId: item.book.id, quantity: item.quantity})

                if (item.book.__v + 1 !== updatedBook.__v) {
                    throw new ApiError(httpStatus.CONFLICT, "Concurrency conflict occurred while updating book stock")
                }
                isRetryRequired = false;
            } catch (error) {
                lastError = error
                retryCount++
            }
        }

        if (isRetryRequired) {
            // Retry count exceeded, handle error
            await Order.findByIdAndDelete(order.id);
            await bookService.revertStockUpdates(updatedBooks);
            throw new ApiError(lastError.statusCode, lastError.message, true, lastError.stack);
        }
    }
    await cartService.clearCart(userId)
    return order;
}

const deleteOrder = async (userId, id) => {
    let order;
    try {
        order = await Order.findOne({_id: id, user: userId}).populate('items.book');
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error deleting order");
    }

    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    try {
        for (const item of order.items) {
            await Book.findByIdAndUpdate(item.book.id, {$inc: {stock: item.quantity}});
        }
    } catch (error) {
        logger.error(`Error updating book stock while deleting order: ${error.message}`);
    }

    await Order.findByIdAndDelete(id);

    return order;
}


const updateOrderStatus = async (id, status) => {
    let order
    try {
        order = await Order.findOneAndUpdate(
            {_id: id},
            {status: status},
            {new: true}
        )
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error updating order status")
    }
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found')
    }
    return order;
}


const orderService = {
    queryOrders,
    getOrder,
    addOrder,
    deleteOrder,
    updateOrderStatus,
}

export default orderService