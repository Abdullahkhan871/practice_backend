const customeResponse = (res, message = "", statusCode = 200, data = []) => {
  return res.status(statusCode).json({ message, data });
};

export { customeResponse };
