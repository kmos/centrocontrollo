angular.module('NodesCtrl', []).controller('NodesController', function($scope) {
  $scope.nodes = [
    { ID: 0, address: '127.0.0.1', connected: 'Yes', },
    { ID: 1, address: '127.0.0.2', connected: 'No', },
  ];
});

