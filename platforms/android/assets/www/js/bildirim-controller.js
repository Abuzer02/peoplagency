app
    .controller('BildirimCtrl', function($scope,$state,Camera, Session, $http, $ionicPlatform, $cordovaFileTransfer,$cordovaGeolocation) {
        $scope.uploadedUrl = "";
        $scope.coords={latitude :"",longitude:""};
         $scope.data={
            baslik:"",icerik:"",fotografListesi:{ad:"resim",lokasyon:""},kategori:"",onemDerecesi:""
        };
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
              $scope.coords={ latitude  : position.coords.latitude , longitude:position.coords.longitude};
            }, function(err) {
              alert("Hata!!! lokasyon alınamadı lütfen konum izinlerini düzenleyiniz.");
            });        
        $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                $scope.imageUrl = imageURI;
            }, function(err) {
                console.err(err);
            });
        };

        $scope.sendData = function() {

            var myImg = $scope.imageUrl;
            var date = new Date();
            
            var options = {};
            options.fileKey = "resim";
            options.fileName = date + "foto.png";
            options.chunkedMode = false;
            options.mimeType = "image/png";

            $ionicPlatform.ready(function() {
                $cordovaFileTransfer.upload(Config.host + "/yukleme/resim_yukle", encodeURI(myImg), options)
                    .then(function(result) {

                        var resp = JSON.parse(result.response);
                        $scope.uploadedUrl = resp.fotografListesi;
                       
                         $scope.data = {
                            baslik: $scope.data.baslik,
                            icerik: $scope.data.icerik,
                            picUrl: $scope.uploadedUrl,
                            kategori: $scope.data.kategori,
                            oncelik: $scope.data.onemDerecesi,
                            coords:$scope.coords
                    };
                    $http.post(Config.host+"/bildirim/ekle",$scope.data).success(function(result){
                        alert(JSON.stringify(result));
                        $state.transitionTo("menu.anasayfa");
                    }).error(function(err){
                        alert(err);
                    });
                    }, function(error) {

                    });

            }, false);

        };
    });