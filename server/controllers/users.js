const { User } = require("../models/user");

const GetUsers = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({
    username: { $regex: username, $options: "i" },
  });

  if (!user) {
    res.json({
      message: "User not found",
    });
  } else {
    res.json({
      user: user,
    });
  }
};

module.exports = GetUsers;
