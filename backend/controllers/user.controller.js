import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//@desc   Register new user
//@route  POST /api/v1/users
//@access Public
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //1. Checking if user exits
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(404)
        .json({ success: false, error: `User exits already` });
    }

    //2. Hashing the password
    // Salt is a random noise added to password to hash it that makes it to difficult to crack
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //3. Creating User
    const user = User.create({
      username,
      email,
      password: hashedPassword,
    });

    //4. Respond with token
    //We don't send the password back . We send token
    return res
      .status(201)
      .json({ success: true, token: generateToken(user._id) });
  } catch (error) {
    return res.status(500).json({ sucess: false, error: error.message });
  }
};

//@desc   Login existing user
//@route  POST /api/v1/users/login
//access  Public

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //1.Check for email , if user exits
    //We select(+password) beacuse we selected it false in database model
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: `Invalid Credentials` });
    }

    //2. Is passwords matching
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: `Invalid Credentials ` });
    }

    //3.Respond with token
    return res.status(200).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: `30d` });
};
