var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;

var time_handler = function (time){

	var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var years = days * 365;
    var t = time.getTime();
    t = t - (0*days);
    return t;

};

exports.insert_document = function(db, doc, callback) {
   
   db.collection('locations').insertOne( doc, function(err, result){
    //assert.equal(err, null);
    callback(err,result);
  });
   
};

exports.find_document = function(db, arg, callback){

	var collection =  db.collection('locations');
	var cursor = collection.find({ 'key' : arg }).limit(1);
	cursor.toArray(function (err,docs){
		//assert.equal(err, null);//DEVELOPMENT
		callback(err,docs);
	});
};

exports.find_all_document = function(db, callback){

	var collection =  db.collection('locations');
	var cursor = collection.find({},{ "key": 1 });
	cursor.toArray(function (err,docs){
		//assert.equal(err, null);//DEVELOPMENT
		callback(err,docs);
	});
};

exports.remove_document = function(db, callback){

	var today = new Date();
	var one_week_ago = time_handler(today);
	var collection =  db.collection('locations');
	var cursor = collection.remove( { 'time': { '$lt': one_week_ago } } );
	callback(cursor);

};

var extract_obj = function (doc){

	var map = doc['map'];
	console.log(map);

};