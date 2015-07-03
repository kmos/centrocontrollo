angular.module('SensorCtrl', []).controller('SensorController', ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
  $scope.measurements = [];

  var measurementEvents = new EventSource("/api/rt_measurements/" + $routeParams.nodeID + "/" + $routeParams.sensorID);

  measurementEvents.addEventListener("measurement", function(event) {
    var measurement = JSON.parse(event.data);
    if ($scope.measurements.length >= 10) {
      $scope.measurements.pop();
    }

    $scope.measurements.unshift({
      timestamp: measurement.timestamp,
      value: measurement.value,
    });

    $scope.$apply();
  });

  $scope.launchMeasurement = function() {
    $http.get("/api/rt_measurements/launch/" + $routeParams.nodeID + "/" + $routeParams.sensorID)
  };
}]);
