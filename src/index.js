const express = require('express');
const app = express();
const mongoose = require('mongoose');
const populationRecord = require('./controllers/populationRecord');

// connect to mongoDB using mongoose
mongoose.connect('mongodb://localhost/population')
.then(() => console.log('Connected to MongoDB....'))
.catch((error) => console.log('Could not connected to MongoDB....', error));

//parse body of an object
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello user, welcome!'); 
});
app.use('/api/location', populationRecord);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}...`));