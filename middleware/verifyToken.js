const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json("No token provided");
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.TOKEN_KEY);
    req.verifiedUser = verifiedUser; // tkhalik you can pass el token maa el request bech tekhou acces lel les données li mawjoudin fil payload
    next(); // middlewares are function that can be executed in middle of work then do the next function to execute and complete the normal funciton
  } catch (err) {
    return res.status(403).json("Invalid token");
  }
};
