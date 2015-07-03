angular.module('SensorCtrl', []).controller('SensorController', function($scope) {
  $scope.measurements = [];

  /*var measurementEvents = new EventSource("/api/rt_measurements");

  measurementEvents.addEventListener("measurement", function(event) {
    var measurement = JSON.parse(event.data);
    if ($scope.measurements.length >= 10) {
      $scope.measurements.pop();
    }

    $scope.measurements.unshift({
      nodeID: measurement.nodeId,
      sensorID: measurement.sensorId,
      timestamp: measurement.timestamp,
      value: measurement.value,
    });

    $scope.$apply();
  });*/
});

