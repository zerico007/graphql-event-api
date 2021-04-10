const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return new Promise((resolve) => {
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "6h",
    });
    resolve(token);
  });
};

const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(decoded);
    });
  });
};

const validate = (authorization) => {
  return new Promise((resolve, reject) => {
    if (!authorization) reject(Error("Missing Authorization Header"));

    const headerParts = authorization.split(" ");
    if (headerParts.length < 2) reject(Error("Invalid Authorization header"));

    const token = headerParts[1].toString();
    decodeToken(token)
      .then((result) => resolve(result))
      .catch((err) => {
        console.warn("failed to decode");
        reject(err);
      });
  });
};

const validationMiddleware = async (req, res, next) => {
  if (req.body.query && !req.body.query.includes("login")) {
    try {
      const authInfo = await validate(req.headers.authorization);
      req.authInfo = authInfo;
      next();
    } catch (error) {
      console.log("Something went wrong. " + error);
      res.status(401).json({ message: error.message });
    }
  } else {
    next();
  }
};

module.exports = {
  generateToken,
  validationMiddleware,
  decodeToken,
};
