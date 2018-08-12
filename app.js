var express = require('express');
var app = express();
var expressMongoDb = require('express-mongo-db');

// create url for expressMongoDB
// var url = 'mongodb://localhost:27017/Car';
var url = 'mongodb://mongodb/Car';
app.use(expressMongoDb(url));

// create body-parser object to read data from forms
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// create express-validator object to check data from forms
var expressValidator = require('express-validator');
app.use(expressValidator());

// set view engine to import javacsript file
app.set('view engine', 'ejs');
app.set('views', __dirname +'views');
var index = require('./routes/index');
var search = require('./routes/search');

// create method-override object to override methods like 'get' and 'post'
var methodOverride = require('method-override')
app.use(methodOverride( (req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// improt javascript files to index.ejs
app.use('/', index);
app.use('/search', search);

// listen to port 3000
app.listen(3000, () => {
	console.log('Server running at port 3000: http://127.0.0.1:3000')
});





