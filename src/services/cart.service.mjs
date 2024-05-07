import httpStatus from "http-status";
import ApiError from "../utils/ApiError.mjs";
import {Cart} from "../models/index.mjs";


/**
 * Get cart by user id
 * @param {ObjectId} userId - The user id
 * @returns {Promise<Cart>} The cart object
 */
const getCartByUserId = async (userId) => {
    let carts = await Cart.find({user: userId})
    if (!carts.length) {
        return await Cart.create({user: userId})
    }
    return carts[0]
}

/**
 * Add items to cart
 * @param {ObjectId} userId - The user id
 * @param {Array<Object>} bookItems - Array of book items to add to cart
 * @returns {Promise<Cart>} The updated cart object
 */
const addToCart = async (userId, bookItems) => {

    let cart = await getCartByUserId(userId);
    for (const {bookId, quantity} of bookItems) {
        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        if (!existingItem) {
            cart.items = cart.items || [];
            cart.items.push({book: bookId, quantity: quantity});
        } else {
            existingItem.quantity += quantity;
        }
    }
    await cart.save();
    return cart;
}

/**
 * Update quantity of items in cart
 * @param {ObjectId} userId - The user id
 * @param {Array<Object>} bookItems - Array of book items with updated quantities
 * @returns {Promise<Cart>} The updated cart object
 */
const updateCartQuantities = async (userId, bookItems) => {
    let cart = await getCartByUserId(userId);
    for (const {bookId, quantity} of bookItems) {
        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Book not Found in Cart")
        }
        existingItem.quantity = quantity;
    }
    await cart.save();
    return cart;
}


/**
 * Remove items from cart
 * @param {ObjectId} userId - The user id
 * @param {Array<Object>} bookItems - Array of book items to remove from cart
 * @returns {Promise<Cart>} The updated cart object
 */
const removeFromCart = async (userId, bookItems) => {

    let cart = await getCartByUserId(userId);
    for (const {bookId, quantity} of bookItems) {
        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Book not Found in Cart")
        }
        if (existingItem.quantity < quantity) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Cannot remove more copies than are in the cart.");
        }
        existingItem.quantity -= quantity;
        if (existingItem.quantity <= 0) {
            cart.items.splice(cart.items.indexOf(existingItem), 1);
        }
    }
    await cart.save();
    return cart;
}

/**
 * Remove a book from the cart
 * @param {ObjectId} userId - The user id
 * @param {string} bookId - The id of the book to be removed
 * @returns {Promise<Cart>} The updated cart object
 */
const removeBookFromCart = async (userId, bookId) => {
    let cart = await getCartByUserId(userId);
    const existingItemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    if (existingItemIndex === -1) {
        throw new ApiError(httpStatus.NOT_FOUND, "Book not Found in Cart");
    }
    cart.items.splice(existingItemIndex, 1);
    await cart.save();
    return cart;
}


const cartService = {
    getCartByUserId,
    addToCart,
    updateCartQuantities,
    removeFromCart,
    removeBookFromCart,
}

export default cartService