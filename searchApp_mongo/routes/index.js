var express = require('express');
var router = express.Router();
var accessibilityLocation = require('../accessibilityLocation.js');
var url = require('url');
var fs = require('fs');

//******* mysql connection

var queryDb = require('../queryDB.js');
var connection = require('../connection.js');
connection.connect();

//******* mongoconnection

var mongo_url='mongodb://127.0.0.1/museumdb';
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var client_req = require('../client_mongo.js');

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
		//***** check precomputed shelf *****//
		MongoClient.connect(mongo_url, function(err, db){ 
			assert.equal(null, err);
			client_req.find_document(db, urlObj.query.search, function (err,result) {
				assert.equal(null, err);
				//***** results are in the precomputed shelf *****//
				if(result.length!=0){
					console.log('already in database');
					console.log(result[0]['map']);
					db.close();
					res.json(result[0]['map']);
				}
				//***** results have to be computed *****//
				else{
					console.log('need to query sql database');
					queryDb(urlObj.query.search,connection,function(data,err){
						//VALIDATE JSON
						var string = JSON.stringify(data);
						var copy = JSON.parse(string);
						var doc = { "key" : urlObj.query.search , "map": copy };
						
						//***** insert computed query into shelf ****//
						client_req.insert_document(db,doc,function (err,result) {
							assert.equal(null, err);
  							console.log(result['result']); 
  							db.close();
  						});
						//***** meanwhile serve your client <3 ****//
  						res.json(copy);

					});	
				}
				
			});

		});	
		
	}
	else{
		
		/* SCRIPT MIGHT STILL NEED
		queryDb(urlObj.query.search,connection,function(data,err){fs.writeFileSync('./public/objects.json', JSON.stringify(data));});
		*/

		res.render('index', { title: 'searchMuseum' });
	}


});

router.get('/about', function(req, res) {

	res.render('about', { title: 'searchMuseum' });

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