import { decode, verify } from "jsonwebtoken";
import config from '../../config/config.js';

const authenticate = async(req, res, next) => {

  const token = req.headers.token;

  if (!token) return res.status(400).send({ message: "No token provided" });
  
  let user;

  try {
    user = decode(token, config.keys.crypto.auth); // verify valid json web token
  } catch (error) {
    return res.status(403).send({ message: "Could not authorize", error: error})
  }

  // attach user to headers
  req.headers.user = user;

  return next();
}

export default authenticate;