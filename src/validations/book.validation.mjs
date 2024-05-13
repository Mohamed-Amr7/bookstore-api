import Joi from 'joi'
import {genre, isbn, objectId} from './custom.validation.mjs'

const genreSchema = Joi.string().custom(genre);

export const queryBooks = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        sort: Joi.string().pattern(/^([a-zA-Z]+(?::(?:asc|desc))?)?(?:\|([a-zA-Z]+(?::(?:asc|desc))?))*$/),
        search: Joi.string(),
        title: Joi.string(),
        author: Joi.string(),
        priceMin: Joi.number().min(0),
        priceMax: Joi.number().min(Joi.ref('priceMin', {adjust: (value) => value || 0})),
        isbn: Joi.string().custom(isbn),
        publicationDateFrom: Joi.date(),
        publicationDateTo: Joi.when(
            'publicationDateFrom',
            {
                is: Joi.exist(),
                then: Joi.date().min(Joi.ref('publicationDateFrom')),
                otherwise: Joi.date(),
            }),
        pageCountMin: Joi.number().integer().min(0),
        pageCountMax: Joi.number().integer().min(Joi.ref('pageCountMin', {adjust: (value) => value || 0})),
        genres: Joi.alternatives().try(genreSchema, Joi.array().items(genreSchema))
    }),
};

export const addBook = {
    body: Joi.object()
        .keys({
            title: Joi.string().required(),
            author: Joi.string().required(),
            price: Joi.number().required(),
            isbn: Joi.string().required().custom(isbn),
            description: Joi.string(),
            publicationDate: Joi.date(),
            pageCount: Joi.number().integer().min(1),
            genres: Joi.alternatives().try(genreSchema, Joi.array().items(genreSchema)),
            stock: Joi.number().integer().min(0).default(0),
            coverImage: Joi.string(),
        }),
};

export const getBook = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

export const updateBook = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            author: Joi.string(),
            price: Joi.number(),
            isbn: Joi.string().custom(isbn),
            description: Joi.string(),
            publicationDate: Joi.date(),
            pageCount: Joi.number().integer().min(1),
            genres: Joi.alternatives().try(genreSchema, Joi.array().items(genreSchema)),
            stock: Joi.number().integer().min(0),
            coverImage: Joi.string(),
        }).min(1),
};

export const deleteBook = {
    params: Joi.object()
        .keys({
            id: Joi.string().required().custom(objectId),
        }),
};

const bookValidation = {
    addBook,
    getBook,
    queryBooks,
    updateBook,
    deleteBook,
}

export default bookValidation