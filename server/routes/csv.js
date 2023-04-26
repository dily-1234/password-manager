import express from "express";
import PasswordMessage from "../models/passwordMessage.js";
import { encryption } from "../EncandDec.js";
import zxcvbn from "zxcvbn";
import multer from "multer";
import papa from "papaparse";
import jwt from "jsonwebtoken";
const router = express.Router();

const temp = multer();

router.post("/", temp.single("csvFile"), async (req, res) => {
  const { key, username } = req.query;
  const decoded = jwt.verify(username, process.env.JWTPRIVATEKEY);
  if (!req.file) {
    res.status(400).send("No CSV file provided");
    return;
  }
  // extracts the data from the csv file
  const csvData = req.file.buffer.toString();
  const passwordArray = papa.parse(csvData, {
    header: true,
    columns: ["name", "username", "password"],
  }).data;
  // Adds the passwords from the csv file to the database
  const passwordMessages = passwordArray
    .filter((password) => password.name && password.password)
    .map((password) => {
      const enpassed = encryption(password.password, key);
      const score = zxcvbn(password.password).score;
      const passwordMessage = new PasswordMessage({
        username: decoded._id,
        website: password.name,
        webusername: password.username,
        password: enpassed.password,
        score: score,
        iv: enpassed.iv,
      });
      return passwordMessage;
    });

  try {
    const savedPasswords = await PasswordMessage.insertMany(passwordMessages);
    res.status(201).json(savedPasswords);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
