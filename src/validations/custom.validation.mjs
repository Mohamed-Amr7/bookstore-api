import {parsePhoneNumberFromString} from 'libphonenumber-js'
import {BOOK_GENRES} from "../constants/bookGenres.mjs";

export const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id')
    }
    return value
}

export const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters')
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contain at least 1 letter and 1 number')
    }
    return value;
}

export const phoneNumber = (value, helpers) => {
    const phoneNumber = parsePhoneNumberFromString(value)
    if (!phoneNumber || !phoneNumber.isValid()) {
        return helpers.message({custom: 'Invalid phone number'})
    }
    return value
}

export const isbn = (value, helpers) => {
    const isValidIsbn = /^(?:\d{9}[\dX]|\d{13})$/.test(value);
    if (!isValidIsbn) {
        return helpers.message('"{{#label}}" must be a valid ISBN');
    }
    return value;
};

const validGenres = Object.values(BOOK_GENRES).map(genre => genre.toLowerCase())
export const genre = (value, helpers) => {
    const lowercaseValue = value.toLowerCase()
    if (!validGenres.includes(lowercaseValue)) {
        return helpers.message(`"${helpers.state.path}" must be one of: ${Object.values(BOOK_GENRES).join(', ')}`)
    }
    return lowercaseValue
}
