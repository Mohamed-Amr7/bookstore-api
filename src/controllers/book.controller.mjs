import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.mjs";
import {bookService, userService} from "../services/index.mjs";

const getBookById = catchAsync(async (req, res) => {
    const book = await bookService.getBookById(req.params.id)
    res.status(httpStatus.OK).send(book)
})

const addBook = catchAsync(async (req, res) => {
    const bookData = req.body
    const book = await bookService.createBook(bookData)
    res.status(httpStatus.CREATED).json({ message: "Book created", data: book });
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
    getBookById,
    addBook,
    updateBook,
    deleteBook,
};

export default bookController