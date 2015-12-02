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

// global variable in app
appooling = {};

var pooling_tools =
{
    // Customized map markers Objects to use from the app 
    // This function must be called when google maps is ready
	getObjMarkersSeekers : function(){
		google_maps_Marker_Seeker = function (options) {
                        google.maps.Marker.call( this, options );
                        this.pln_type = options.pln_type;
                        this.id_seeker = options.id_seeker;
                    }
        // setting up the inheritance
        // add the attributes pln_type to define if it's start of route or end of route. Values = start, end
        // add the attributes id_seeker to keep the id of the user seeker
        google_maps_Marker_Seeker.prototype = Object.create( google.maps.Marker.prototype );
        google_maps_Marker_Seeker.prototype.setPlnType = function (pln_type) {this.pln_type = pln_type};
        google_maps_Marker_Seeker.prototype.getPlnType = function () {return this.pln_type};
        google_maps_Marker_Seeker.prototype.setIdSeeker = function (id_seeker) {this.id_seeker = id_seeker};
        google_maps_Marker_Seeker.prototype.getIdSeeker = function () {return this.id_seeker};
        return google_maps_Marker_Seeker;
	}
}