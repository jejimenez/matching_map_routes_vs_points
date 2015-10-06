/**
* GoMaps
* @namespace pooling.maps.directives
*/
(function () {
  'use strict';

angular.module('pooling.maps.directives', [])
.directive('gMap', gMapDirective);


  gMapDirective.$inject = ['$window', '$parse', '$timeout', '$interval' ];


    function gMapDirective($window,$parse,$timeout,$interval) {
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

        //googleobj = new google;
        
        var link = function (scope, element, attrs, controller) {
            
            //function called in timeout
            function directive_function (scope, element, attrs, controller){
                //scope.$watch(attrs.gMap, function() {});
                var model = scope.gmapvals;
                var maps_arr = [];
                if ($window.google && $window.google.maps) {
                    gMapInit();  
                } else {
                    maps_arr.push(injectGoogle());
                };
                
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
                        };//, objMap;
                    scope.gmapvals.markers = [];
                    //scope.gmapvals.markers = [];
                    //scope.gmapvals.maps;// = [];
                    try{scope.objMap = new google.maps.Map(document.getElementById(attrs.idmap),mapOptions)}
                    catch(err){console.error(err);return false;}
                    // add your fixed business marker
                    directionsDisplay.setMap(scope.objMap);
                    google.maps.event.addListener(scope.objMap, 'click', function(event) {
                       placeMarker(event.latLng);
                    });
                    google.maps.event.addListenerOnce(scope.objMap, 'tilesloaded', function(){
                        log("Mapa cargado!");
                        if(scope.initSeekers){
                            console.log("seeeekkeers2"+scope.initSeekers[0].start_lat+"::"+scope.initSeekers[0].start_lng);
                            placeMarker(new google.maps.LatLng(scope.initSeekers[0].start_lat,
                                                             scope.initSeekers[0].start_lng));
                            console.log("seeeekkeers1"+scope.initSeekers[0].end_lat+"::"+scope.initSeekers[0].end_lnt);
                            placeMarker(new google.maps.LatLng(scope.initSeekers[0].end_lat,
                                                             scope.initSeekers[0].end_lnt));
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
                    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {});

                    counter++;
                };

                function ola(){alert('ok ok');}
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
                                map: scope.objMap,
                                animation: google.maps.Animation.DROP,
                                draggable:true                                
                                //icon: 'http://maps.google.com/mapfiles/kml/paddle/go.png',
                            });
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

            $timeout(function(){directive_function (scope, element, attrs, controller)}, 0);

            scope.$watch(function() { return scope.seekers; }, function(value) {
                var i = 0;
                if(value){
                    console.log('in watch');
                    console.log(value);
                    placeMarker({lat: value.end_lat, lng: value.end_lnt});//scope.objMap
                    //(new directive_function(scope, element, attrs, controller)).placeMarker({lat: value.end_lat, lng: value.end_lnt});//scope.objMap
                    //}
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
