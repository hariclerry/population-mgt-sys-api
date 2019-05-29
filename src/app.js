const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const routes = require('./routes/routes');

require('./startup/db')();
require('./startup/config')();

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);
app.get('/', (req, res) => {
  res.send('Hello user, welcome to population management system'); 
});

app.all('*', (req, res) => {
  res.status(200).send('Oooooops wrong endpoint!'); 
});

module.exports = app;

 