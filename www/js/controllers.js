var app = angular.module('starter.controllers', []);

app.controller('menuController', function($rootScope, $scope, $state, myStorage,$window){
    $rootScope.accountInfo=myStorage.getObject("session");
    $scope.cikis_yap = function (){
        myStorage.set("cikisYapildi",true);
        $rootScope.accountInfo={};
        myStorage.setObject("session",{});
        myStorage.set("isActive",false);
        $state.go('giris');
    } 
});

