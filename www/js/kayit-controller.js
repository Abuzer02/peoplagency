app.controller('kayitController', ['myStorage', '$scope', '$state', '$http', 'Session', function(myStorage, $scope, $state, $http, Session){
    $scope.kullanici = {};
    $scope.kayit_ol = function (){
        alert(Config.host);
        $scope.kullanici.profile_picture="abc";
        var yeniKullanici = $scope.kullanici;
        $http.post(Config.host + '/v1/account/register', yeniKullanici)
        .success(function(response, status, headers, config) {
            if(response.status==200){
                myStorage.setObject("session",response.data);
                myStorage.set("isActive",true);
                $state.go('menu.anasayfa');
            }else if(response.status==302){
                alert("zaten Üyesiniz.");
                $state.go("menu.anasayfa");
            }
            
        }).error(function(response, status, headers, config) {               
            alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
        });
    }
    $scope.giris_yap_don = function (){
        $state.go('giris');
    }
}]);