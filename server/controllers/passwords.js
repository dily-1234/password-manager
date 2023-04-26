import PasswordMessage from "../models/passwordMessage.js";
import { encryption, decrpytion } from "../EncandDec.js";
import zxcvbn from "zxcvbn";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const { username } = req.query;
  try {
    const decoded = jwt.verify(username, process.env.JWTPRIVATEKEY);

    const postMessages = await PasswordMessage.find({ username: decoded._id });

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const deletePosts = async (req, res) => {
  PasswordMessage.findById(req.query._id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
};

export const editPosts = async (req, res) => {
  console.log(req.query);
  const { username, password, key, webusername, _id } = req.query;

  try {
    const decoded = jwt.verify(username, process.env.JWTPRIVATEKEY);
    const enpassed = encryption(password, key);
    const score = zxcvbn(password).score;

    await PasswordMessage.findByIdAndUpdate(_id, {
      webusername: webusername,
      password: enpassed.password,
      score: score,
      iv: enpassed.iv,
    });

    res.status(201).json();
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createPosts = async (req, res) => {
  const { username, title, password, key, webusername } = req.query;

  try {
    const decoded = jwt.verify(username, process.env.JWTPRIVATEKEY);
    const enpassed = encryption(password, key);
    const score = zxcvbn(password).score;

    const newPost = new PasswordMessage({
      username: decoded._id,
      website: title,
      webusername: webusername,
      password: enpassed.password,
      score: score,
      iv: enpassed.iv,
    });
    res.status(201).json(newPost);
    await newPost.save();
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const decrptyPost = async (req, res) => {
  res.send(decrpytion(req.query));
};
