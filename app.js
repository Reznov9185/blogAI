const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/views'));

const readJson = fs.readFileSync('./data/series.json');
const data = JSON.parse(readJson);

app.get('/', (req, res) => {
  res.render('index', { data });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
