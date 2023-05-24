const multer = require("multer");
const deleteConversation = require("../controllers/deleteConversation");
const getConversations = require("../controllers/getConversation");
const startConversation = require("../controllers/startConversation");

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

router.post("/conversation", upload.single("image"), startConversation);
router.get("/conversation/:id", getConversations);
router.post("/conversation/:senderId/:conversationId", deleteConversation);

module.exports = router;
