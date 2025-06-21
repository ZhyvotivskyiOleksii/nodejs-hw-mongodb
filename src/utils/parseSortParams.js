// src/utils/parseSortParams.js

export const parseSortParams = (query) => {
  const SORT_ORDER = { ASC: 'asc', DESC: 'desc' };
  const keysOfContact = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'contactType',
    'isFavourite',
  ];

  const sortBy = keysOfContact.includes(query.sortBy) ? query.sortBy : '_id';
  const sortOrder =
    query.sortOrder === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC;

  return { sortBy, sortOrder };
};
