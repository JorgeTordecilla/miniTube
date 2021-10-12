const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    vidTitle: {
      type: String,
      required: true,
      trim: true,
    },
    vidDescription: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislike: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

VideoSchema.index(
  { vidTitle: "text", tag: "text" },
  { name: "textScore", weights: { views: 10 } }
);
VideoSchema.statics.findByFileName = async (filename) => {
  const video = await Video.findOne({ filename });
  if (!video) {
    throw new Error("Unable to find video");
  }
  return video;
};

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
