/**
* GoMaps
* @namespace pooling.maps.directives
*/
(function () {
  'use strict';

angular.module('pooling.maps.directives', [])
.directive('gMap', gMapDirective);


  gMapDirective.$inject = ['$window', '$parse', '$timeout', '$interval', 'GoMapSrv','$rootScope' ];


    function gMapDirective($window,$parse,$timeout,$interval,GoMapSrv, $rootScope) {
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

        var link = function (scope, element, attrs, controller, rootScope) {
            
            //function called in timeout
            function directive_function (scope, element, attrs, controller){
                var model = scope.gmapvals;
                var maps_arr = [];
                if ($window.google && $window.google.maps) {
                    gMapInit();  
                } else {
                    maps_arr.push(injectGoogle());                    
                };
                
                function log(str){toastr["success"](str);}
                function gMapInit() {
                    // Customized map markers Objects to use from the app 
                    appooling.google_maps_Marker_Seeker = pooling_tools.getObjMarkersSeekers();
                    //

                    var i=0;                   
                    var directionsDisplay = new google.maps.DirectionsRenderer({
                        draggable: true
                    }),
                    mapOptions = {
                            center: new google.maps.LatLng(model.Lat, model.Lon),
                            zoom: model.zoom,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                    };//, objMap;
                    scope.gmapvals.markers = [];

                    try{scope.objMap = new google.maps.Map(document.getElementById(attrs.idmap),mapOptions)}
                    catch(err){console.error(err);return false;}
                    // add your fixed business marker
                    directionsDisplay.setMap(scope.objMap);
                    //on click place marker
                    google.maps.event.addListener(scope.objMap, 'click', function(event) {
                       placeMarkerOnUserClick(event.latLng);
                    });
                    //on loaded show message and place initial markers
                    google.maps.event.addListenerOnce(scope.objMap, 'tilesloaded', function(){
                        log("Mapa cargado!");
                        // Propagate the value of google just when loaded completely
                        $rootScope.$broadcast('gmap.ready', google);
                        // if initial seekers markers are setted, place it
                        if(scope.initSeekers){
                            scope.$apply(function () {
                                scope.seekers = scope.initSeekers[0];
                            });
                        }
                    });

                    // Try HTML5 geolocation
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var pos = new google.maps.LatLng(position.coords.latitude,
                                                             position.coords.longitude);
                            scope.objMap.setCenter(pos);
                            scope.$apply(function () {
                                model.fromAddress = pos;
                            });
                        });
                    }
                    // On directions changed
                    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {});

                    counter++;
                };

                /*
                * Add and load asyncly the google maps library before the first script in document.
                * callback = function to be executed on load
                */
                function injectGoogle(callback) {
                    var cbId = prefix + counter;
                    $window[cbId] = gMapInit;
                    var wf = document.createElement('script');
                    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                    '://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' + 'callback=' + cbId;
                    wf.type = 'text/javascript';
                    wf.async = 'true';
                    wf.id = 'gmapsscript';
                    if(callback)wf.onload=callback;
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(wf, s);
                    wf.onerror = function (message){toastr["error"]("No es posible acceder al elemento "+message.target.src); console.log(this)};
                    //injectGoogleCustomObj();
                    return cbId;
                };
                
            };// end  directive_function

            /**
            * place the markers. Just two markers, start rout and end rout.
            **/
            function placeMarkerOnUserClick(location, seeker_id) {
                var 
                    marker = new appooling.google_maps_Marker_Seeker({
                        position: location, 
                        map: scope.objMap,
                        animation: google.maps.Animation.DROP,
                        draggable:true                              
                        //icon: 'http://maps.google.com/mapfiles/kml/paddle/go.png',
                    });
                if(seeker_id) marker.setIdSeeker(seeker_id);
                // If it's not the first mark, must be the second. (Just two markers allowed)
                if(scope.gmapvals.markers.length >= 1 ){
                    marker.setIcon(img_end_rt);
                    marker.setTitle(str_end_rt);
                    marker.setPlnType(strPlnTypeEnd);
                    //If there is already a second marker, it's deleted
                    if(scope.gmapvals.markers.length > 1){
                        scope.gmapvals.markers[1].setMap(null);
                        scope.gmapvals.markers.splice(1);
                    }
                    toastr["info"](msg_marker_added_end);
                }//If it's the first marker
                else{
                    marker.setTitle(str_start_rt);
                    marker.setIcon(img_start_rt);
                    marker.setPlnType(strPlnTypeStart);
                    toastr["info"](msg_marker_added_start);
                }
                scope.gmapvals.markers.push(marker);
                //scope.gmapvals.markers = markers;
                //console.log(marker);
            };

            // Delete all the markers
            function deleteAllMarkers(){
              if(scope.gmapvals.markers && scope.gmapvals.markers.length  > 0){
                  for (var i = 0; i < scope.gmapvals.markers.length; i++) {
                    scope.gmapvals.markers[i].setMap(null);
                  }
                  scope.gmapvals.markers = [];
              }
            };

            // hack to execute the directive function when document loaded 
            $timeout(function(){directive_function (scope, element, attrs, controller)}, 0);

            // when scope.seekers value change, delete the markers and place the markers of the new value of srope.seekers
            scope.$watch(function() { return scope.seekers; }, function(seeker) {
                var i = 0;
                deleteAllMarkers();
                if(seeker && seeker.start_point && seeker.end_point){
                    console.log('in watch');
                    placeMarkerOnUserClick(new google.maps.LatLng(seeker.start_point.coordinates[0], seeker.start_point.coordinates[1]), seeker.id);
                    placeMarkerOnUserClick(new google.maps.LatLng(seeker.end_point.coordinates[0], seeker.end_point.coordinates[1]), seeker.id);
                    console.log(scope.gmapvals.markers);
                }
            });
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
