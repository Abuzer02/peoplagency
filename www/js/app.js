// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','uiGmapgoogle-maps',"ngCordova"])

.run(function($ionicPlatform, $rootScope, $ionicLoading,myStorage,$window) {
    $rootScope.session=myStorage.getObject("session");
    $rootScope.showLoading = function() {
        $ionicLoading.show({
          template: '<img src="img/loading.gif"/>',
          showBackdrop : true
        });
    };
    $rootScope.hideLoading = function(){
        $ionicLoading.hide();
    };
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.hide();
        }
  });
})

.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider,$httpProvider) {
    uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyDFberVyWaVDCxFLaRxYLxUuSd4uPb_I2s',
    v: '3.17',
    libraries: 'weather,geometry,visualization',
    language: 'en',
    sensor: 'false',
  })
  $stateProvider
  .state('menu', {
    url: "/menu",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller : 'menuController'
  })
  .state('menu.anasayfa', {
    url: "/anasayfa",
    views : {
        menuContent : {
            templateUrl: "templates/anasayfa.html",
            controller : 'anasayfaController'
        }
    }
  })
  .state('menu.bildirim', {
    url: "/bildirim",
    views : {
        menuContent : {
            templateUrl: "templates/bildirim.html",
            controller:"BildirimCtrl"
        }
    }
  })
  .state('menu.profile', {
    url: "/profile",
    views : {
        menuContent : {
            templateUrl: "templates/profile.html",
            controller:"ProfileController"
        }
    }
  })
  .state('menu.ayarlar', {
    url: "/ayarlar",
    views : {
        menuContent : {
            templateUrl: "templates/ayarlar.html",
            controller:"AyarlarController"
        }
    }
  })
  .state('giris', {
    url: "/giris",
    templateUrl: "templates/giris.html",
    controller : 'girisController'
  })
  .state('kayit_ol', {
    url: "/kayit_ol",
    templateUrl: "templates/kayit_ol.html",
    controller : 'kayitController'
  });
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/giris');
});
