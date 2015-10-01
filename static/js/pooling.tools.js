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

