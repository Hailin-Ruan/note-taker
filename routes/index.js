const express = require('express');
const fs = require('fs'); 
const path = require('path');
const fsUtils = require('../helpers/fsUtils'); 
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const notesFilePath = path.join(__dirname, '../db', 'db.json'); // Adjust the path

router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html')); // Adjust the path
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); // Adjust the path
});

router.get('/api/notes', (req, res) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading notes data.' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

router.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  fsUtils.readNotesFile((err, notes) => { // Directly call readNotesFile function
    if (err) {
      return res.status(500).json({ error: 'Error reading notes data.' });
    }

    notes.push(newNote);

    fsUtils.writeNotesFile(notes, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving note.' });
      }
      res.json(newNote);
    });
  });
});

router.delete('/api/notes/:id', (req, res) => {
  const noteIdToDelete = req.params.id;

  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading notes data.' });
    } else {
      let notes = JSON.parse(data);
      const updatedNotes = notes.filter(note => note.id !== noteIdToDelete);

      fs.writeFile(notesFilePath, JSON.stringify(updatedNotes, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error deleting note.' });
        } else {
          res.json({ message: 'Note deleted successfully.' });
        }
      });
    }
  });
});

module.exports = router;
