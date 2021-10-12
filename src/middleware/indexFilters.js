const Video = require("../models/video");

const tag = async (req, res, next) => {
  const tag = req.query.tag || req.query.search || " ";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;
  try {
    let results = await Video.find({ $text: { $search: tag } })
      .sort({ views: -1, score: { $meta: "textScore" } })
      .limit(limit)
      .skip(skip)
      .exec();

    if (results.length == 0) {
      results = await Video.find()
        .sort({ views: -1 })
        .limit(limit)
        .skip(skip)
        .exec();
    }
    res.pagination = results;
    res.limit = limit;
    res.search = req.query.search;
    res.tag = req.query.tag;
    next();
  } catch (e) {
    res.status(500).json({ Message: "Error Ocurred" + e });
  }
};

module.exports = tag;
