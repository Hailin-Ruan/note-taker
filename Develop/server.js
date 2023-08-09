const express = require('express');
const fsUtils = require('./helpers/fsUtils');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 
const { clog } = require('./middleware/clog');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(clog);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const notesFilePath = path.join(__dirname, 'db', 'db.json');

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/notes', (req, res) => {
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

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
  
    fsUtils.readNotesFile((err, notes) => {
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

app.delete('/api/notes/:id', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
