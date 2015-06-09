app.controller('anasayfaController', ['$scope', '$state', '$http', '$rootScope', "$cordovaGeolocation","myStorage","$ionicModal","$ionicHistory",function($scope, $state, $http, $rootScope, $cordovaGeolocation,myStorage,$ionicModal,$ionicHistory){
    $scope.yuklemeTamamlandi=false;
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
    $rootScope.showLoading();
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        
          $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
              var data={
                  lat:position.coords.latitude,
                  lon:position.coords.longitude,
                  radius:10000
                };
              $http.post(Config.host+"/v1/report/search/area",data).success(function(result){
                    if(result.status==404){     //hata 1
                        $rootScope.hideLoading();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        alert("veriler yüklenirken hata oluştu lütfen konum bilgilerini açıp tekrar deneyiniz!!");
                        return;
                    }
                  if(result.data.length!==0){
                        /*if($scope.itemList.length == result.data.length){
                            $scope.yuklemeTamamlandi = true;
                        }*/
                    for(var i=0;i<result.data.length;i++){
                    
                        users.push(result.data[i].obj.fk_account_id);
                    }
                    $http.post(Config.host+"/v1/account/info/list",{account_id_list:users}).success(function(respAcc){
                        if(respAcc.status==404){ //hata 2
                            $rootScope.hideLoading();
                          // $scope.$broadcast('scroll.infiniteScrollComplete');
                            alert("veriler yüklenirken hata oluştu lütfen internetinizi kontrol ediniz!!");
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
                        
                        $scope.itemList=items;
                        items=[];
                        users=[];
                        var data={fk_account_id : $rootScope.session._id};
                           $http.post(Config.host+"/v1/account/verify/list",data).success(function(result){
                            if(result.status==404){ //hata 3
                                $rootScope.hideLoading();
                              //  $scope.$broadcast('scroll.infiniteScrollComplete');
                                alert("Hata oluştu asa");
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
                                   // $scope.$broadcast('scroll.infiniteScrollComplete');
                                    alert("Hata oluştu asa");
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
                               // $scope.$broadcast('scroll.infiniteScrollComplete');
                            }).error(function(error){ //hata 5
                                $rootScope.hideLoading();
                              //  $scope.$broadcast('scroll.infiniteScrollComplete');
                                alert("hata oluştu 404");
                            });
                        }).error(function(error){ //hata 6
                            $rootScope.hideLoading();
                           // $scope.$broadcast('scroll.infiniteScrollComplete');
                            alert("hata oluştu 404");
                        });
                    }).error(function(err){ //hata 7
                        $rootScope.hideLoading();
                       // $scope.$broadcast('scroll.infiniteScrollComplete');
                        alert("hata oluştu kullanıcı bilgileri alınmadı!!!");
                    });
              }else{
                  $rootScope.hideLoading();
                //  $scope.$broadcast('scroll.infiniteScrollComplete');
                  $scope.yuklemeTamamlandi=true;
              }
              }).error(function(err){ //hata 8
                  $rootScope.hideLoading();
                //  $scope.$broadcast('scroll.infiniteScrollComplete');
                  alert("hata oluştu!!!");
              });
            
            }, function(err) { //hata 9
              $rootScope.hideLoading();
             // $scope.$broadcast('scroll.infiniteScrollComplete');
              alert("Hata!!! lokasyon alınamadı lütfen konum izinlerini düzenleyiniz."+JSON.stringify(err));
            }); 
    
 
    $scope.verify=function(id,index){
        
        var data={
            fk_report_id:id,
            fk_account_id:$rootScope.session._id
        };
       $http.post(Config.host+"/v1/report/verify",data).success(function(result){
            if(result.status!==200){
                alert("servis yanıt vermiyor lütfen daha sonra tekrarlayınız.");
                return;
            }
           $scope.itemList[index].obj.verify_count++;
           $rootScope.session.verify_count++;
           $scope.itemList[index].obj.checkVerify=true;
       }).error(function(error){
        alert("beklenmedik hata!!");
       });
    } 
    $scope.refute=function(id,index){
        
        var data={
            fk_report_id:id,
            fk_account_id:$rootScope.session._id
        };
       $http.post(Config.host+"/v1/report/refute",data).success(function(result){
            if(result.status!==200){
                alert("servis yanıt vermiyor lütfen daha sonra tekrarlayınız.");
                return;
            }
           $scope.itemList[index].obj.refute_count++;
           $rootScope.session.refute_count++;
           $scope.itemList[index].obj.checkRefute=true;
       }).error(function(error){
        alert("beklenmedik hata!!");
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
        alert(index);
        $scope.yorum_modal.show();
        $scope.reportId=id;
        var data={
              fk_report_id:id
            };
          $rootScope.showLoading();
          $http.post(Config.host+"/v1/report/comment/list",data).success(function(result){
                if(result.status!==200){
                    $rootScope.hideLoading();
                    alert("veriler yüklenirken hata oluştu");
                    return;
                }
              if(result.data.length!==0){
                for(var i=0;i<result.data.length;i++){

                    users.push(result.data[i].fk_account_id);
                }
                $http.post(Config.host+"/v1/account/info/list",{account_id_list:users}).success(function(respAcc){
                    if(respAcc.status!==200){
                        $rootScope.hideLoading();
                        alert("veriler yüklenirken hata oluştu lütfen internetinizi kontrol ediniz!!");
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
                    alert("hata oluştu kullanıcı bilgileri alınmadı!!!");
                });
              }
              $rootScope.hideLoading();
          }).error(function(err){
                $rootScope.hideLoading();
                alert("hata oluştu!!!");
          });
    }
    $scope.close_modal=function(){
        $scope.yorum_modal.hide();
        $scope.commentList=[];
    };
    $scope.yorum_yap=function(){
        $scope.yorum.fk_report_id=$scope.reportId;
        $scope.yorum.fk_account_id=$rootScope.session._id;
        $http.post(Config.host+"/v1/report/comment",$scope.yorum).success(function(result){
            if(result.status!==200){
                alert("veriler yüklenirken hata oluştu");
                return;
            }
            alert($scope.reportIndex);
            var elem={text:result.data.comment,accountInfo:$rootScope.session};
            $scope.commentList.push(elem);
            $scope.itemList[$scope.reportIndex].obj.comment_count++;
            $rootScope.session.comment_count++;
            $scope.yorum={fk_report_id:"",fk_account_id:"",comment:""};
        }).error(function(error){
            alert("hata oluştu!!!");
        });
    };
    
    $scope.searchWithText=function(searchText){
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
                        alert("veriler yüklenirken hata oluştu lütfen konum bilgilerini açıp tekrar deneyiniz!!");
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
                            alert("veriler yüklenirken hata oluştu lütfen internetinizi kontrol ediniz!!");
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
                                console.log("here into if");
                            }
                        }
                      }
                        $scope.itemList=items;
                        $rootScope.hideLoading();
                        items=[];
                        users=[];
                    }).error(function(err){
                        $rootScope.hideLoading();
                        alert("hata oluştu kullanıcı bilgileri alınmadı!!!");
                    });
              }else{
                    $rootScope.hideLoading();
                    alert("Hiçbir sonuç bulunamadı.!!!");
              }
        }).error(function(error){
            alert("hata oluştu!!!");
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
