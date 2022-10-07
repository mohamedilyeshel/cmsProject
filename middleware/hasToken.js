module.exports = (req, res, next) => {
  const code = req.headers.authorization;
  if (code) {
    return next("route");
  }

  next();
};
