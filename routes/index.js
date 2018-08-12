var express = require('express');
var app = express();

// get ready to load index.ejs
app.get('/', (req, res) => {
	res.render('index', {title: 'Lendi Cars'})
});

module.exports = app;
