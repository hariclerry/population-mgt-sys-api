/**
 * @file is the application entry point, initialises the application
 */

// Third party imports
const express = require('express');
const bodyParser = require('body-parser');

// local imports
const routes = require('./routes/routes');
require('./startup/db')();
require('./startup/config')();

// initializes express app
const app = express();

// third party middleware
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// inital route
routes(app);
app.get('/', (req, res) => {
  res.send('Hello user, welcome to population management system');
});

// Cater to invalid routes
app.all('*', (req, res) => {
  res.status(200).send('Oooooops, wrong endpoint!');
});

module.exports = app;
