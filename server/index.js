import express from "express";
import postRoutes from "./routes/post.js";
import decrptRoutes from "./routes/decrpyt.js";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import csvRoutes from "./routes/csv.js";
import imageRoutes from "./routes/userimage.js";
import facecomp from "./routes/facecomp.js";
import dotenv from "dotenv";
const app = express();
dotenv.config();
import bodyParser from "body-parser";

// middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/decrypt", decrptRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/facecompare", facecomp);

// MongoDB database connection

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.CONNECTIONURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
