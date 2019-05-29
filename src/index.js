/**
 * @file responsible for server startup and running
 */

// local imports
const app = require('./app');

// constants
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}...`));
