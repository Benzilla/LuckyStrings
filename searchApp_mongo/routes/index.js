var express = require('express');
var router = express.Router();
var accessibilityLocation = require('../accessibilityLocation.js');
var url = require('url');
var fs = require('fs');

//*******  stemmer
var natural = require('natural');
var stemmer = natural.PorterStemmer;
stemmer.attach();

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

//******* very important CONDITION VARIABLE for concurrent updating on the database

var REQUEST_SERVING_busy = false;
var REFRESHING_busy = false;

/* GET home page. */
router.get('/', function(req, res) {

	var urlObj=url.parse(req.url,true);
  	res.render('index', { title: 'searchMuseum' });

});

/* GET serving a form request. */
router.get('/form', function(req, res) {

	var urlObj=url.parse(req.url,true);
	var json = urlObj.query;
	//console.log(urlObj.query.search);//DEVELOPMENT

	if(req.xhr && !REFRESHING_busy)
	{
		REQUEST_SERVING_busy=true;
		//***** check precomputed shelf *****//
		MongoClient.connect(mongo_url, function(err, db){ 
			//assert.equal(null, err);//DEVELOPMENT
			var key_q="";
			searchWords  = urlObj.query.search.split(" ");
			for (i=0;i<searchWords.length;i++){
    			searchWords[i]=searchWords[i].stem();
			}
			for (i=0;i<searchWords.length;i++){
    			key_q=key_q+" "+searchWords[i];
			}

			client_req.find_document(db, key_q, function (err,result) {
				//assert.equal(null, err);//DEVELOPMENT
				//***** results are in the precomputed shelf *****//
				if(result.length!=0 && err==null){
					console.log('already into the locations collection');
					console.log(result[0]);
					db.close();
					res.json(result[0]['map']);
					REQUEST_SERVING_busy=false;
				}
				//***** results have to be computed *****//
				else{
					//console.log('need to query sql database');
					queryDb(urlObj.query.search,connection,function(data,err){
						//VALIDATE JSON
						var string = JSON.stringify(data);
						var copy = JSON.parse(string);
						var date = new Date();
						var time = date.getTime();
						var doc = { "key" : key_q , "map": copy , "date": date , "time": time };
						
						//***** insert computed query into shelf ****//
						client_req.insert_document(db,doc,function (err,result) {
							assert.equal(null, err);
							console.log("Inserted a document into the locations collection.");
  							console.log(result['result']); 
  							db.close();
  						});
						//***** meanwhile serve our client <3 ****//
  						res.json(copy);
  						REQUEST_SERVING_busy=false;
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

/* GET serving backend service REFRESHING. */
router.get('/backendservicerREFRESHING', function(req, res) {

	if(!REQUEST_SERVING_busy){
		
		REFRESHING_busy=true;
		
		MongoClient.connect(mongo_url, function(err, db){ 
			client_req.remove_document(db, function(result) {
				REFRESHING_busy=false;
				res.json({"result":"OK"});
			});
		});
	}
	else
		res.json({"result":"Busy"});
});

/* GET serving backend service LIST. */
router.get('/backendservicerLIST', function(req, res) {

	if(!REQUEST_SERVING_busy){
		
		MongoClient.connect(mongo_url, function(err, db){ 
			client_req.find_all_document(db, function (err,result) {
				if(err==null)
					res.json({"result": "OK", "result" : result});
				else
					res.json({"result": "ERROR", "result" : err});
			});
		});
	}
	else
		res.json({"result":"Busy"});
});

/* GET about page. */
router.get('/about', function(req, res) {

	res.render('about', { title: 'searchMuseum' });

});

/* GET serving an accessibility request. */
router.get('/accessibility', function(req, res) {

	var urlObj=url.parse(req.url,true);
	var json = urlObj.query;
	console.log(urlObj.query.search);

	if(req.xhr){	
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