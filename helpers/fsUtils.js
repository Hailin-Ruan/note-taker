const fs = require('fs');
const util = require('util');
const path = require('path');

const notesFilePath = path.join(__dirname, '../db', 'db.json');

const readNotesFile = (callback) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      const notes = JSON.parse(data);
      callback(null, notes);
    }
  });
};

const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`\nData written to ${destination}`);
  }
});
    // err ? console.error(err) : console.info(`\nData written to ${destination}`)

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      console.log('Appending data:', content);
      writeToFile(file, parsedData);
    }
  });
};

module.exports = { readFromFile, writeToFile, readAndAppend };
