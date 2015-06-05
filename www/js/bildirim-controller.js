app
    .controller('BildirimCtrl', function($rootScope,$scope,$state,Camera, Session, $http, $ionicPlatform, $cordovaFileTransfer,$cordovaGeolocation,$ionicModal,myStorage) {
        var id=myStorage.getObject("session")._id;
        var category=[];
        $scope.data={
            title:"",
            description:"",
            address:"",
            lat:"",
            lon:"",
            picture_path:"",
            importance_level:"",
            extra_information:"",
            alert_tags:[],
            fk_account_id:id
        };
        
        $scope.kategori_sec=function(){
            $scope.kategori_modal.show();
        }
        $ionicModal.fromTemplateUrl('templates/kategoriModal.html', function($ionicModal) {
                $scope.kategori_modal = $ionicModal;
            }, 
            {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                animation: 'slide-in-up'
            });
        $scope.itemList = [
            { text: "polis", checked: false },
            { text: "hastane", checked: false },
            { text: "itfaye", checked: false },
            { text: "belediye", checked: false },
            { text: "çoçuk esirgeme kurumu", checked: false }
          ];
        $scope.kategoriAl=function(){
            category=[];
            for(var i=0;i<$scope.itemList.length;i++){
                if($scope.itemList[i].checked===true){
                  category.push($scope.itemList[i].text);   
                }
            }
            $scope.data.alert_tags=category;
            $scope.kategori_modal.hide();
        }
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
              $scope.data.lat=position.coords.latitude;
              $scope.data.lon=position.coords.longitude;
              $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.data.lat+","+$scope.data.lon+"&sensor=true").success(function(result){
                $scope.data.address=result.results[0].formatted_address;
              }).error(function(err){
              
              });
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
            $rootScope.showLoading();
            var myImg = $scope.imageUrl;
            var date = new Date();
            
            var options = {};
            options.fileKey = "upload";
            options.fileName = date + "foto.png";
            options.chunkedMode = false;
            options.mimeType = "image/png";

            $ionicPlatform.ready(function() {
                $cordovaFileTransfer.upload(Config.host + "/v1/files/upload", encodeURI(myImg), options)
                    .then(function(result) {

                        var resp = JSON.parse(result.response);
                        $scope.data.picture_path = resp.data;
                       
                    $http.post(Config.host+"/v1/report/register",$scope.data).success(function(result){
                        alert(JSON.stringify($scope.data));
                        $rootScope.hideLoading();
                        $state.transitionTo("menu.anasayfa");
                    }).error(function(err){
                        alert(err);
                    });
                    }, function(error) {

                    });

            }, false);

        };
    });