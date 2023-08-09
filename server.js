const express = require('express');
const fsUtils = require('./helpers/fsUtils');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 
const clog = require('./middleware/clog');
const routes = require('./routes')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(clog);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
