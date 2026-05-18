const successResponse = (message, data, pagination = undefined) => {
  // Enforce consistent API response shape across all endpoints.
  // - data is always present (array/object)
  // - pagination is always an object when provided, otherwise {} (to match pattern)
  return {
    success: true,
    message,
    data: data === undefined || data === null ? [] : data,
    pagination: pagination && typeof pagination === "object" ? pagination : {},
  };
};




const errorResponse = (message, error) => {
  return {
    success: false,
    message,
    error: error || {},
  };
};


module.exports = { successResponse, errorResponse };

