angular.module('LogoutService', []).factory('Logout', ['$http', function($http) {
  return {
    get: function() {
      return $http.get('/api/logout');
    }
  }
}]);

