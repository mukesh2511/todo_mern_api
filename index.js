import express, { response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userAuth from "./routes/auth.js";
import notesDoc from "./routes/notes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res("Hello World!");
});
const Connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mukesh:mukesh@cluster0.fjkhotk.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
};

app.use(express.json());

// available routes
app.use("/api/auth", userAuth);
app.use("/api/notes", notesDoc);

app.listen(port, () => {
  Connect();
  console.log(`myDiary app listening on port ${port}`);
});
