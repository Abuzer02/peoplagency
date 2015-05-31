app
 .controller('BildirimCtrl', function($scope, Camera,Session,$http) {
    
  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      $scope.imageUrl=imageURI;
    }, function(err) {
      console.err(err);
    });
  };
  
  $scope.sendData=function(){
        var myImg = $scope.imageUrl;
        var options = {};
        options.fileKey="pics";
        options.chunkedMode = false;
        console.log(JSON.stringify(Session));
        var params = new FileUploadOptions();
        params._id = Session.data.kullanici._id;
        params.apiKey = Session.data.kullanici.apiKey;
        options.params = params;

    var ft = new FileTransfer();
    ft.upload(myImg, encodeURI("http://178.62.134.23:7000/yukleme/resim_yukle"), onUploadSuccess, onUploadFail, options);
  };
  var onUploadSuccess=function(imagePath){
        var item={
            icerik:$scope.icerik,
            kategori:$scope.kategori,
            sahipId:Session.data.kullanici._id,
            fotografListesi:{adi:"",lokasyon:imagePath.lokasyon},
            apiKey : Session.data.kullanici.apiKey
        };
      $http.post("http://178.62.134.23:7000/bildirim/ekle",item).success(function(response){
        console.log(JSON.stringify(response));
      }).error(function(err){
        console.error(err);
      });
  };
    var onUploadFail=function(){};
});