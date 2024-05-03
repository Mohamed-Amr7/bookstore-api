export const getValidSearchFilters = (filters) => {
    const validFilters = {};

    if (filters.search) {
        const searchTerm = new RegExp(filters.search, 'i')
        validFilters.$or = [
            {title: searchTerm},
            {author: searchTerm},
        ]
    }

    if (filters.title) {
        validFilters.title = new RegExp(filters.title, 'i');
    }

    if (filters.author) {
        validFilters.author = new RegExp(filters.author, 'i')
    }

    if (filters.priceMin) {
        validFilters.price = {$gte: filters.priceMin}
    }
    if (filters.priceMax) {
        validFilters.price = {...validFilters.price, $lte: filters.priceMax}
    }

    if (filters.isbn) {
        validFilters.isbn = filters.isbn
    }

    if (filters.publicationDateFrom) {
        validFilters.publicationDate = {$gte: filters.publicationDateFrom}
    }
    if (filters.publicationDateTo) {
        validFilters.publicationDate = {...validFilters.publicationDate, $lte: filters.publicationDateTo}
    }

    if (filters.pageCountMin) {
        validFilters.pageCount = {$gte: filters.pageCountMin}
    }
    if (filters.pageCountMax) {
        validFilters.pageCount = {...validFilters.pageCount, $lte: filters.pageCountMax}
    }

    if (filters.genres) {
        validFilters.genres = {$in: new RegExp(filters.genres, 'i')}
    }
    return validFilters;
}

export const getValidSortOptions = (sortCriteria) => {
    const sortOptions = {}
    for (const criterion of sortCriteria) {
        let [field, direction] = criterion.split(':');

        if (direction === 'desc') direction = -1
        else if (direction === 'asc') direction = 1

        if (field === 'title') sortOptions[field] = direction ?? 1;
        else if (field === 'publicationDate') sortOptions[field] = direction ?? -1;
        else if (field === 'price') sortOptions[field] = direction ?? 1;
    }
    return sortOptions
}