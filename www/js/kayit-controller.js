app.controller('kayitController', ['$rootScope', '$scope', '$state', '$http', 'Session', function($rootScope, $scope, $state, $http, Session){
    $scope.kullanici = {};
    $scope.kayit_ol = function (){
        var yeniKullanici = $scope.kullanici;
        $http.post(Config.host + '/hesap/mobil_kayit', yeniKullanici)
        .success(function(response, status, headers, config) {
            if(!response.state){
                alert('Veritabani hatasi.');
                return;
            }
            Session.kullaniciEkle(response.response);
            Session.girisYap();
            $rootScope.kullaniciIsim = Session.data.kullanici.isim;
            $rootScope.kullaniciSoyisim = Session.data.kullanici.soyisim;
            $state.go('menu.anasayfa');
        }).error(function(response, status, headers, config) {               
            alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
        });
    }
    $scope.giris_yap_don = function (){
        $state.go('giris');
    }
}]);