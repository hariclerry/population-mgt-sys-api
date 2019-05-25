const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const routes = require('./routes/routes');

// connect to mongoDB using mongoose
mongoose.connect('mongodb://localhost/population')
.then(() => console.log('Connected to MongoDB....'))
.catch((error) => console.log('Could not connected to MongoDB....', error));

//parse body of an object
app.use(express.json());

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);
app.get('/', (req, res) => {
  res.send('Hello user, welcome to population management system'); 
});
// app.use('/api/lo);
// app.use('/api/location/sub', subLocation);

app.all('*', (req, res) => {
  res.status(200).send('Oooooops wrong endpoint!'); 
});

const port = process.env.PORT || 3000

const server = app.listen(port, () => console.log(`listening on port ${port}...`));

module.exports = server;