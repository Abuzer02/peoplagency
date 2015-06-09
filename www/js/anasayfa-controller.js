app.controller('anasayfaController', ['$scope', '$state', '$http', '$rootScope', "$cordovaGeolocation","myStorage","$ionicModal","$ionicHistory","$ionicPopup",function($scope, $state, $http, $rootScope, $cordovaGeolocation,myStorage,$ionicModal,$ionicHistory,$ionicPopup){
    $scope.searchText="";
    //$scope.yuklemeTamamlandi=false;
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    var items=[];
    var users=[];
    $scope.itemList=[];
    $scope.commentList=[];
    $scope.yorum={fk_report_id:"",fk_account_id:"",comment:""};
    $scope.reportId="";
    $scope.reportIndex=0;
    $scope.checkVerify=false;
        
    $scope.areaSearch=function(){
        $rootScope.showLoading();
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
              $rootScope.data={
                  lat:position.coords.latitude,
                  lon:position.coords.longitude,
                  radius:20
                };
              $http.post(Config.host+"/v1/report/search/area",$rootScope.data).success(function(result){
                    if(result.status==404){     //hata 1
                        $rootScope.hideLoading();
                         $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                        return;
                    }
                  if(result.data.length!==0){
                    for(var i=0;i<result.data.length;i++){
                    
                        users.push(result.data[i].obj.fk_account_id);
                    }
                    $http.post(Config.host+"/v1/account/info/list",{account_id_list:users}).success(function(respAcc){
                        if(respAcc.status==404){ //hata 2
                            $rootScope.hideLoading();
                             $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                            return;
                        }
                      for(var i=0;i<respAcc.data.length;i++){
                        for(var j=0;j<users.length;j++){
                            if(users[j]===respAcc.data[i]._id){
                                result.data[j].obj.create_time=kisaTarihHesapla(result.data[j].obj.create_time);
                                if(result.data[j].obj.status=="Informed"){
                                    result.data[j].obj.status="Beklemede"
                                }else if(result.data[j].obj.status=="Confirmed"){
                                    result.data[j].obj.status="Onaylandı"
                                }else if(result.data[j].obj.status=="Solved"){
                                    result.data[j].obj.status="Çözüldü"
                                }else if(result.data[j].obj.status=="Rejected"){
                                    result.data[j].obj.status="İptal Edildi"
                                }
                                var elem={obj:result.data[j].obj,dis:result.data[j].dis,accountInfo:respAcc.data[i]};
                                items[j]=elem;
                            }
                        }
                      }
                        $scope.itemList=[];
                        $scope.itemList=items;
                        items=[];
                        users=[];
                        var data={fk_account_id : $rootScope.session._id};
                           $http.post(Config.host+"/v1/account/verify/list",data).success(function(result){
                            if(result.status==404){ //hata 3
                                $rootScope.hideLoading();
                                 $ionicPopup.alert({
                                     title: 'peoplagency',
                                     template: "hata oluştu!!!"
                                   });
                                return;
                             }
                           for(var i=0;i<result.data.length;i++){
                                for(var j=0;j<$scope.itemList.length;j++){
                                  if($scope.itemList[j].obj._id===result.data[i].fk_report_id){
                                    $scope.itemList[j].obj.checkVerify=true;
                                }
                              }
                            }
                            $http.post(Config.host+"/v1/account/refute/list",data).success(function(resultref){
                                if(resultref.status==404){ //hata 4
                                    $rootScope.hideLoading();
                                     $ionicPopup.alert({
                                         title: 'peoplagency',
                                         template: "hata oluştu!!!"
                                       });
                                    return;
                                 }
                               for(var i=0;i<resultref.data.length;i++){
                                    for(var j=0;j<$scope.itemList.length;j++){
                                      if($scope.itemList[j].obj._id===resultref.data[i].fk_report_id){
                                        $scope.itemList[j].obj.checkRefute=true;
                                    }
                                  }
                                }
                                $rootScope.hideLoading();
                            }).error(function(error){ //hata 5
                                $rootScope.hideLoading();
                                 $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                            });
                        }).error(function(error){ //hata 6
                            $rootScope.hideLoading();
                           // $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "Hiçbir sonuç bulunamadı.!!!"
                           });
                        });
                    }).error(function(err){ //hata 7
                        $rootScope.hideLoading();
                        $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu kullanıcı bilgileri alınmadı!!!"
                           });
                    });
              }else{
                  $scope.itemList=[];
                  $rootScope.hideLoading();
                    $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "Hiçbir olay bulunamadı.!!!"
                           });
                  $scope.yuklemeTamamlandi=true;
              }
              }).error(function(err){ //hata 8
                  $rootScope.hideLoading();
                    $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
              });
            
            }, function(err) { //hata 9
              $rootScope.hideLoading();
               $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "Hata!!! lokasyon alınamadı lütfen konum izinlerini düzenleyiniz."+JSON.stringify(err)
                           });
            }); 
    }
    
    $scope.areaSearch();
    $scope.textSearch=function(searchText){
       var searchArr=[];
        searchArr=searchText.split(" ");
        for(var i=0;i<searchArr.length;i++){
            searchArr[i]=searchArr[i].toString();
        }
       var data={search_fields : searchArr};
        $rootScope.showLoading();
        $http.post(Config.host+"/v1/report/search/text",data).success(function(result){
             if(result.status!==200){
                        $rootScope.hideLoading();
                         $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                        return;
                    }
                  if(result.data.length!==0){
                      $scope.itemList=[];
                    for(var i=0;i<result.data.length;i++){
                    
                        users.push(result.data[i].fk_account_id);
                    }
                    $http.post(Config.host+"/v1/account/info/list",{account_id_list:users}).success(function(respAcc){
                        if(respAcc.status!==200){
                            $rootScope.hideLoading();
                             $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                            return;
                        }
                      for(var i=0;i<respAcc.data.length;i++){
                        for(var j=0;j<users.length;j++){
                            if(users[j]===respAcc.data[i]._id){
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
                                var elem={obj:result.data[j],dis:result.data[j].dis,accountInfo:respAcc.data[i]};
                                items[j]=elem;
                            }
                        }
                      }
                        $scope.itemList=[];
                        $scope.itemList=items;
                        $rootScope.hideLoading();
                        items=[];
                        users=[];
                    }).error(function(err){
                        $rootScope.hideLoading();
                         $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                    });
              }else{
                     $scope.itemList=[];
                    $rootScope.hideLoading();
                  $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "Hiçbir sonuç bulunamadı.!!!"
                           });
              }
        }).error(function(error){
             $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
        });
    };
    $scope.verify=function(id,index){
        
        var data={
            fk_report_id:id,
            fk_account_id:$rootScope.session._id
        };
       $http.post(Config.host+"/v1/report/verify",data).success(function(result){
            if(result.status!==200){
                 $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                return;
            }
           $scope.itemList[index].obj.verify_count++;
           $rootScope.session.verify_count++;
           $scope.itemList[index].obj.checkVerify=true;
       }).error(function(error){
         $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
       });
    } 
    $scope.refute=function(id,index){
        
        var data={
            fk_report_id:id,
            fk_account_id:$rootScope.session._id
        };
       $http.post(Config.host+"/v1/report/refute",data).success(function(result){
            if(result.status!==200){
                 $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                return;
            }
           $scope.itemList[index].obj.refute_count++;
           $rootScope.session.refute_count++;
           $scope.itemList[index].obj.checkRefute=true;
       }).error(function(error){
                $ionicPopup.alert({
                     title: 'peoplagency',
                     template: "hata oluştu!!!"
                   });
       });
    }
    $ionicModal.fromTemplateUrl('templates/yorumlarModal.html', function($ionicModal) {
                $scope.yorum_modal = $ionicModal;
            }, 
            {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                animation: 'slide-in-up'
            });
    $scope.comment=function(id,index){
        $scope.reportIndex=index;
        $scope.yorum_modal.show();
        $scope.reportId=id;
        var data={
              fk_report_id:id
            };
          $rootScope.showLoading();
          $http.post(Config.host+"/v1/report/comment/list",data).success(function(result){
                if(result.status!==200){
                    $rootScope.hideLoading();
                     $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                    return;
                }
              if(result.data.length!==0){
                  $scope.itemList[index].obj.comment_count=result.data.length;
                for(var i=0;i<result.data.length;i++){

                    users.push(result.data[i].fk_account_id);
                }
                $http.post(Config.host+"/v1/account/info/list",{account_id_list:users}).success(function(respAcc){
                    if(respAcc.status!==200){
                        $rootScope.hideLoading();
                         $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                        return;
                    }
                  for(var i=0;i<respAcc.data.length;i++){
                    for(var j=0;j<users.length;j++){
                        if(users[j]===respAcc.data[i]._id){
                            var elem={text:result.data[j].comment,accountInfo:respAcc.data[i]};
                            items[j]=elem;
                        }
                    }
                  }
                    $scope.commentList=items;
                    $rootScope.hideLoading();
                    items=[];
                    users=[];
                }).error(function(err){
                    $rootScope.hideLoading();
                     $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                });
              }
              $rootScope.hideLoading();
          }).error(function(err){
                $rootScope.hideLoading();
                 $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
          });
    }
    $scope.close_modal=function(){
        $scope.yorum_modal.hide();
        $scope.alan_modal.hide();
        $scope.commentList=[];
    };
    $scope.yorum_yap=function(){
        $scope.yorum.fk_report_id=$scope.reportId;
        $scope.yorum.fk_account_id=$rootScope.session._id;
        $http.post(Config.host+"/v1/report/comment",$scope.yorum).success(function(result){
            if(result.status!==200){
                 $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                return;
            }
            var elem={text:result.data.comment,accountInfo:$rootScope.session};
            $scope.commentList.push(elem);
            $scope.itemList[$scope.reportIndex].obj.comment_count++;
            $rootScope.session.comment_count++;
            $scope.yorum={fk_report_id:"",fk_account_id:"",comment:""};
        }).error(function(error){
             $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
        });
    };
    
    $scope.searchWithText=function(searchText){
        if(searchText==""){
            $scope.areaSearch();
        }else{
            $scope.textSearch(searchText);
        }
    };
    $ionicModal.fromTemplateUrl('templates/alan.html', function($ionicModal) {
        $scope.alan_modal = $ionicModal;
            }, 
            {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                animation: 'slide-in-up'
            });
    
    $scope.alanaGoreAra=function(){
        $scope.alan_modal.show();
        $scope.myLocation = {
            lng : '',
            lat: ''
          }

          $scope.drawMap = function(position) {

            //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
            $scope.$apply(function() {
              $scope.myLocation.lng = position.coords.longitude;
              $scope.myLocation.lat = position.coords.latitude;

              $scope.map = {
                center: {
                  latitude: $scope.myLocation.lat,
                  longitude: $scope.myLocation.lng
                },
                zoom: 16,
                pan: 1
              };

              $scope.marker = {
                id: 0,
                coords: {
                  latitude: $scope.myLocation.lat,
                  longitude: $scope.myLocation.lng
                }
              }; 

              $scope.marker.options = {
                draggable: true,
                labelAnchor: "80 120",
                labelClass: "marker-labels"
              };  
            });

          }

          navigator.geolocation.getCurrentPosition($scope.drawMap);

    };
    $scope.alanaGoreListele=function(){
           var data={
                  lat:$scope.marker.coords.latitude,
                  lon:$scope.marker.coords.longitude,
                  radius:15.880
                };
            $scope.alan_modal.hide();
            $rootScope.showLoading();
            $http.post(Config.host+"/v1/report/search/area",data).success(function(result){
                if(result.status==404){     //hata 1
                    $rootScope.hideLoading();
                     $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                    return;
                }
              if(result.data.length!==0){
                for(var i=0;i<result.data.length;i++){

                    users.push(result.data[i].obj.fk_account_id);
                }
                $http.post(Config.host+"/v1/account/info/list",{account_id_list:users}).success(function(respAcc){
                    if(respAcc.status==404){ //hata 2
                        $rootScope.hideLoading();
                         $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                        return;
                    }
                  for(var i=0;i<respAcc.data.length;i++){
                    for(var j=0;j<users.length;j++){
                        if(users[j]===respAcc.data[i]._id){
                            result.data[j].obj.create_time=kisaTarihHesapla(result.data[j].obj.create_time);
                            if(result.data[j].obj.status=="Informed"){
                                result.data[j].obj.status="Beklemede"
                            }else if(result.data[j].obj.status=="Confirmed"){
                                result.data[j].obj.status="Onaylandı"
                            }else if(result.data[j].obj.status=="Solved"){
                                result.data[j].obj.status="Çözüldü"
                            }else if(result.data[j].obj.status=="Rejected"){
                                result.data[j].obj.status="İptal Edildi"
                            }
                            var elem={obj:result.data[j].obj,dis:result.data[j].dis,accountInfo:respAcc.data[i]};
                            items[j]=elem;
                        }
                    }
                  }
                    $scope.itemList=[];
                    $scope.itemList=items;
                    items=[];
                    users=[];
                    var data={fk_account_id : $rootScope.session._id};
                       $http.post(Config.host+"/v1/account/verify/list",data).success(function(result){
                        if(result.status==404){ //hata 3
                            $rootScope.hideLoading();
                             $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                            return;
                         }
                       for(var i=0;i<result.data.length;i++){
                            for(var j=0;j<$scope.itemList.length;j++){
                              if($scope.itemList[j].obj._id===result.data[i].fk_report_id){
                                $scope.itemList[j].obj.checkVerify=true;
                            }
                          }
                        }
                        $http.post(Config.host+"/v1/account/refute/list",data).success(function(resultref){
                            if(resultref.status==404){ //hata 4
                                $rootScope.hideLoading();
                                 $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                                return;
                             }
                           for(var i=0;i<resultref.data.length;i++){
                                for(var j=0;j<$scope.itemList.length;j++){
                                  if($scope.itemList[j].obj._id===resultref.data[i].fk_report_id){
                                    $scope.itemList[j].obj.checkRefute=true;
                                }
                              }
                            }
                            $rootScope.hideLoading();
                        }).error(function(error){ //hata 5
                            $rootScope.hideLoading();
                             $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                        });
                    }).error(function(error){ //hata 6
                        $rootScope.hideLoading();
                            $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                    });
                }).error(function(err){ //hata 7
                    $rootScope.hideLoading();
                     $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
                });
          }else{
              $scope.itemList=[];
               $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
              $rootScope.hideLoading();
              $scope.yuklemeTamamlandi=true;
          }
          }).error(function(err){ //hata 8
              $rootScope.hideLoading();
                 $ionicPopup.alert({
                             title: 'peoplagency',
                             template: "hata oluştu!!!"
                           });
          });
    };
}]);
function kisaTarihHesapla(tarih){
    var temp = new Date(tarih);
    var dd = temp.getDate();
    var mm = temp.getMonth()+1; //January is 0!
    var yyyy = temp.getFullYear();
    var hh = temp.getHours();
    var dk = temp.getMinutes();
    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    temp = dd + '.'+ mm + '.' +yyyy + ", " + hh + ":" + dk;
    return temp;
}
