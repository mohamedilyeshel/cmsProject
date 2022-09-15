module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    return next("route");
  }

  next();
};
