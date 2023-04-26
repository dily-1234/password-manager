import express from "express";
import userimg from "../models/userimg.js";
import jwt from "jsonwebtoken";
import aws from "aws-sdk";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const rekognition = new aws.Rekognition({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  });
  const { imageData, username, token } = req.body;

  try {
    const user = await userimg.findOne({ username: username });

    if (token) {
      const result = bcrypt.compareSync(token, user.usertoken);
      if (!result) {
        res.json({ result: false });
        return;
      } else {
        const token = jwt.sign({ _id: username }, process.env.JWTPRIVATEKEY, {
          expiresIn: "1d",
        });
        res.json({ result: true, data: token });
        return;
      }
    }

    const im = imageData.replace(/^data:image\/[a-z]+;base64,/, "");

    const imgPath = path.join(user.imgurl);
    const imgData = fs.readFileSync(imgPath);

    const params = {
      SourceImage: { Bytes: Buffer.from(im, "base64") },
      TargetImage: { Bytes: imgData },
      SimilarityThreshold: 70,
    };

    rekognition.compareFaces(params, function (err, data) {
      if (err) {
        res.send({ result: false });
      } else {
        if (data.FaceMatches.length === 0) {
          res.json({ result: false });
        } else {
          const token = jwt.sign({ _id: username }, process.env.JWTPRIVATEKEY, {
            expiresIn: "1d",
          });
          res.json({ result: true, data: token });
        }
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
