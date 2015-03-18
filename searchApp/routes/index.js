var express = require('express');
var connection = require('../connection.js');
var router = express.Router();
var queryDb = require('../queryDB.js');
var accessibilityLocation = require('../accessibilityLocation.js');
var url = require('url');
var fs = require('fs');

connection.connect();

/* GET home page. */
router.get('/', function(req, res) {
	//display homepage

	var urlObj=url.parse(req.url,true);

  	res.render('index', { title: 'searchMuseum' });

});

router.get('/form', function(req, res) {

	var urlObj=url.parse(req.url,true);

	var json = urlObj.query;
	console.log(urlObj.query.search);

	if(req.xhr)
	{
		queryDb(urlObj.query.search,connection,function(data,err){			
			//VALIDATE JSON
			var string = JSON.stringify(data);
			var copy = JSON.parse(string);
			
			//fs.writeFileSync('./public/objects.json', JSON.stringify(copy));
			res.json(copy);			
		});
	}
	else{
		
		/*
		queryDb(urlObj.query.search,connection,function(data,err){
				fs.writeFileSync('./public/objects.json', JSON.stringify(data));

		});
		*/

		res.render('index', { title: 'searchMuseum' });
	}


});


router.get('/accessibility', function(req, res) {

	var urlObj=url.parse(req.url,true);

	var json = urlObj.query;
	console.log(urlObj.query.search);

	if(req.xhr)
	{
		
		accessibilityLocation(urlObj.query.search,connection,function(data,err){			
			//VALIDATE JSON
			var string = JSON.stringify(data);
			var copy = JSON.parse(string);
			
			res.json(copy);			
		});
	}
	else{

		res.render('index', { title: 'searchMuseum' });
	}


});

module.exports = router;