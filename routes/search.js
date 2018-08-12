var express = require('express');
var app = express();
var ObjectId = require('mongodb').ObjectId;

// first letter capitalize function
var fistLetterUpper = function(str) {
        return str.charAt(0).toUpperCase()+str.slice(1);
};

// get ready to load index.ejs
app.get('/', (req, res, next) => {	
	req.db.collection('cars').find().sort({"_id": -1}).toArray((err, result) => {
		if (err) {
			console.log(err);
			res.render('search/result', {
				title: 'Edit or delete a document', 
				data: ''
			});
		} else {
			res.render('search/result', {
				title: 'Edit or delete a document', 
				data: result
			});
		}
	})
});

// get ready to load /search/add.ejs
app.get('/add', (req, res, next) => {
	res.render('search/add', {
		title: 'Add a new car',
		make: '',
		type: '',
		colour: ''		
	});
});

// get ready to load /search/query.ejs
app.get('/query', (req,res,next) => {
	res.render('search/query', {
		title : 'Search what you like',
		keyWord : ''
	});
});

// get key word from query.ejs and transfer data to queryResult.ejs and display as well
app.post('/query', (req, res, next) => {
	req.assert('keyWord', 'keyWord is required').notEmpty();
	
	if(!req.validationErrors()){
		var keyword = req.sanitize('keyWord').escape().trim();
		var KeyWord = fistLetterUpper(keyword);
		req.db.collection('cars').find({ $or : [{make : KeyWord} , {type : KeyWord} , {colour : KeyWord}]}).toArray((err, result) => {
		if (err) {
			console.log(err);
			res.render('search/query', {
				title: 'Search you like', 
				data: ''
			});
		} else {
			res.render('search/queryResult', {
				title: 'Cars that you may be intrested in', 
				data: result
			});
		}
	    });
	} else {
		console.log('Please input some keyword!');
		res.render('search/query', {
		title : 'Search you like',
		keyWord : ''
	    });
	}
	
});

// get new document from add.ejs and save data to mongoDB then display all record in result.ejs
app.post('/add', (req, res, next) => {	
	req.assert('make', 'make is required').notEmpty();          
	req.assert('type', 'type is required').notEmpty();             
    req.assert('colour', 'colour is required').notEmpty(); 
    
    if( !req.validationErrors() ) {
		var cars = {
			make: fistLetterUpper(req.sanitize('make').escape().trim()),
			type: fistLetterUpper(req.sanitize('type').escape().trim()),
			colour: fistLetterUpper(req.sanitize('colour').escape().trim())
		};
				 
		req.db.collection('cars').insert(cars,(err, result) => {
			if (err) {
				res.render('search/add', {
					title: 'Add A New Car',
					make: cars.make,
					type: cars.type,
					colour: cars.colour					
				})
			} else {				
				res.redirect('/search');
			}
		});		
	}
	else { 			
        res.render('search/add', { 
            title: 'Add A New Car',
            make: req.body.make,
            type: req.body.type,
            colour: req.body.colour
        })
    }
})

// when user click 'edit' button, edit.ejs will be loaded
app.get('/edit/:id', (req, res, next) => {
	var objectID = new ObjectId(req.params.id);
	req.db.collection('cars').find({"_id": objectID}).toArray( (err, result) => {
		if(err){
			console.log(err);
			res.redirect('/search/edit');
		} else{
			if (!result) {
				res.redirect('/search/edit');
				}else { 
					res.render('search/edit', {
					title: 'All cars', 
					id: result[0]._id,
					make: result[0].make,
					type: result[0].type,
					colour: result[0].colour,
					data : result
				})
			}
		} 
		
	})	
})

// update data from edit.ejs page
app.put('/edit/:id', (req, res, next) => {
	req.assert('make', 'make is required').notEmpty();          
	req.assert('type', 'type is required').notEmpty();             
    req.assert('colour', 'A valid colour is required').notEmpty();  

    var errors = req.validationErrors();
    
    if( !errors ) {  
		var user = {
			make: fistLetterUpper(req.sanitize('make').escape().trim()),
			type: fistLetterUpper(req.sanitize('type').escape().trim()),
			colour: fistLetterUpper(req.sanitize('colour').escape().trim())
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('cars').update({"_id": o_id}, user, (err, result) => {
			if (err) {
				res.render('search/result', {
					title: 'Edit or delete a document',
					id: req.params.id,
					make: req.body.make,
					type: req.body.type,
					colour: req.body.colour
				})
			} else {
				res.redirect('/search');
			}
		})		
	}
	else {   
		var error_msg = ''
		errors.forEach( (error) => {
			error_msg += error.msg + '<br>'
		})
        res.render('search/result', { 
            title: 'Edit or delete a document',            
			id: req.params.id, 
			make: req.body.make,
			type: req.body.type,
			colour: req.body.colour
        })
    }
})

// when user click 'delete' button, this document will be deleted
app.delete('/delete/:id', (req, res, next) => {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('cars').remove({"_id": o_id}, (err, result) => {
		if (err) {
			res.redirect('/search');
		} else {
			res.redirect('/search');
		}
	})	
})

module.exports = app;
