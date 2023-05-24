const { User } = require("../models/user");

const GetChatUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });

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

module.exports = GetChatUser;
