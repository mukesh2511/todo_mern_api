import express from "express";
const router = express.Router();
import fetchUser from "../middleware/fetchUser.js";
import Note from "../models/Note.js";
import { body, validationResult } from "express-validator";

// Route1 : Get all notes using GET "/api/auth/fetchallnotes" . Login Required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route2 : Add a note using POST "/api/notes/addnote" . Login Required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "description must be of minimum 5 characters").isLength(
      { min: 5 }
    ),
  ],
  async (req, res) => {
    //If there are errors , return Bad request and the errors
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savenote = await note.save();
      res.json(savenote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Route3 : update a note using PUT "/api/notes/updatenote" . Login Required

router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied ");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route4 : delete a note using DELETE "/api/notes/updatenote" . Login Required

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  //find the note to be deleted and delete it
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    //Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied ");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.status(200).json(note);
    } else {
      throw new Error("Not found");
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
