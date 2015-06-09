app.controller("AlanController",function($scope,$rootScope,uiGmapGoogleMapApi){
    $scope.myLocation = {
    lng : '',
    lat: ''
  }
   
  $scope.drawMap = function(position) {
 
    //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
    $scope.$apply(function() {
      $scope.myLocation.lng = position.coords.longitude;
      $scope.myLocation.lat = position.coords.latitude;
 
      $scope.map = {
        center: {
          latitude: $scope.myLocation.lat,
          longitude: $scope.myLocation.lng
        },
        zoom: 16,
        pan: 1
      };
 
      $scope.marker = {
        id: 0,
        coords: {
          latitude: $scope.myLocation.lat,
          longitude: $scope.myLocation.lng
        }
      }; 
       
      $scope.marker.options = {
        draggable: true,
        labelAnchor: "80 120",
        labelClass: "marker-labels"
      };  
    });
      
  }

   $scope.alanaGoreListele=function(){
   alert(JSON.stringify($scope.marker.coords));
   }
  navigator.geolocation.getCurrentPosition($scope.drawMap);

});
function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location, 
        map: map
    });
}