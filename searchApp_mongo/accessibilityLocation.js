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
roomLocations["toilet0"] = new Array(0.5720,0.4800,0);
roomLocations["toilet1"] = new Array(0.3975,0.4800,0);
roomLocations["toilet2"] = new Array(0.5750,0.4300,0);
roomLocations["toilet3"] = new Array(0.4050,0.4300,0);
roomLocations["information0"] = new Array(0.5715,0.6120,0);
roomLocations["lifts0"] = new Array(0.7175,0.4600,0);
roomLocations["lifts1"]= new Array(0.7188,0.4450,1);
roomLocations["lifts2"]= new Array(0.7075,0.6089,1);
roomLocations["lifts3"] = new Array(0.7388,0.5817,2);
roomLocations["lifts4"] = new Array(0.7530,0.4277,2);


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
        locatObj.title = msg+i;

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
