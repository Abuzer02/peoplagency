app
 .controller('BildirimCtrl', function($scope, Camera) {
  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      $scope.imageUrl=imageURI;
    }, function(err) {
      console.err(err);
    });
  };
});