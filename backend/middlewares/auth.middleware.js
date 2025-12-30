import User from "../models/user.model";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  let token;

  //check if headers have "Authorization" and it have "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get the token from authorization (Format : "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //get usr form token payload (decoded.id)
      //and we excluding passowrd ("-passowd") so it doesn't get carried out
      req.user = await User.findById(decoded.id).select("-password");

      //passes the baton to the next function or controller
      next();
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .json({ success: false, error: `No authorization , token failed` });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: `No authorization , no token` });
  }
};

export default protect;
