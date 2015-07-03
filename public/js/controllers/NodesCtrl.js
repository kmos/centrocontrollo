angular.module('NodesCtrl', []).controller('NodesController', ['$scope', 'Nodes', function($scope, Nodes) {
  Nodes.get().success(function(data){
    $scope.nodes = data;
    $scope.loading = false;
  });
}]);

