const express = require("express");
const multer = require("multer");
const router = new express.Router();
const fs = require("fs");
const indexFilters = require("../middleware/indexFilters");
const Video = require("../models/video");
const upload = multer({ dest: process.env.UPLOADSPATH });

router.get("/", indexFilters, async (req, res) => {
  res.render("index", {
    videos: res.pagination,
    pagination: res.pagination.length,
    limit: res.limit,
    tag: res.tag,
    search: res.search,
  });
});

router.get("/upload", (req, res) => {
  res.render("upload");
});

router.post("/upload", upload.single("uploaded_video"), async (req, res) => {
  const videoAtrib = Object.assign(req.body, req.file);
  const video = new Video(videoAtrib);
  await video.save();
  res.status(201).redirect(`/playVideo?fn=${video.filename}`);
});

router.get("/playVideo", async (req, res) => {
  if (req.query.search) {
    return res.redirect(`/?search=${req.query.search}`);
  }
  const video = await Video.findByFileName(req.query.fn);
  res.status(200).render("playVideo", { video: video });
});

router.get("/video/:id", (req, res) => {
  const path = `uploads/${req.params.id}`;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

router.post("/like/:id", async (req, res) => {
  const video = await Video.findByFileName(req.params.id);
  video.likes += 1;
  await video.save();
  res.status(202).send(`${video.likes}`);
});

router.post("/dislike/:id", async (req, res) => {
  const video = await Video.findByFileName(req.params.id);
  video.dislike += 1;
  await video.save();
  res.status(202).send(`${video.dislike}`);
});

router.post("/views/:id", async (req, res) => {
  const video = await Video.findByFileName(req.params.id);
  video.views += 1;
  await video.save();
  res.status(202).send(`${video.views}`);
});

module.exports = router;
