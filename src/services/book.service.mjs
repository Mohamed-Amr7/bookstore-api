import {Book} from "../models/index.mjs";
import httpStatus from "http-status";


/**
 * Create a book
 * @param {Object} bookBody
 * @returns {Promise<User>}
 */
export const createBook = async (bookBody) => {
    try {
        return Book.create(bookBody);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const validationErrors = [];
            for (const field in err.errors) {
                validationErrors.push({
                    field: field,
                    message: err.errors[field].message,
                });
            }
            throw new ApiError(httpStatus.BAD_REQUEST, 'Validation errors', {validationErrors});
        }
    }
};

/**
 * Get book by id
 * @param {ObjectId} id
 * @returns {Promise<Book>}
 */
const getBookById = async (id) => {
    return Book.findById(id)
}


const bookService = {
    createBook,
    getBookById
}

export default bookService