import catchAsync from "../utils/catchAsync.mjs";
import httpStatus from "http-status";
import orderService from "../services/order.service.mjs";

const getOrders = catchAsync(async (req, res) => {
    const paginatedOrders = await orderService.queryOrders(req.user.id, req.query)

    const response = {
        message: 'Orders retrieved successfully', data: {orders: paginatedOrders.docs}, pagination: {
            totalDocs: paginatedOrders.totalDocs,
            limit: paginatedOrders.limit,
            page: paginatedOrders.page,
            total_pages: paginatedOrders.totalPages,
            hasPrevPage: paginatedOrders.hasPrevPage,
            hasNextPage: paginatedOrders.hasNextPage
        },
    };

    res.status(httpStatus.OK).send(response)

});

const getOrder = catchAsync(async (req, res) => {
    const order = await orderService.getOrder(req.user.id, req.params.id);
    res.status(httpStatus.OK).json({message: 'Order retrieved successfully', data: {order}});
});

const addOrder = catchAsync(async (req, res) => {
    const order = await orderService.addOrder(req.user.id, req.body);
    res.status(httpStatus.CREATED).json({message: 'Order created successfully', data: {order}});
});

const deleteOrder = catchAsync(async (req, res) => {
    const deletedOrder = await orderService.deleteOrder(req.user.id, req.params.id);
    res.status(httpStatus.OK).json({message: "Order deleted successfully", data: {order: deletedOrder}});
});

const updateOrderStatus = catchAsync(async (req, res) => {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(httpStatus.OK).json({message: 'Order status updated successfully', data: {order}});
});

const orderController = {
    getOrders,
    addOrder,
    getOrder,
    deleteOrder,
    updateOrderStatus,
};

export default orderController;
