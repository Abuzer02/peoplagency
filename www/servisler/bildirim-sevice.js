app.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, {
        quality : 50,
        targetWidth: 1024,
        targetHeight: 1024,
      });

      return q.promise;
    }
  }
}]);