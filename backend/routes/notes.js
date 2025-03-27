const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Get all the notes using: GET "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new note using: POST "/api/notes/addnote"
router.post(
    '/addnote',
    fetchuser,
    [
        // Validate and sanitize the 'title' field
        body('title', 'Enter a valid title (at least 3 characters)').isLength({ min: 3 }),

        // Validate the 'description' field
        body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, description, tag } = req.body;

            // Create a new note
            const note = new Note({
                title,
                description,
                tag,
                user: req.user.id,
            });

            // Save the note to the database
            const savedNote = await note.save();
            res.status(201).json(savedNote);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Update an existing note using: PUT "/api/notes/updatenote/:id"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        // Create a newNote object
        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // Find the note to be updated
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Allow update only if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'You can only update your own notes' });
        }

        // Update the note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an existing note using: DELETE "/api/notes/deletenote/:id"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Allow deletion only if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'You can only delete your own notes' });
        }

        // Delete the note
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ success: 'Note has been deleted', note });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;