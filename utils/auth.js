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
    if (!authorization)
      return reject(new Error("Missing Authorization header"));
    const headerParts = authorization.split(" ");
    if (headerParts.length < 2)
      return reject(new Error("Invalid Authorization header"));
    const token = headerParts[1].toString();
    decodeToken(token)
      .then((result) => resolve(result))
      .catch((err) => {
        reject(err);
        console.warn("failed to decode");
      });
  });
};

const validationMiddleware = async (req, res, next) => {
  try {
    const authInfo = await validate(req.headers.authorization);
    req.authInfo = authInfo;
  } catch (error) {
    throw error;
  }

  next();
};

module.exports = {
  generateToken,
  validationMiddleware,
  decodeToken,
};
