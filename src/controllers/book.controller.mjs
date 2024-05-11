import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.mjs";
import {bookService} from "../services/index.mjs";

const getBookById = catchAsync(async (req, res) => {
    const book = await bookService.getBookById(req.params.id)
    res.status(httpStatus.OK).send(book)
})

const getBooks = catchAsync(async (req, res) => {
    const paginatedBooks = await bookService.queryBooks(req.query)

    if (paginatedBooks.totalDocs === 0) return res.status(httpStatus.NOT_FOUND).json({
        message: "No books found matching your search criteria"
    })

    const response = {
        message: 'Books retrieved successfully', data: paginatedBooks.docs, pagination: {
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
    res.status(httpStatus.CREATED).json({message: "Book created", data: book});
})

const updateBook = catchAsync(async (req, res) => {
    const book = await bookService.updateBookById(req.params.id, req.body);
    res.send(book);
})

const deleteBook = catchAsync(async (req, res) => {
    const book = await bookService.deleteBookById(req.params.id)
    res.send(book)
})


const bookController = {
    getBookById, getBooks, addBook, updateBook, deleteBook,
};

export default bookController