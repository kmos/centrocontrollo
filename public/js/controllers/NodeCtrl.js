angular.module('NodeCtrl', []).controller('NodeController', ["$scope", "$routeParams", "$http", "$location", function($scope, $routeParams, $http, $location) {
  $scope.nodeID = $routeParams.nodeID;
  $scope.sensors = [];

  $http.get("/api/nodes/" + $routeParams.nodeID).success(function(data) {
    $scope.sensors = data.sensors;
  });

  $scope.setSelected = function(sensorID) {
    $location.path("/Sensor/" + $routeParams.nodeID + "/" + sensorID);
  };
}]);
