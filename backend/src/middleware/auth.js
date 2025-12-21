const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  });
}

module.exports = verifyToken;
