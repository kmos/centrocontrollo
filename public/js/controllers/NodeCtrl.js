angular.module('NodeCtrl', []).controller('NodeController', ["$scope", "$routeParams", "$http", "$location", function($scope, $routeParams, $http, $location) {
  $scope.nodeID = $routeParams.nodeID;
  $scope.sensors = [];
  $scope.measurements = [];

  $http.get("/api/nodes/" + $routeParams.nodeID).success(function(data) {
    $scope.sensors = data.sensors;
    $scope.measurements = data.sensors.map(function(sensor) {
      return sensor.measurements;
    }).reduce(function(prev, cur) {
      return prev.concat(cur);
    }).sort(function(a, b) {
      return a.timestamp < b.timestamp;
    });
  });

  $scope.setSelected = function(sensorID) {
    $location.path("/Sensor/" + $routeParams.nodeID + "/" + sensorID);
  };
}]);
