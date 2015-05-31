var app = angular.module('starter.controllers', []);

app.controller('menuController', function($rootScope, $scope, $state, Session){
    $scope.cikis_yap = function (){
        $rootScope.kullaniciIsim = null;
        $rootScope.kullaniciSoyisim = null;
        $rootScope.girisYapildi = false;
        Session.cikisYap();
        $state.go('giris')
    } 
});

