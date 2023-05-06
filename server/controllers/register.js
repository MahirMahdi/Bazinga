const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../utils/bcrypt");
const uploadToImageKit = require("../utils/imageKit");

const SignupController = async (req, res) => {
  const { username, password, email } = req.body;
  const imageName = req.file.originalname;

  if (!username || !password || !email || !imageName) {
    res.status(401).json({
      success: false,
      message: "All fields are required",
    });
  }

  // checking if user already exists
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  } else {
    // I don't want to keep the images on the server that's why deleting them after uploading to the CDN.
    const image_url = await uploadToImageKit(req);
    const newUser = new User({
      username: username,
      email: email,
      password: hashPassword(password),
      img: image_url,
    });

    try {
      const user = await newUser.save();
      const { _id, email, username, img } = user;

      //access and refresh token is assigned to the user
      const accessToken = jwt.sign(
        { username: user.username, id: user._id, img: user.img },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "900s" }
      );
      const refreshToken = jwt.sign(
        { username: user.username, id: user._id, img: user.img },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      //refresh token is sent through cookie
      res.cookie("jwt", refreshToken, {
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      //access token is sent along the user details as a response
      res.status(200).json({
        success: true,
        message: "User registered successfully.",
        user: { _id, username, img, email },
        accessToken,
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
};

module.exports = SignupController;
