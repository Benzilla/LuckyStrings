var socket = io();
var roomLocations = new Array();
roomLocations["Glass Gallery"] = new Array(752,235);
roomLocations["Geology Gallery"] = new Array(375,250);
roomLocations["Eastern Art Gallery"] = new Array(805,110);
roomLocations["World Wildlife Gallery"] = new Array(370,110);
roomLocations["Wills (Rear) Hall"] = new Array(153,155);
roomLocations["British Wildlife Gallery"]= new Array(535,220);
roomLocations["Egypt Gallery"]= new Array(250,370);
roomLocations["Ground Floor Lift Foyer"] = new Array(100,420);
roomLocations["Curiosity"] = new Array(250,140);
roomLocations["Winterstoke (Front) Hall"] = new Array(150,340);
roomLocations["Chinese Glass Gallery"] = new Array(688,120);
roomLocations["Sea Dragons Gallery"] = new Array(153,225);
roomLocations["South West Wildlife Gallery"] = new Array(50,380);

var stuffInRooms = new Array();
  stuffInRooms["Glass Gallery"] = "";
  stuffInRooms["Geology Gallery"] = "";
  stuffInRooms["Eastern Art Gallery"] = "";
  stuffInRooms["World Wildlife Gallery"] = "";
  stuffInRooms["Wills (Rear) Hall"] = "";
  stuffInRooms["British Wildlife Gallery"]= "";
  stuffInRooms["Egypt Gallery"]= new Array(250,370);
  stuffInRooms["Ground Floor Lift Foyer"] = "";
  stuffInRooms["Curiosity"] = "";
  stuffInRooms["Winterstoke (Front) Hall"] = "";
  stuffInRooms["Chinese Glass Gallery"] = "";
  stuffInRooms["Sea Dragons Gallery"] = "";
  stuffInRooms["South West Wildlife Gallery"] = "";

$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
    return false;
});

socket.on('chat message', function(msg){

  $('#messages').empty();
  $('#floorplanTags').empty();
  var taggedLocations = [];
  var x=0;
  var rows = msg.split('\n');
  for (var i in rows){
    var item = rows[i].split('- ');
    var itemInformation = item[0];
    var location = item[1];
    var itemCoords = roomLocations[location];
    var listAppended =
      '<a href= "#" class="list-group-item">'
        +'<h4 class = "list-group-item-heading">'
          +location
        +'</h4>'
        +'<p>'
          +itemInformation;
        +'</p>'
      +'</a>';
    $("#messages").append(listAppended);
    if(itemCoords!=null){
      if($.inArray(location, taggedLocations)==-1){
        $("#floorplanTags").append('<img src="img/tag.png" id="'+location+'" tabindex="50" class="tagImg animated bounceInDown" data-placement="top" style="top: '+itemCoords[1]+'px; left: '+itemCoords[0]+'px;">');
        taggedLocations[x] = location;
        x++;
      }
      stuffInRooms[location] = stuffInRooms[location]+" "+itemInformation;
    }
  }
});


function resetRooms(){
stuffInRooms["Glass Gallery"] = "";
stuffInRooms["Geology Gallery"] = "";
stuffInRooms["Eastern Art Gallery"] = "";
stuffInRooms["World Wildlife Gallery"] = "";
stuffInRooms["Wills (Rear) Hall"] = "";
stuffInRooms["British Wildlife Gallery"]= "";
stuffInRooms["Egypt Gallery"]= "";
stuffInRooms["Ground Floor Lift Foyer"] = "";
stuffInRooms["Curiosity"] = "";
stuffInRooms["Winterstoke (Front) Hall"] = "";
stuffInRooms["Chinese Glass Gallery"] = "";
stuffInRooms["Sea Dragons Gallery"] = "";
stuffInRooms["South West Wildlife Gallery"] = "";
}
