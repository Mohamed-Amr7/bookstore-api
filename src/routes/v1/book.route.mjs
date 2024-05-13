import express from "express"
import {bookController} from "../../controllers/index.mjs"
import {bookValidation} from "../../validations/index.mjs";
import {isAdmin, isLoggedIn} from "../../middlewares/auth.mjs"
import validate from "../../middlewares/validate.mjs";

const router = express.Router()

router.route('/')
    .get(validate(bookValidation.queryBooks), bookController.queryBooks)
    .post(isLoggedIn, isAdmin, validate(bookValidation.addBook), bookController.addBook)

router.route('/:id')
    .get(validate(bookValidation.getBook), bookController.getBookById)
    .put(isLoggedIn, isAdmin, validate(bookValidation.updateBook), bookController.updateBook)
    .delete(isLoggedIn, isAdmin, validate(bookValidation.deleteBook), bookController.deleteBook)


export default router
