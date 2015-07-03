angular.module('NodeCtrl', []).controller('NodeController', ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
  $scope.nodeID = $routeParams.nodeID;
  $scope.sensors = [];

  $http.get("/api/nodes/" + $routeParams.nodeID).success(function(data) {
    $scope.sensors = data.sensors;
  });
}]);
