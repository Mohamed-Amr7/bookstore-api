import httpStatus from "http-status";
import ApiError from "../utils/ApiError.mjs";
import {Book} from "../models/index.mjs";


/**
 * Create a book
 * @param {Object} bookBody
 * @returns {Promise<Book>}
 */
export const createBook = async (bookBody) => {
    try {
        return await Book.create(bookBody)
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
        } else if (err.name === 'MongoServerError') {
            throw new ApiError(httpStatus.BAD_REQUEST, err.message)
        }
    }
};


/**
 * Update book by id
 * @param {ObjectId} bookId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
export const updateBookById = async (bookId, updateBody) => {
    const book = await getBookById(bookId);
    if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
    }
    try {
        Object.assign(book, updateBody)
        await book.save()
        return book
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
        } else if (err.name === 'MongoServerError') {
            throw new ApiError(httpStatus.BAD_REQUEST, err.message)
        }
    }
};

/**
 * Delete book by id
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
export const deleteBookById = async (bookId) => {
    const book = await getBookById(bookId);
    if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
    }
    await Book.findByIdAndDelete(bookId)
    return book;
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
    getBookById,
    updateBookById,
    deleteBookById,
}

export default bookService