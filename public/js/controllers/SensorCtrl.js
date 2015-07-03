angular.module('SensorCtrl', []).controller('SensorController', function($scope, $route, $routeParams) {
  $scope.measurements = [];

  alert("/api/rt_measurements/" + $routeParams.nodeID + "/" + $routeParams.sensorID);

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
});

