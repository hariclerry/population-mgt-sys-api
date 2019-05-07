const express = require('express');
const app = express();
//parse body of an object
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!'); 
});

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}...`))