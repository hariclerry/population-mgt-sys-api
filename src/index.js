const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const routes = require('./routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// connect to mongoDB using mongoose
mongoose.connect('mongodb://localhost/population')
.then(() => console.log('Connected to MongoDB....'))
.catch((error) => console.log('Could not connected to MongoDB....', error));

//parse body of an object
app.use(express.json());

const swaggerDefinition = {
  info: {
    title: 'Population management system API',
    version: '1.0.0',
    description: 'Endpoints to test the user registration routes',
  },
  host: 'localhost:3000',
  basePath: '/'
};

const options = {
  swaggerDefinition,
  apis: ['./routes.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// require('./config/passport');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// router.use('/', swaggerUi.serve);
// router.get('/', swaggerUi.setup(swaggerDocument));

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