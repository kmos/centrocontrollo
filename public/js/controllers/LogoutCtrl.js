// public/js/controllers/LogoutCtrl.js

angular.module('LogoutCtrl', []).controller('LogoutController', function($scope,$window) {

  $scope.tagline = 'Bye Bye';
  $window.location.href = '/api/logout';
});

