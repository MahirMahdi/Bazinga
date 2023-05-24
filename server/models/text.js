const mongoose = require("mongoose");
const Call = require("./call");

const Text = new mongoose.Schema(
  {
    sender_id: String,
    text: String,
    img: String,
    call: Call,
  },
  { timestamps: true }
);

module.exports = Text;
