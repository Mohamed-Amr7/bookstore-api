import httpStatus from "http-status";
import ApiError from "../utils/ApiError.mjs";
import {Cart} from "../models/index.mjs";
import {bookService} from "./index.mjs";


/**
 * Get cart by user id
 * @param {ObjectId} userId - The user id
 * @returns {Promise<Cart>} The unpopulated cart object
 */
const getCartByUserId = async (userId) => {
    let cart = await Cart.findOne({user: userId})
    if (!cart) {
        return await Cart.create({user: userId})
    }
    return cart
}

/**
 * Get cart by user id
 * @param {ObjectId} userId - The user id
 * @returns {Promise<Cart>} The cart object
 */
const getCart = async (userId) => {
    const cart = await getCartByUserId(userId)
    return cart.populate('items.book')
}

/**
 * Add items to cart
 * @param {ObjectId} userId - The user id
 * @param {Array<Object>} bookItems - Array of book items to add to cart
 * @returns {Promise<Cart>} The updated cart object
 */
const addToCart = async (userId, bookItems) => {
    let cart = await getCartByUserId(userId)

    for (const {bookId, quantity} of bookItems) {
        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        const book = await bookService.getBookById(bookId)
        if(!book) {
            throw new ApiError(httpStatus.NOT_FOUND, "Book not found or unavailable");
        }

        if (!existingItem) {
            cart.items = cart.items || [];
            cart.items.push({book: bookId, quantity: quantity});
        } else {
            existingItem.quantity += quantity;
        }
    }
    await cart.save()
    return cart.populate('items.book')
}

/**
 * Update quantity of items in cart
 * @param {ObjectId} userId - The user id
 * @param {Array<Object>} bookItems - Array of book items with updated quantities
 * @returns {Promise<Cart>} The updated cart object
 */
const updateCartQuantities = async (userId, bookItems) => {
    let cart = await getCartByUserId(userId)
    for (const {bookId, quantity} of bookItems) {
        const existingItem = cart.items.find(item => item.book.toString() === bookId)
        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Book not Found in Cart")
        }
        existingItem.quantity = quantity
    }
    await cart.save()
    return cart.populate('items.book')
}


/**
 * Remove items from cart
 * @param {ObjectId} userId - The user id
 * @param {Array<Object>} bookItems - Array of book items to remove from cart
 * @returns {Promise<Cart>} The updated cart object
 */
const removeFromCart = async (userId, bookItems) => {

    let cart = await getCartByUserId(userId)
    for (const {bookId, quantity} of bookItems) {
        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Book not Found in Cart")
        }
        if (existingItem.quantity < quantity) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Cannot remove more copies than are in the cart.")
        }
        existingItem.quantity -= quantity
        if (existingItem.quantity <= 0) {
            cart.items.splice(cart.items.indexOf(existingItem), 1)
        }
    }
    await cart.save()
    return cart.populate('items.book')
}

/**
 * Remove a book from the cart
 * @param {ObjectId} userId - The user id
 * @param {string} bookId - The id of the book to be removed
 * @returns {Promise<Cart>} The updated cart object
 */
const removeBookFromCart = async (userId, bookId) => {
    let cart = await getCartByUserId(userId)
    const existingItemIndex = cart.items.findIndex(item => item.book.toString() === bookId)
    if (existingItemIndex === -1) {
        throw new ApiError(httpStatus.NOT_FOUND, "Book not Found in Cart")
    }
    cart.items.splice(existingItemIndex, 1)
    await cart.save()
    return cart.populate('items.book')
}

const clearCart = async (userId) => {
    const cart = await getCartByUserId(userId)
    cart.items = []
    await cart.save()
    return cart
};


const cartService = {
    getCartByUserId,
    getCart,
    addToCart,
    updateCartQuantities,
    removeFromCart,
    removeBookFromCart,
    clearCart,
}

export default cartService