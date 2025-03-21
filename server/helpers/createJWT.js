import jwt from "jsonwebtoken";

const createToken = (payload) => {

  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d"
    },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export default createToken;