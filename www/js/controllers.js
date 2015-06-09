var app = angular.module('starter.controllers', []);

app.controller('menuController', function($rootScope, $scope, $state, myStorage,$window,$timeout){
    $rootScope.accountInfo=myStorage.getObject("session");
    $scope.cikis_yap = function (){
        
        $rootScope.accountInfo={};
        myStorage.setObject("session",{});
        myStorage.set("isActive",false);
        myStorage.set("cikisYapildi",true);
        
         $state.go('giris');
        $timeout(function(){
            $window.location.reload();
       },100);
        
        
    } 
});

