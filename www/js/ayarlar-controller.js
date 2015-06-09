app.controller("AyarlarController",function($rootScope,$scope,myStorage,$http,$ionicPlatform,Camera,$cordovaFileTransfer){
    
    $scope.fotografYukle = function() {
            Camera.getPicture().then(function(imageURI) {
                $rootScope.showLoading();
                var date = new Date();
                var options = {};
                options.fileKey = "upload";
                options.fileName = date + "foto.png";
                options.chunkedMode = false;
                options.mimeType = "image/png";
                $ionicPlatform.ready(function() {
                  $cordovaFileTransfer.upload(Config.host + "/v1/files/upload", encodeURI(imageURI), options)
                    .then(function(result) {
                        var resp = JSON.parse(result.response);
                        alert(JSON.stringify(resp.data));
                        $rootScope.session.profile_picture = resp.data;
                        $rootScope.hideLoading();
                    }, function(error) {
                      $rootScope.hideLoading();
                    });

            }, false); 
            }, function(err) {
                console.err(err);
            });
        };
    
    $scope.updateAccount=function(){ 
        $http.post(Config.host+"/v1/account/update",$rootScope.session).success(function(result){
            if(result.status==404){
                alert("hata oluştu 404");
                return;
            }
            alert(JSON.stringify(result.data));
            myStorage.setObject("session",result.data);
        }).error(function(error){
            alert("hata oluştu 500");
        });
    };
});