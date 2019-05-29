/**
 * @file contains database configuration settings
 */

// third party imports
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  // connect to mongoDB using mongoose
  const db = config.get('db');
  mongoose
    .connect(db)
    .then(() => console.log('Connected to MongoDB....'))
    .catch(error => console.log('Could not connected to MongoDB....', error));
};
