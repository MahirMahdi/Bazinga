const mongoose = require("mongoose");
const Text = require("./text");

const Conversation = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    texts: [Text],
  },
  { timestamps: true }
);

module.exports = Conversation;
