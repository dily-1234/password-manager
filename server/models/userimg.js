import mongoose from "mongoose";

const userimgSchema = mongoose.Schema({
  username: String,
  imgurl: String,
  usertoken: String,
});

const userimg = mongoose.model("userimg", userimgSchema);

export default userimg;
