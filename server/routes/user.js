const multer = require("multer");
const jwt = require("jsonwebtoken");

//multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = require("express").Router();
const passport = require("passport");
const SignupController = require("../controllers/register");
const LoginController = require("../controllers/auth");
const RefreshTokenHandler = require("../controllers/refresh");
const LogoutController = require("../controllers/logout");
const GetUsers = require("../controllers/users");
const GetChatUser = require("../controllers/chatuser");
const DeleteUser = require("../controllers/deleteUser");

router.get("/user/:username", GetUsers);
router.get("/chatuser/:id", GetChatUser);
router.post("/signup", upload.single("image"), SignupController);
router.post("/login", LoginController);
router.get("/refresh", RefreshTokenHandler);
router.post("/logout", LogoutController);
router.post("/delete-account/:id", DeleteUser);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//redirects to client with cookie if authentication is successful
router.get(
  "/auth/google/bazinga",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  function (req, res, Redirect) {
    const { _id, username, img } = req.user;
    const refreshToken = jwt.sign(
      { username: username, id: _id, img: img },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .redirect(301, process.env.CLIENT_URL);
  }
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

//redirects to client with cookie if authentication is successful
router.get(
  "/auth/facebook/bazinga",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  function (req, res, Redirect) {
    const { _id, username, img, email } = req.user;
    const refreshToken = jwt.sign(
      { username: username, id: _id, img: img },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .redirect(301, process.env.CLIENT_URL);
  }
);

module.exports = router;
