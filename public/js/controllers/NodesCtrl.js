angular.module('NodesCtrl', []).controller('NodesController', function($scope) {
  $scope.nodes = [
    { id: 0, address: '127.0.0.1', connected: 'Yes', },
    { id: 1, address: '127.0.0.2', connected: 'No', },
  ];
});

