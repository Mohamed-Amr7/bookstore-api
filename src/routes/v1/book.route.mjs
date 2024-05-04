import express from "express"
import {bookController} from "../../controllers/index.mjs";
import {isAdmin, isLoggedIn} from "../../middlewares/auth.mjs";

const router = express.Router()

router.route('/')
    .get(bookController.getBooks)
    .post(isLoggedIn, isAdmin, bookController.addBook)

router.route('/:id')
    .get(bookController.getBookById)
    .put(isLoggedIn, isAdmin, bookController.updateBook)
    .delete(isLoggedIn, isAdmin, bookController.deleteBook)


export default router
