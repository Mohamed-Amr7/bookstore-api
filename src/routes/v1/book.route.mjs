import express from "express"
import {bookController} from "../../controllers/index.mjs";
import {isAdmin, isLoggedIn} from "../../middlewares/auth.mjs";

const router = express.Router()

router.get('/:id', bookController.getBookById)
router.post('/', isLoggedIn, isAdmin, bookController.addBook)

export default router
