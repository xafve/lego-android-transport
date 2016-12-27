$(function() {


  function dataReceived(str) {
    $("#speed").html(str);
  }

  function dataFailure() {
    console.log("Error with data subscription");
  }

  function connectSuccess() {
    console.log("connect success");
    $(".connected").show();
    $(".notconnected").hide();
    bluetoothSerial.subscribe('\n', dataReceived, dataFailure);

  }

  function connectFailed() {
    console.log("bluetooth connect failed");
    alert("connect failed");
  }

  var counter = 0;
  function writeSuccess() {
    console.log("Write success");
    ++counter;
    $("#counter").html(counter);
  }

  function writeFailure() {
    console.log("Write failure");
  }

  function send(i) {
    if (!!window.cordova) { 
      bluetoothSerial.write(i, writeSuccess, writeFailure);      
    } else {
      console.log("Command", i);
      writeSuccess();
    };   
  }

  $("#stop").click(function() {
    send("0");
  });

  $("#start").click(function() {
    send("1");
  });

  $("#faster").click(function() {
    send("2");
  });

  $("#slower").click(function() {
    send("3");
  });

  $("#disconnect").click(function() {
    if (!!window.cordova) {
      console.log("bluetooth disconnect");
      bluetoothSerial.unsubscribe();
      bluetoothSerial.disconnect();
    };
    $(".connected").hide();
    $(".notconnected").show();
    $("#connectionlist").html("");
    
  });

  function startConnection(id) {
    console.log("starting connection", id);
    if (!!window.cordova) {
      console.log("bluetooth connect");
      bluetoothSerial.connect(id, connectSuccess, connectFailed);
    } else {
      connectSuccess();
    }
  }
  function connectionsloaded(connections) {
    console.log("loading connections");
    $("#connectionlist").html("");
    var connectionlist = $("#connectionlist");
     for (var i=0 ; i < connections.length ; ++i) {
       var connection = connections[i];
       console.log("Adding connection:", connection.name);
       $(document.createElement("div"))
         .html(connection.name)
         .attr("uid", connection.address)
         .appendTo(connectionlist)
         .click(function() {
           var elem = $(this);
           var id = elem.attr("uid");
           startConnection(id);
         });
     }
  }

  function connectionsfailure() {
    alert("could not get list");
  }

  function initialize() {
    console.log("initializing");
    if (!!window.cordova) {
      $("#listconnections").click(function() {
        bluetoothSerial.list(connectionsloaded, connectionsfailure);
      });

    } else {
      $("#listconnections").click(function() {
        console.log("list connections clicked");
        connectionsloaded([{
          "class": 276,
          "id": "10:BF:48:CB:00:00",
          "address": "10:BF:48:CB:00:00",
          "name": "Nexus 7"
        }, {
          "class": 7936,
          "id": "00:06:66:4D:00:00",
          "address": "00:06:66:4D:00:00",
          "name": "RN42"
        }]);
      });
    }
  }

  initialize();
});
