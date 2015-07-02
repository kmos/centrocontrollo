angular.module('MonitorCtrl', []).controller('MonitorController', function($scope) {
  $scope.measurements = [
    { ID: 0, type: '°C', value: '777', },
    { ID: 1, type: 'Pa', value: '1', },
  ];

  var measurementEvents = new EventSource("/api/rt_measurements");

  measurementEvents.addEventListener("measurement", function(event) {
    var measurement = JSON.parse(event.data);
    console.log(event.data);
  });
});

