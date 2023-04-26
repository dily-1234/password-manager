import mongoose from "mongoose";

const passwordSchema = mongoose.Schema({
  username: String,
  website: String,
  webusername: String,
  password: String,
  score: Number,
  iv: String,
});

const PasswordMessage = mongoose.model("PasswordMessage", passwordSchema);

export default PasswordMessage;
