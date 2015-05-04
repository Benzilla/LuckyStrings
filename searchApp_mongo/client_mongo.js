var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;

exports.insert_document = function(db, doc, callback) {
   db.collection('locations').insertOne( doc, function(err, result){
    assert.equal(err, null);
    console.log("Inserted a document into the locations collection.");
    callback(err,result);
  });
};

exports.find_document = function(db, arg, callback){

	var collection =  db.collection('locations');
	var cursor = collection.find({ 'key' : arg }).limit(1);
	cursor.toArray(function (err,docs){
		assert.equal(err, null);
		callback(err,docs)
	});

};

var extract_obj = function (doc){

	var map = doc['map'];
	console.log(map);

};