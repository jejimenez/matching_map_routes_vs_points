/**
* GoMaps
* @namespace pooling.maps.directives
*/
(function () {
  'use strict';

angular.module('pooling.maps.directives', [])
.directive('gMap', gMapDirective);


  gMapDirective.$inject = ['$window', '$parse', '$timeout'];


    function gMapDirective($window,$parse,$timeout) {
        var counter = 0,
        prefix = '__ep_gmap_',
        img_start_rt = 'http://maps.google.com/mapfiles/kml/paddle/go.png',
        img_end_rt = 'http://maps.google.com/mapfiles/kml/paddle/ylw-square.png',
        str_start_rt = 'Inicio de ruta',
        str_end_rt = 'Fin de ruta',
        msg_marker_added_start = 'Marcador agregado:Inicio de ruta',
        msg_marker_added_end = 'Marcador agregado:Fin de ruta',
        strPlnTypeStart = 'start',
        strPlnTypeEnd = 'end';
        
        var link = function (scope, element, attrs, controller) {
            //function called in timeout
            function directive_function (scope, element, attrs, controller){
                //scope.$watch(attrs.gMap, function() {});
                var model = scope.gmap;
                var maps_arr = [];
                if ($window.google && $window.google.maps) {
                    gMapInit();  
                } else {
                    maps_arr.push(injectGoogle());
                };
                counter++;
                
                function log(str){toastr["success"](str);}
                function gMapInit() {
                   var i=0;                   
                    var 
                    directionsDisplay = new google.maps.DirectionsRenderer({
                        draggable: true
                    }),
                    mapOptions = {
                            center: new google.maps.LatLng(model.Lat, model.Lon),
                            zoom: model.zoom,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                    scope.gmap.markers = [];
                    scope.gmap.maps = [];
                    //scope.gmap.markers = [];
                    //scope.gmap.maps;// = [];
                    try{scope.gmap.maps[counter] = new google.maps.Map(document.getElementById(attrs.idmap),mapOptions)}
                    catch(err){console.error(err);return false;}
                    // add your fixed business marker
                    directionsDisplay.setMap(scope.gmap.maps[counter]);
                    google.maps.event.addListener(scope.gmap.maps[counter], 'click', function(event) {
                       placeMarker(event.latLng);
                    });
                    google.maps.event.addListenerOnce(scope.gmap.maps[counter], 'tilesloaded', function(){
                        log("Mapa cargado!");
                        if(scope.seekers){
                            console.log("seeeekkeers2"+scope.seekers[0].start_lat+"::"+scope.seekers[0].start_lng);
                            placeMarker(new google.maps.LatLng(scope.seekers[0].start_lat,
                                                             scope.seekers[0].start_lng));
                            console.log("seeeekkeers1"+scope.seekers[0].end_lat+"::"+scope.seekers[0].end_lnt);
                            placeMarker(new google.maps.LatLng(scope.seekers[0].end_lat,
                                                             scope.seekers[0].end_lnt));
                        }
                    });

                    // Try HTML5 geolocation
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var pos = new google.maps.LatLng(position.coords.latitude,
                                                             position.coords.longitude);
                            scope.gmap.maps[counter].setCenter(pos);
                            scope.$apply(function () {
                                model.fromAddress = pos;
                            });
                        });
                    }
                    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {});

                    /** If ther is a seeker (points) previously setted  **/


                    /**
                    * place the markers. Just two markers, start rout and end rout.
                    **/
                    function placeMarker(location) {
                        function google_maps_Marker_Seeker(options) {
                            google.maps.Marker.call( this, options );
                            this.pln_type = options.pln_type;
                        }
                        // setting up the inheritance
                        google_maps_Marker_Seeker.prototype = Object.create( google.maps.Marker.prototype );
                        google_maps_Marker_Seeker.prototype.setPlnType = function (pln_type) {this.pln_type = pln_type};
                        var 
                            marker = new google_maps_Marker_Seeker({
                                position: location, 
                                map: scope.gmap.maps[counter],
                                animation: google.maps.Animation.DROP,
                                draggable:true                                
                                //icon: 'http://maps.google.com/mapfiles/kml/paddle/go.png',
                            });
                        // If it's not the first mark, must be the second. (Just two markers allowed)
                        if(scope.gmap.markers.length >= 1 ){
                            marker.setIcon(img_end_rt);
                            marker.setTitle(str_end_rt);
                            marker.setPlnType(strPlnTypeEnd);
                            //If there is already a second marker, it's deleted
                            if(scope.gmap.markers.length > 1){
                                scope.gmap.markers[1].setMap(null);
                                scope.gmap.markers.splice(1);
                            }
                            toastr["info"](msg_marker_added_end);
                        }//If it's the first marker
                        else{
                            marker.setTitle(str_start_rt);
                            marker.setIcon(img_start_rt);
                            marker.setPlnType(strPlnTypeStart);
                            toastr["info"](msg_marker_added_start);
                        }
                        scope.gmap.markers.push(marker);
                        //scope.gmap.markers = markers;
                        console.log(marker);
                    }
                };
                function injectGoogle(callback) {
                    var cbId = prefix + counter;
                    $window[cbId] = gMapInit;
                    var wf = document.createElement('script');
                    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                    '://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' + 'callback=' + cbId;
                    wf.type = 'text/javascript';
                    wf.async = 'true';
                    if(callback)wf.onload=callback;
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(wf, s);
                    wf.onerror = function (message){toastr["error"]("No es posible acceder al elemento "+message.target.src); console.log(this)};
                    return cbId;
                };
            };

            $timeout(function(){directive_function (scope, element, attrs, controller)}, 0);
        };
        var rtrn = {
            restrict: 'E',
            replace: false,
            controller: 'GoMapsController',
            scope: {idmap: '@'},
            templateUrl: 'static/templates/maps/gmap.html',
            transclude: true,
            link: link
        };

        return rtrn;
    }

})();
