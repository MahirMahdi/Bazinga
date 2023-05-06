const ImageKit = require("imagekit");
const dotenv = require("dotenv");
const fs = require("fs");
const util = require("util");

const env = dotenv.config();
const readFile = util.promisify(fs.readFile);

const imageKit = new ImageKit({
  publicKey: process.env.CDN_PUBLIC_KEY,
  privateKey: process.env.CDN_PRIVATE_KEY,
  urlEndpoint: process.env.CDN_URL,
});

const uploadToImageKit = async (req) => {
  try {
    const data = await readFile(req.file.path);
    const result = await imageKit.upload({
      file: data,
      fileName: req.file.originalname,
    });
    fs.unlink(req.file.path, function (err) {
      if (err) throw err;
    });
    const imageUrl = result.url;
    return imageUrl;
  } catch (error) {
    throw error;
  }
};

module.exports = uploadToImageKit;
