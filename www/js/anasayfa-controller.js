app.controller('anasayfaController', ['$scope', '$state', '$http', '$rootScope', 'Session',"$cordovaGeolocation","myStorage","$ionicModal",function($scope, $state, $http, $rootScope, Session,$cordovaGeolocation,myStorage,$ionicModal){
    var reports=[];
    var comments=[];
    var user=[];
    var usersComment=[];
    var account_id=myStorage.getObject("session")._id;
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
              var data={
                  lat:38.36,
                  lon:27.203,
                  radius:2000
                };
              $http.post(Config.host+"/v1/report/search/area",data).success(function(result){
                    if(result.status!==200){
                        alert("veriler yüklenirken hata oluştu lütfen konum bilgilerini açıp tekrar deneyiniz!!");
                        return;
                    }
                    for(var i=0;i<result.data.length;i++){
                    
                        user.push(result.data[i].obj.fk_account_id);
                    }
                    $http.post(Config.host+"/v1/account/info/list",{account_id_list:user}).success(function(respAcc){
                        if(respAcc.status!==200){
                            alert("veriler yüklenirken hata oluştu lütfen internetinizi kontrol ediniz!!");
                            return;
                        }
                      for(var i=0;i<respAcc.data.length;i++){
                        for(var j=0;j<user.length;j++){
                            if(user[j]===respAcc.data[i]._id){
                                var elem={obj:result.data[j].obj,dis:result.data[j].dis,accountInfo:respAcc.data[i]};
                                reports[j]=elem;
                                console.log("here into if");
                            }
                        }
                      }
                        $scope.itemList=reports;
                    }).error(function(err){
                        alert("hata oluştu kullanıcı bilgileri alınmadı!!!");
                    });
                  
              }).error(function(err){
                    alert("hata oluştu!!!");
              });
              
            }, function(err) {
              alert("Hata!!! lokasyon alınamadı lütfen konum izinlerini düzenleyiniz.");
            }); 
    
    $scope.verify=function(id){
        var verifyCount=document.getElementById("verifyCount"+id).text;
        var data={
            fk_report_id:id,
            fk_account_id:account_id
        };
       $http.post(Config.host+"/v1/report/verify",data).success(function(result){
            if(result.status!==200){
                alert("servis yanıt vermiyor lütfen daha sonra tekrarlayınız.");
                return;
            }
           verifyCount++;
           document.getElementById("verifyCount"+id).text=verifyCount;
       }).error(function(error){
        alert("beklenmedik hata!!");
       });
    } 
    $scope.refute=function(id){
        var refuteCount=document.getElementById("refuteCount"+id).text;
        var data={
            fk_report_id:id,
            fk_account_id:account_id
        };
       $http.post(Config.host+"/v1/report/refute",data).success(function(result){
            if(result.status!==200){
                alert("servis yanıt vermiyor lütfen daha sonra tekrarlayınız.");
                return;
            }
           refuteCount++;
           document.getElementById("refuteCount"+id).text=refuteCount;
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
    $scope.comment=function(id){
        $scope.yorum_modal.show();
        var data={
              fk_report_id:id
            };
          $http.post(Config.host+"/v1/report/comment/list",data).success(function(result){
                if(result.status!==200){
                    alert("veriler yüklenirken hata oluştu");
                    return;
                }
                for(var i=0;i<result.data.length;i++){

                    usersComment.push(result.data[i].fk_account_id);
                }
                $http.post(Config.host+"/v1/account/info/list",{account_id_list:usersComment}).success(function(respAcc){
                    if(respAcc.status!==200){
                        alert("veriler yüklenirken hata oluştu lütfen internetinizi kontrol ediniz!!");
                        return;
                    }
                  for(var i=0;i<respAcc.data.length;i++){
                    for(var j=0;j<usersComment.length;j++){
                        if(user[j]===respAcc.data[i]._id){
                            var elem={text:result.data[j].comment,accountInfo:respAcc.data[i]};
                            comments[j]=elem;
                        }
                    }
                  }
                    $scope.commentList=comments;
                }).error(function(err){
                    alert("hata oluştu kullanıcı bilgileri alınmadı!!!");
                });

          }).error(function(err){
                alert("hata oluştu!!!");
          });
    }
}]);