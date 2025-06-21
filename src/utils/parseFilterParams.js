// src/utils/parseFilterParams.js

export const parseFilterParams = (query) => {
  const parseBoolean = (value) =>
    value === 'true' ? true : value === 'false' ? false : undefined;

  const contactType = query.type;
  const isFavourite = parseBoolean(query.isFavourite);

  return {
    ...(contactType ? { contactType } : {}),
    ...(isFavourite !== undefined ? { isFavourite } : {}),
  };
};
