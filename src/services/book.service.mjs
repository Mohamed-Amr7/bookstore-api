import httpStatus from "http-status";
import ApiError from "../utils/ApiError.mjs";
import {Book} from "../models/index.mjs";
import {getValidBookSearchFilters, getValidBookSortOptions} from "../utils/queryUtils.mjs";
import logger from "../config/logger.mjs";

/**
 * Get book by id
 * @param {ObjectId} id
 * @returns {Promise<Book>}
 */
const getBookById = async (id) => {
    return Book.findById(id)
}

/**
 * Create a book
 * @param {Object} bookBody
 * @returns {Promise<Book>}
 */
export const createBook = async (bookBody) => {
    try {
        return await Book.create(bookBody)
    } catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, err.message)
    }
};

/**
 * Get book by id
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
export const getBook = async (bookId) => {
    const book = await getBookById(bookId);
    if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
    }
    return book;
};

/**
 * Update book by id
 * @param {ObjectId} bookId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
export const updateBook = async (bookId, updateBody) => {
    const book = await getBookById(bookId);
    if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
    }
    try {
        Object.assign(book, updateBody)
        await book.save()
        return book
    } catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, err.message)
    }
};

/**
 * Delete book by id
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
export const deleteBook = async (bookId) => {
    const book = await getBookById(bookId);
    if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
    }
    await Book.findByIdAndDelete(bookId)
    return book;
};


/**
 * @param {Object} query - An object containing query parameters for filtering, sorting, and pagination.
 * Other parameters beyond `page`, `limit`, and `sort` can also be included in the `query` object.
 * Refer to the **Supported Filters** section for available filters.
 * @param {number} [query.page=1] - The desired page number (defaults to 1).
 * @param {number} [query.limit=10] - The number of results per page (defaults to 10).
 * @param {string} [query.sort] - A pipe-delimited string specifying sorting criteria (e.g., "title:asc|publicationDate:desc").
 * Refer to the **Supported Sorts** section for valid sorting options. Defaults to sorting by `createdAt` in descending order.
 * @returns {Promise<Object>} A Promise resolving to an object containing paginated book data.
 * @throws {ApiError} An error object with status code BAD_REQUEST if fetching books fails.
 *
 * @example
 * const books = await queryBooks({
 *   page: 2, // Retrieve second page
 *   limit: 20, // 20 results per page
 *   sort: 'title:asc|publicationDate:desc', // Sort by title (ascending) then publication date (descending)
 *   search: 'fantasy', // Search for books containing 'fantasy' in title or author
 *   priceMin: 10, // Filter for books priced at least $10
 *   genres: ['fantasy', 'science fiction'], // Filter by genres
 });
 *
 * @description
 *
 * ### Supported Sorts
 *
 * The `queryBooks` function supports sorting by the following fields:
 *
 * - **title** (ascending or descending)
 * - **publicationDate** (ascending or descending)
 * - **price** (ascending or descending)
 *
 * Sorting criteria are specified in the `sort` parameter using a pipe (`|`) to separate multiple criteria. Each criterion is a field name followed by a colon (`:`), then the sorting direction (`asc` for ascending or `desc` for descending). If no direction is provided, the default is `asc`.
 *
 * **Example:**
 *
 * ```
 * sort: title:asc|publicationDate:desc
 * ```
 *
 * This sorts books by title in ascending order first, then by publication date in descending order.
 *
 * ### Supported Filters
 *
 * The `queryBooks` function supports filtering by the following criteria:
 *
 * - **search** (string): A case-insensitive search term for title or author.
 * - **title** (string): A case-insensitive filter for book title.
 * - **author** (string): A case-insensitive filter for book author.
 * - **priceMin** (number): Minimum price for filtering.
 * - **priceMax** (number): Maximum price for filtering.
 * - **isbn** (string): Exact ISBN for matching.
 * - **publicationDateFrom** (Date object): Start date for publication date range filtering.
 * - **publicationDateTo** (Date object): End date for publication date range filtering.
 * - **pageCountMin** (number): Minimum page count for filtering.
 * - **pageCountMax** (number): Maximum page count for filtering.
 * - **genres** (string or array of strings): A genre or array of genres for case-insensitive filtering.
 */
const queryBooks = async (query) => {
    const {page = 1, limit = 10, sort, ...filters} = query
    const sortCriteria = sort ? sort.split('|') : [];
    const sortOptions = getValidBookSortOptions(sortCriteria);
    const validSearchFilters = getValidBookSearchFilters(filters)
    const options = {
        page,
        limit,
        sort: sort ? sortOptions : {createdAt: -1}
    }
    let paginatedBooks;
    try {
        paginatedBooks = await Book.paginate(validSearchFilters, options);
        return paginatedBooks
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error Fetching Books")
    }

};

const revertStockUpdates = async (items) => {
    for (const {bookId, quantity} of items) {
        try {
            await Book.findByIdAndUpdate(
                bookId,
                {$inc: {stock: quantity , __v: 1}, $set: {updatedAt: new Date()}}
            );
        } catch (error) {
            logger.error(`Failed to revert stock update for book ${bookId}: ${error.message}`);
        }
    }
}

const bookService = {
    createBook,
    updateBook,
    deleteBook,
    getBook,
    queryBooks,
    revertStockUpdates,
}

export default bookService