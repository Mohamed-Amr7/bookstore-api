import mongoose from "mongoose";
import {paginate, toJSON} from "./plugins/index.mjs";
import {BOOK_CATEGORIES} from "../constants/bookCategories.mjs";
import {capitalizeString} from "../utils/stringUtils.mjs";

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
        categories: {
            type: [String],
            validate: {
                validator: (value) => {
                    const formattedCategories = value.map(capitalizeString)
                    return formattedCategories.every((category) =>
                        Object.values(BOOK_CATEGORIES).includes(category)
                    )
                },
                message: 'Provided category is not allowed. Please choose from: ' + Object.values(BOOK_CATEGORIES).sort().join(', '),
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

/**
 * @typedef Book
 */
const Book = mongoose.model('Book', bookSchema);

export default Book;