app.controller('girisController', ['$scope', '$state', '$http', '$rootScope', 'Session', function($scope, $state, $http, $rootScope, Session){
    $scope.kullanici = {};
    $scope.girisYap = function(){
        var kullanici = $scope.kullanici;
        $http.post(Config.host + '/hesap/mobil_giris', kullanici)
        .success(function(response, status, headers, config) {
            if(!response.state){
                alert('Kullanici bulunamadi.');
                return;
            }
            Session.kullaniciEkle(response.response);
            Session.girisYap();
            $rootScope.kullaniciIsim = Session.data.kullanici.isim;
            $rootScope.kullaniciSoyisim = Session.data.kullanici.soyisim;
            $rootScope.girisYapildi = Session.data.girisYapildi;
            $state.go('menu.anasayfa');
        }).error(function(response, status, headers, config) {               
            alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
        });
    }
    $scope.kayit_ol_git = function (){
        $state.go('kayit_ol');
    }
}]);