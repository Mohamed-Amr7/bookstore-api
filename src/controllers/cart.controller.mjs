import catchAsync from "../utils/catchAsync.mjs";
import {cartService} from "../services/index.mjs";
import httpStatus from "http-status";

const getCart = catchAsync(async (req, res) => {
    const cart = await cartService.getCart(req.user.id)
    res.status(httpStatus.OK).json({message: "Cart retrieved successfully.", data: {cart}});
})

const addToCart = catchAsync(async (req, res) => {
    const cart = await cartService.addToCart(req.user.id, req.body.items)
    res.status(httpStatus.CREATED).json({message: "Added to cart successfully.", data: {cart}});
})

const removeFromCart = catchAsync(async (req, res) => {
    const cart = await cartService.removeFromCart(req.user.id, req.body.items)
    res.status(httpStatus.OK).json({message: "Removed from cart successfully.", data: {cart}});
})

const removeBookFromCart = catchAsync(async (req, res) => {
    const cart = await cartService.removeBookFromCart(req.user.id, req.params.bookId)
    res.status(httpStatus.OK).json({message: "Book removed from cart successfully.", data: {cart}});
})

const updateCartQuantities = catchAsync(async (req, res) => {
    const cart = await cartService.updateCartQuantities(req.user.id, req.body.items)
    res.status(httpStatus.OK).json({message: "Cart item quantities updated successfully.", data: {cart}});
})


const cartController = {
    getCart,
    addToCart,
    updateCartQuantities,
    removeFromCart,
    removeBookFromCart,
}

export default cartController