const mongoose = require("mongoose");
const Video = require("../../src/models/video");

const fs = require("fs").promises;

const videoOneId = new mongoose.Types.ObjectId();
const videoOne = {
  _id: videoOneId,
  vidTitle: "Colombia video de prueba",
  vidDescription: "Video de ejemplo sobre colombia para hacer el test",
  tag: "entertainment",
  filename: "test",
  likes: 10,
  dislike: 10,
  views: 4,
};

const setupDb = async () => {
  await Video.deleteMany();
  await new Video(videoOne).save();
  await fs.rmdir("../../uploadsTest", { recursive: true });
};

module.exports = setupDb;
