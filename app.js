const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const yudbRoutes = require('./routes/yudb');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

let argv = process.argv;

if (argv.length > 2) {
    app.use(bodyParser.json());
} else {
    app.use(bodyParser.urlencoded());
}
app.use(express.static(path.join(__dirname, 'public')));

app.use(yudbRoutes);

app.listen(8080);