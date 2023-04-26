import express from "express";
import { User } from "../models/user.js";

import Joi from "joi";
import crypto from "crypto";
import bcrypt from "bcrypt";
const router = express.Router();

// Creates the symmetric encryption key from the users master password
async function keyHashed(password, salt, iterations, keylen, digest) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keylen,
      digest,
      (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey.toString("hex"));
        }
      }
    );
  });
}

// Authenticates the user during the login page
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const token = user.generateAuthToken();

    const key = await keyHashed(
      req.body.password,
      process.env.SALT1,
      100000,
      16,
      "sha512"
    );

    res.status(200).send({
      userid: user._id,
      key: key,
      data: token,
      message: "logged in successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

export default router;
