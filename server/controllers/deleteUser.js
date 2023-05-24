const { User } = require("../models/user");

const DeleteUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    res.json({
      message: "User not found",
    });
  }

  res.json({
    user: user,
  });
};

module.exports = DeleteUser;
