var socket = io();
      var roomLocations = new Array();
      roomLocations["Glass Gallery"] = new Array(750,250);
      roomLocations["Geology Gallery"] = new Array(375,250);

      $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
          return false;
      });

      socket.on('chat message', function(msg){

        $('#messages').empty();
        $('#floorplanTags').empty();

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
                +itemInformation
              +'</p>'
            +'</a>';
          $("#messages").append(listAppended);
          $("#floorplanTags").append('<img src="img/tag.png" class="tagImg grow" style="top: '+itemCoords[1]+'px; left: '+itemCoords[0]+'px;">');
          // $("#floorplan").append()
        }
      });