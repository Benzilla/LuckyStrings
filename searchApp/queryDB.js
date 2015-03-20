
// stemmer
var natural = require('natural');
var stemmer = natural.PorterStemmer;
stemmer.attach();

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
"where"+
"(simple_name LIKE ? "+
"or description LIKE ? "+
"or collection LIKE ? )";
// "ORDER BY "+
// "d.l2";

var opt = "AND (" +
"simple_name LIKE ? "+
"or description LIKE ? "+
"or collection LIKE ? )"+
")";

var roomLocations = new Array();
roomLocations["Glass Gallery"] = new Array(0.5263,0.4650,2);
roomLocations["Geology Gallery"] = new Array(0.3313,0.4100,1);
roomLocations["Eastern Art Gallery"] = new Array(0.5425,0.1517,2);
roomLocations["World Wildlife Gallery"] = new Array(0.5038,0.1850,1);
roomLocations["Wills (Rear) Hall"] = new Array(0.5175,0.3500,0);
roomLocations["British Wildlife Gallery"]= new Array(0.6538,0.3917,1);
roomLocations["Egypt Gallery"]= new Array(0.6425,0.6767,0);
roomLocations["Ground Floor Lift Foyer"] = new Array(0.4500,0.7817,0);
roomLocations["Curiosity"] = new Array(0.6925,0.3183,0);
roomLocations["Winterstoke (Front) Hall"] = new Array(0.4800,0.6017,0);
roomLocations["Chinese Glass Gallery"] = new Array(0.4113,0.2205,2);
roomLocations["Sea Dragons Gallery"] = new Array(0.5038,0.4550,0);
roomLocations["South West Wildlife Gallery"] = new Array(0.3050,0.6433,0);

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

function cloneJsonObj(data){

  var string = JSON.stringify(data);
  return JSON.parse(string);

}

function populateJson(rows){

  var spc = 0.013; //spacing- modify if you want to change space of pins
  var scatterLocations = new Array();
    scatterLocations["Glass Gallery"] = new Array(-spc,-spc);
    scatterLocations["Geology Gallery"] = new Array(-spc,-spc);
    scatterLocations["Eastern Art Gallery"] = new Array(-spc,-spc);
    scatterLocations["World Wildlife Gallery"] = new Array(-spc,-spc);
    scatterLocations["Wills (Rear) Hall"] = new Array(-spc,-spc);
    scatterLocations["British Wildlife Gallery"]= new Array(-spc,-spc);
    scatterLocations["Egypt Gallery"]= new Array(-spc,-spc);
    scatterLocations["Ground Floor Lift Foyer"] = new Array(-spc,-spc);
    scatterLocations["Curiosity"] = new Array(-spc,-spc);
    scatterLocations["Winterstoke (Front) Hall"] = new Array(-spc,-spc);
    scatterLocations["Chinese Glass Gallery"] = new Array(-spc,-spc);
    scatterLocations["Sea Dragons Gallery"] = new Array(-spc,-spc);
    scatterLocations["South West Wildlife Gallery"] = new Array(-spc,-spc);

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
  for(var idx in rows){
    if (rows.hasOwnProperty(idx))
    {
      var itemLocation = roomLocations[rows[idx].l2];
      if(itemLocation!=null){

        rows[idx].x = roomLocations[rows[idx].l2][0]+scatterLocations[rows[idx].l2][0];
        rows[idx].y = roomLocations[rows[idx].l2][1]+scatterLocations[rows[idx].l2][1];
        scatterLocations[rows[idx].l2][0]+=spc;
        //if x scatter location is at max
        if(scatterLocations[rows[idx].l2][0]>spc){
          scatterLocations[rows[idx].l2][0]= -spc;  //reset x scatter value to min
          scatterLocations[rows[idx].l2][1]+=spc;   //update y scatter value
          //if y scatter value is at max
          if(scatterLocations[rows[idx].l2][1]>spc){
            scatterLocations[rows[idx].l2][1]= -spc; //reset y scatter value to min
          }
        }
        rows[idx].category = roomLocations[rows[idx].l2][2];
        rows[idx].about = "";
        delete rows[idx].l2;
        mapplic.levels[itemLocation[2]].locations.push(rows[idx]);
        //console.log(rows[idx]);
      }
    }
  }
  return mapplic;
}

var mysql = require('mysql');

var queryDB = function (msg, conn, callback)
{

  console.log(msg.stem());

  if(!msg)
    msg="sdfsdfsdfsdfsdfsfd";

  var localquery='% '+msg.stem()+'%';

  // exact name or substring in description
  var inserts = [localquery, localquery, localquery];
  localquery = mysql.format(newquery, inserts);

  //console.log("Query: "+localquery);
  conn.query( localquery, function(err, rows, fields) {

      if (err) callback(null,err);
      var mapplicdata = populateJson(rows);
      callback(mapplicdata,null);

  });

}

module.exports = queryDB;