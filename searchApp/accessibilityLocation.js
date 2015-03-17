var newquery =
"SELECT "+
"o.id as id, "+
//"d.id as displayid, "+
"o.simple_name as title, "+
"o.description, "+
"d.l2 "+
"FROM "+
"OBJECTS o "+
"INNER JOIN DISPLAY d ON d.id = o.display_id "+
"where simple_name LIKE ? "+
"ORDER BY "+
"d.l2";

var roomLocations = new Array();
roomLocations["toilet0"] = new Array(0.5263,0.4650,0);
roomLocations["toilet1"] = new Array(0.3313,0.4100,0);
roomLocations["toilet2"] = new Array(0.5425,0.1517,0);
roomLocations["information0"] = new Array(0.5038,0.1850,0);
roomLocations["lifts0"] = new Array(0.5175,0.3500,0);
roomLocations["lifts1"]= new Array(0.6538,0.3917,1);
roomLocations["lifts2"]= new Array(0.6425,0.6767,1);
roomLocations["lifts3"] = new Array(0.4500,0.7817,2);
roomLocations["lifts4"] = new Array(0.6925,0.3183,2);


var floor1Obj={"id":"1","name":"Ground Floor","title":"Ground Floor",
               "map":"img/floor1.svg",
               "minimap":"img/floor1mini.jpg",
               "locations":[]};
var floor2Obj={"id":"2","name":"First Floor","title":"First Floor",
               "map":"img/floor2.svg",
               "minimap":"img/floor2mini.jpg",
               "locations":[]};
var floor3Obj={"id":"3","name":"Second Floor","title":"Second Floor",
               "map":"img/floor3.svg",
               "minimap":"img/floor3mini.jpg",
               "locations":[]};
var mapplicObj={"mapwidth":"800","mapheight":"600","categories":[
  ],"levels":[]};

var category0Obj={
      "id": "0",
      "title": "Ground Floor",
      "color": "#99cccc",
      "show": "false"
    };
var category1Obj={
      "id": "1",
      "title": "First Floor",
      "color": "#339999",
      "show": "false"
    };
var category2Obj={
      "id": "2",
      "title": "Second Floor",
      "color": "#336666",
      "show": "false"
    };

var locatObj={
      "id": "",
      "title": "",
      "about": "",
      "pin": "show",
      "description": "",
          "x": "",
          "y": "",
          "zoom": "3"
    };


function cloneJsonObj(data){

  var string = JSON.stringify(data);
  return JSON.parse(string);

}

function populateJson(msg){

  //converts objects into JSON objects
  var floor1 = cloneJsonObj(floor1Obj);
  var floor2 = cloneJsonObj(floor2Obj);
  var floor3 = cloneJsonObj(floor3Obj);
  var category0 = cloneJsonObj(category0Obj);
  var category1 = cloneJsonObj(category1Obj);
  var category2 = cloneJsonObj(category2Obj);

  var mapplic = cloneJsonObj(mapplicObj);

  //populates the levels of the main object
  mapplic.levels = [floor1,floor2,floor3];
  mapplic.categories = [category0,category1,category2];
  var  i=0;
  for(var idx in roomLocations){
      
      var itemLocation = roomLocations[msg+i];
      
      if(itemLocation!=null){
        locatObj.id = msg+i;
        locatObj.x = itemLocation[0];
        locatObj.y = itemLocation[1];
        locatObj.category = itemLocation[2];
        locatObj.about = "";
        mapplic.levels[itemLocation[2]].locations.push(cloneJsonObj(locatObj));
        console.log(locatObj);
    }

    i++;
  }
  return mapplic;
}


var queryDB = function (msg, conn, callback)
{
  var mapplicdata = populateJson(msg);
  callback(mapplicdata,null);

	// var localquery='%'+msg+'%';
 //  console.log("Query: "+localquery);
	// conn.query( newquery,localquery, function(err, rows, fields) {

	//     if (err) callback(null,err);
 //      var mapplicdata = populateJson(rows);
	//     callback(mapplicdata,null);

	// });

}

module.exports = queryDB;
