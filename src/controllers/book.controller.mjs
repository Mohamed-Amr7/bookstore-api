import httpStatus from "http-status"
import catchAsync from "../utils/catchAsync.mjs"
import {bookService} from "../services/index.mjs"

const getBookById = catchAsync(async (req, res) => {
    const book = await bookService.getBook(req.params.id)
    res.status(httpStatus.OK).json({message: "Book retrieved successfully", data: {book}})
})

const queryBooks = catchAsync(async (req, res) => {
    const paginatedBooks = await bookService.queryBooks(req.query)

    if (paginatedBooks.totalDocs === 0) return res.status(httpStatus.NOT_FOUND).json({
        message: "No books found matching your search criteria"
    })

    const response = {
        message: 'Books retrieved successfully', data: {books: paginatedBooks.docs}, pagination: {
            totalDocs: paginatedBooks.totalDocs,
            limit: paginatedBooks.limit,
            page: paginatedBooks.page,
            total_pages: paginatedBooks.totalPages,
            hasPrevPage: paginatedBooks.hasPrevPage,
            hasNextPage: paginatedBooks.hasNextPage
        },
    };

    res.status(httpStatus.OK).send(response)
})

const addBook = catchAsync(async (req, res) => {
    const bookData = req.body
    const book = await bookService.createBook(bookData)
    res.status(httpStatus.CREATED).json({message: "Book created", data: {book}})
})

const updateBook = catchAsync(async (req, res) => {
    const book = await bookService.updateBook(req.params.id, req.body)
    res.status(httpStatus.OK).json({message: "Book updated successfully", data: {book}})
})

const deleteBook = catchAsync(async (req, res) => {
    const book = await bookService.deleteBook(req.params.id)
    res.status(httpStatus.OK).json({message: "Book deleted successfully", data: {book}})
})


const bookController = {
    getBookById, queryBooks, addBook, updateBook, deleteBook,
};

export default bookController