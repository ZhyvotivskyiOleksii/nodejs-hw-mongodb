// src/utils/parsePaginationParams.js

export const parsePaginationParams = (query) => {
  const parseNumber = (value, defaultValue) => {
    const number = parseInt(value, 10);
    return Number.isNaN(number) ? defaultValue : number;
  };

  const page = parseNumber(query.page, 1);
  const perPage = parseNumber(query.perPage, 10);

  return { page, perPage };
};
