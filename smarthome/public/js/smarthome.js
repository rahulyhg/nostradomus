//Funzioni comuni
function Display_Load()   
{ 
    $("#loading").fadeIn(900,0);
    $("#loading").html('<img src="/images/ajax-loader-hp.gif" />');
};

//Hide Loading Image
function Hide_Load()
{
  $("#loading").fadeOut('slow');
};

function getArduino() {
  // gestisce i dettagli istanze
  Display_Load();
  var ip = $("#ip_num").val();
  $.ajax({
    url: "http://"+ip+"/arduino?callback=?",
    type: "GET",
    async: false,
    cache: false,
    timeout: 30000,
    jsonpCallback: 'jsonCallback',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(data) {
            Hide_Load();
    },
    error: function (xhr, ajaxOptions, thrownError) {
        Hide_Load();
        console.log(xhr.status);
        console.log(thrownError);
        $('#system_info').append("<p><small>Error calling server!</small></p>");
    }
  });
  return true;      
}

function jsonCallback(data) {
            if (data) {
              console.log(data);
              var temp_in = parseFloat(data.T);
              $('#temp_in').empty();
              $('#temp_in').append(temp_in.toFixed(1)+'°');
              $('#system_info').append("<p><small>"+data.msg+"</small></p>");
              $('input[name="sw-main"]').bootstrapSwitch('state', (data.MS=='ON'), true);
              $('input[name="sw-fan"]').bootstrapSwitch('state', (data.FAN=='ON'), true);
              $('input[name="sw-season"]').bootstrapSwitch('state', (data.S=='summer'), true);
              $('input[name="t_min"]').val(data.Tmin);
              $('input[name="t_max"]').val(data.Tmax);
            }
}


function postArduino(sensor, state) {
  // gestisce i dettagli istanze
//  var data = [{"sensor":"test", "state":"true"}];
  Display_Load();
  var ip = $("#ip_num").val();
  $.ajax({
    url: "http://"+ip+"/postino?callback=?",
    type: "GET",
    async: false,
    cache: false,
    timeout: 30000,
    contentType: "application/json",
    dataType: 'jsonp',
    jsonpCallback: 'jsonCallback',
    data : {"sensor": sensor, "state": state},
    success: function(data) {
            Hide_Load();
    },
    error: function (xhr, ajaxOptions, thrownError) {
        Hide_Load();
        console.log(xhr.status);
        console.log(thrownError);
        $('#system_info').append("<p><small>Error calling server!</small></p>");
    }
  });
  return true;      
}


$(document).ready(function() {	

  $( '#loadArduino' ).click( function() {
  	getArduino();
  });

  $('input[name="sw-main"]').on('switchChange.bootstrapSwitch', function(event, state) {
    var stato = (state == false) ? 0 : 1;
    postArduino('M', stato);
  });

  $('input[name="sw-fan"]').on('switchChange.bootstrapSwitch', function(event, state) {
    var stato = (state == false) ? 2 : 1;
    postArduino('F', stato);
  });

// Initials
  // initialize all the inputs
  $('input[name="sw-main"]').bootstrapSwitch();
  $('input[name="sw-fan"]').bootstrapSwitch();
  $('input[name="sw-season"]').bootstrapSwitch();
});
