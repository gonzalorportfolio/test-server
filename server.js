const path = require('path');
const express = require('express');
const multer = require('multer');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite'
  },
  useNullAsDefault: true
});

const app = express();

const publicDir = path.join(__dirname, '..', 'public');
const staticServer = express.static(publicDir);
app.use(staticServer);

app.use((req, res, next) => { //middleware to console.log request method/URL, and time and date
  const time = (new Date()).toLocaleString();// store the time and date into a variable
  console.log(`${req.method}: ${req.originalUrl} - ${time}`) //this will be log to the console
  next(); // move on to the next middleware (or route handler)
});

const upload = multer({ dest: 'uploads/' });
app.get ('/', (req, res)=> {
  console.log('home');
  res.send('hi!')
})
app.post('/upload', upload.single('image'), async (req, res) => {
  const { filename } = req.file;

  // Save image filename to database using Knex
  await knex('images').insert({ filename });

  res.send('Image uploaded successfully');
});
const port = 8080;
const host = 'localhost';
app.listen(port, host, () => console.log('Server started'));
