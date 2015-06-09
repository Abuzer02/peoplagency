app.controller('girisController', ['$scope', '$state', '$http', '$rootScope', 'myStorage',"$window", function($scope, $state, $http, $rootScope, myStorage,$window){
    
    $scope.kullanici = {};
    $scope.item={checked:false};
    
    if(myStorage.get("isActive")===true){
        $scope.item.checked==true;
        $scope.kullanici.email=$rootScope.session.email;
        $scope.kullanici.password=$rootScope.session.password;
    }
   
    $scope.girisYap = function(){
        var kullanici = $scope.kullanici;
        $http.post(Config.host + '/v1/account/login', kullanici)
        .success(function(response) {
            if(response.status==404){
                alert(response.desc);
                return;
            }
            if($scope.item.checked===true){
                myStorage.set("isActive",true);
            }else{
                 myStorage.set("isActive",false);
            }
             myStorage.setObject("session",response.data);
             myStorage.set("cikisYapildi",false);
             $rootScope.session=response.data;
             $scope.kullanici = {};
             $state.go('menu.anasayfa');
        }).error(function(response, status, headers, config) {               
            alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
        });
    }
    $scope.kayit_ol_git = function (){
        $state.go('kayit_ol');
    }
}]);