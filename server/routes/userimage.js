import express from "express";
import userimg from "../models/userimg.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import bcrypt from "bcrypt";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname + ".jpeg");
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  const { username, token } = req.query;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(token, salt);

  const decoded = jwt.verify(username, process.env.JWTPRIVATEKEY);

  try {
    let image = await userimg.findOne({ username: decoded._id });
    if (image) {
      image.imgurl = req.file.path;
      image.usertoken = hashed;
      await image.save();
    } else {
      image = new userimg({
        username: decoded._id,
        imgurl: req.file.path,
        usertoken: hashed,
      });
      await image.save();
    }
    res.send({ url: image.url });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  const { username } = req.query;

  const decoded = jwt.verify(username, process.env.JWTPRIVATEKEY);
  try {
    const image = await userimg.findOne({ username: decoded._id });
    if (image) {
      res.send({
        hasFacePicture: true,
        url: image.url,
      });
    } else {
      res.send({
        hasFacePicture: false,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/", async (req, res) => {
  const { username } = req.query;

  const decoded = jwt.verify(username, process.env.JWTPRIVATEKEY);
  try {
    const image = await userimg.findOne({ username: decoded._id });
    if (image) {
      fs.unlinkSync(image.imgurl);

      await image.delete();
    }
    res.send({ message: "Image Deleted" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
