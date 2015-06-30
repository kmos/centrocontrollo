angular.module('MonitorCtrl', []).controller('MonitorController', function($scope) {
  $scope.measurements = [
    { ID: 0, type: '°C', value: '777', },
    { ID: 1, type: 'Pa', value: '1', },
  ];
});

