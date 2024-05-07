import mongoose from "mongoose";
import {paginate, toJSON} from "./plugins/index.mjs";
import {BOOK_GENRES} from "../constants/bookGenres.mjs";
import {capitalizeString} from "../utils/stringUtils.mjs";


/**
 * @typedef Book
 * @property {string} _id - The ID of the book
 * @property {string} title - The title of the book
 * @property {string} author - The author of the book
 * @property {number} price - The price of the book
 * @property {string} isbn - The ISBN of the book
 * @property {string} description - The description of the book
 * @property {Date} publicationDate - The publication date of the book
 * @property {number} pageCount - The page count of the book
 * @property {Array<string>} genres - The genres of the book
 * @property {number} stock - The stock quantity of the book
 * @property {string} coverImage - The URL of the cover image of the book
 * @property {Date} createdAt - The timestamp when the book was created
 * @property {Date} updatedAt - The timestamp when the book was last updated
 */
const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        isbn: {
            type: String,
            unique: true, // Ensures no duplicate ISBNs
        },
        description: {
            type: String,
        },
        publicationDate: {
            type: Date,
        },
        pageCount: {
            type: Number,
        },
        genres: {
            type: [String],
            validate: {
                validator: (value) => {
                    const formattedGenres = value.map(capitalizeString)
                    return formattedGenres.every((category) =>
                        Object.values(BOOK_GENRES).includes(category)
                    )
                },
                message: 'Provided category is not allowed. Please choose from: ' + Object.values(BOOK_GENRES).sort().join(', '),
            },
        },
        stock: {
            type: Number,
            default: 0,
        },
        coverImage: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
bookSchema.plugin(toJSON);
bookSchema.plugin(paginate)

const Book = mongoose.model('Book', bookSchema);

export default Book;