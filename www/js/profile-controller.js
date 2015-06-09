app.controller("ProfileController",function($rootScope,$scope,$http,myStorage){
    $scope.yuklemeTamamlandi=false;
    $scope.items=[];
    $rootScope.showLoading();
    $scope.getNewItem=function(){
    var data={search_fields:[$rootScope.session._id]};
    $http.post(Config.host+"/v1/report/search/text",data).success(function(result){
        if(result.status==404){
            $rootScope.hideLoading();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            alert("hata oluştu 1!!!");
            return;
        }
        if($scope.items.length == result.data.length){
            $scope.yuklemeTamamlandi = true;
        }
        for(var j=0;j<result.data.length;j++){
            result.data[j].create_time=kisaTarihHesapla(result.data[j].create_time);
            if(result.data[j].status=="Informed"){
                result.data[j].status="Beklemede"
            }else if(result.data[j].status=="Confirmed"){
                result.data[j].status="Onaylandı"
            }else if(result.data[j].status=="Solved"){
                result.data[j].status="Çözüldü"
            }else if(result.data[j].status=="Rejected"){
                result.data[j].status="İptal Edildi"
            }
        }
        $scope.items=result.data;
        $rootScope.hideLoading();
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }).error(function(error){
        $rootScope.hideLoading();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        alert("hata oluştu 2!!!");
    });
  }
});