
$(document).ready(function() {
  $.get( "/api/algorithms", function( data ) {
    for (var i in data) {
      $( "#algo" ).append('<li class="list-group-item" style="width:300">'
        + data[i].category + ", " + data[i].subject + '</li>');
    }
  });
});
