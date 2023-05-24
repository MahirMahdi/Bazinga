const { User } = require("../models/user");
const uploadToImageKit = require("../utils/imageKit");

const startConversation = async (req, res) => {
  const { receiver_id, sender_id, text, type, status, duration } = req.body;
  const img = req.file ? await uploadToImageKit(req) : null;

  const texts = {
    sender_id: sender_id,
    text: text,
    img: img,
    call: {
      type: type,
      status: status,
      duration: duration,
    },
  };

  const findConversation = await User.find({
    conversation: {
      $elemMatch: { members: { $all: [sender_id, receiver_id] } },
    },
  });

  if (findConversation.length === 0) {
    await User.updateMany(
      { _id: { $in: [receiver_id, sender_id] } },
      {
        $push: {
          conversation: [{ members: [sender_id, receiver_id], texts: [texts] }],
        },
      },
      { new: true }
    );
    try {
      const response = await User.findOne({ _id: sender_id });
      const { conversation } = response;
      res.status(200).json({
        conversation,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //if conversation already exists in userAs' database but doesn't exist in userBs'
  else if (
    findConversation.length === 1 &&
    findConversation[0]._id == sender_id
  ) {
    const response = await User.findOne({ _id: sender_id });
    const { conversation } = response;
    const filteredConversation = conversation.filter((convo) =>
      convo.members.includes(receiver_id)
    )[0];

    await User.updateOne(
      {
        _id: sender_id,
        conversation: {
          $elemMatch: { members: { $all: [receiver_id, sender_id] } },
        },
      },
      { $push: { "conversation.$.texts": texts } },
      { new: true }
    );
    await User.updateOne(
      { _id: receiver_id },
      {
        $push: {
          conversation: [
            {
              _id: filteredConversation._id,
              members: [sender_id, receiver_id],
              texts: [texts],
            },
          ],
        },
      },
      { new: true }
    );
    try {
      const response = await User.findOne({ _id: sender_id });
      const { conversation } = response;
      res.status(200).json({
        conversation,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //if conversation already exists in userBs' database but doesn't exist in userAs'
  else if (
    findConversation.length === 1 &&
    findConversation[0]._id == receiver_id
  ) {
    const response = await User.findOne({ _id: receiver_id });
    const { conversation } = response;
    const filteredConversation = conversation.filter((convo) =>
      convo.members.includes(sender_id)
    )[0];

    await User.updateOne(
      {
        _id: receiver_id,
        conversation: {
          $elemMatch: { members: { $all: [receiver_id, sender_id] } },
        },
      },
      { $push: { "conversation.$.texts": texts } },
      { new: true }
    );
    await User.updateOne(
      { _id: sender_id },
      {
        $push: {
          conversation: [
            {
              _id: filteredConversation._id,
              members: [sender_id, receiver_id],
              texts: [texts],
            },
          ],
        },
      },
      { new: true }
    );
    try {
      const response = await User.findOne({ _id: sender_id });
      const { conversation } = response;
      res.status(200).json({
        conversation,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //if conversation already exists in both users' database
  else {
    await User.updateMany(
      {
        _id: { $in: [receiver_id, sender_id] },
        conversation: {
          $elemMatch: { members: { $all: [receiver_id, sender_id] } },
        },
      },
      { $push: { "conversation.$.texts": texts } },
      { new: true }
    );
    try {
      const response = await User.findOne({ _id: sender_id });
      const { conversation } = response;
      res.status(200).json({
        conversation,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = startConversation;
