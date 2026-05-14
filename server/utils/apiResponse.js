const successResponse = (message, data, pagination = {}) => {
  return {
    success: true,
    message,
    data: data || [],
    pagination: pagination || {},
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

