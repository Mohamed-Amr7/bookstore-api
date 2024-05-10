import httpStatus from "http-status"
import ApiError from "../utils/ApiError.mjs"
import {Order} from "../models/index.mjs"

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
        order = await Order.findOne({_id: id, user: userId});
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
    try {
        order = await Order.create({
            user: userId,
            items: orderDetails.items,
            paymentMethod: orderDetails.paymentMethod,
            ...(orderDetails.shippingAddress && {shippingAddress: orderDetails.shippingAddress}),
            ...(orderDetails.contactNumber && {contactNumber: orderDetails.contactNumber}),
            ...(orderDetails.additionalDetails && {additionalDetails: orderDetails.additionalDetails})
        })
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to add order", true, error.message);
    }
    if (!order.shippingAddress) {
        await Order.findByIdAndDelete(order._id)
        throw new ApiError(httpStatus.BAD_REQUEST, "Please provide a shipping address");
    }

    return order;
}

const deleteOrder = async (userId, id) => {
    let order
    try {
        order = await Order.findOne({_id: id, user: userId});
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error deleting order")
    }
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
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