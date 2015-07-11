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
    
    $scope.loading=false;
    $scope.$apply();
  });

  $scope.launchMeasurement = function() {
    $scope.loading=true;
    $http.get("/api/rt_measurements/launch/" + $routeParams.nodeID + "/" + $routeParams.sensorID).success(function(){
    });
  };

  $scope.edit = function(){
    $http.put("/api/sensor/" + $routeParams.nodeID +"/" + $routeParams.sensorID, $scope.formData).success(function(){
    });
  };

}]);
