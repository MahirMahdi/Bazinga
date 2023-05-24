const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { comparePassword } = require("../utils/bcrypt");

const LoginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Incorrect username or password!",
    });
  }

  const passwordMatch = comparePassword(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({
      success: false,
      message: "Incorrect username or password!",
    });
  }

  if (user && passwordMatch) {
    const { _id, email, username, img, conversation } = user;
    const accessToken = jwt.sign(
      { username: username, id: _id, img: img },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "900s" }
    );
    const refreshToken = jwt.sign(
      { username: username, id: _id, img: img },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("jwt", refreshToken, {
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      user: { _id, username, img, email, conversation },
      accessToken,
    });
  }
};

module.exports = LoginController;
