app.controller('girisController', ['$scope', '$state', '$http', '$rootScope', 'myStorage', function($scope, $state, $http, $rootScope, myStorage){
    $scope.kullanici = {};
    $scope.girisYap = function(){
        var kullanici = $scope.kullanici;
        $http.post(Config.host + '/v1/account/login', kullanici)
        .success(function(response, status, headers, config) {
             myStorage.setObject("session",response.data);
             myStorage.set("isActive",true);
             $state.go('menu.anasayfa');
        }).error(function(response, status, headers, config) {               
            alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
        });
    }
    $scope.kayit_ol_git = function (){
        $state.go('kayit_ol');
    }
}]);