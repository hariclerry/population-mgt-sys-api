const express = require('express');
const app = express();
const config = require('config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const routes = require('./routes/routes');

require('./startup/db')();
require('./startup/config')();

//check for config env varible settings for jwt
if (!config.get('jwtPrivateKey')) {
  console.log("FATAL_ERROR: jwtPrivateKey is not defined.")
  process.exit(1);
}

// // connect to mongoDB using mongoose
// mongoose.connect('mongodb://localhost/population')
// .then(() => console.log('Connected to MongoDB....'))
// .catch((error) => console.log('Could not connected to MongoDB....', error));

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

const port = process.env.PORT || 3000

const server = app.listen(port, () => console.log(`listening on port ${port}...`));

module.exports = server;