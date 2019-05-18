const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const populationRecord = require('./controllers/mainLocation');
const subLocation = require('./controllers/subLocation');

// connect to mongoDB using mongoose
mongoose.connect('mongodb://localhost/population')
.then(() => console.log('Connected to MongoDB....'))
.catch((error) => console.log('Could not connected to MongoDB....', error));

//parse body of an object
app.use(express.json());

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('Hello user, welcome!'); 
});
app.use('/api/location', populationRecord);
app.use('/api/location/sub', subLocation);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}...`));