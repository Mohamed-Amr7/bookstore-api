import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.mjs";
import {bookService} from "../services/index.mjs";

const getBookById = catchAsync(async (req, res) => {
    const book = await bookService.getBookById(req.params.id)
    res.status(httpStatus.OK).send(book)
})

const addBook = catchAsync(async (req, res) => {
    const bookData = req.body
    const book = await bookService.createBook(bookData)
    res.status(httpStatus.CREATED).json({ message: "Book created", data: book });
})


const bookController = {
    addBook,
    getBookById
};

export default bookController