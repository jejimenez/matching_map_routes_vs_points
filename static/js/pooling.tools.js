// global variable in app
var appooling = {};
//appooling.google_maps_Marker_Seeker = custom object setted in maps.directives.js when google loaded

//Onready
$(document).ready(function(){
  //on toggle menu mobile - computer semantic
  $('.right.menu.open').on("click",function(e){
        e.preventDefault();
    $('.ui.vertical.menu').toggle();
  });
  //semantic
  $('.ui.dropdown').dropdown();
  $('.ui.checkbox').checkbox();


});
