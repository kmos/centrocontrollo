angular.module('NodesCtrl', []).controller('NodesController', ['$scope', '$location', 'Nodes', function($scope, $location, Nodes) {
  Nodes.get().success(function(data){
    $scope.nodes = data;
  });

  $scope.setSelected = function(nodeID) {
    $location.path("/Node/" + nodeID);
  };

  $scope.createNode = function(){
    if($scope.formData._id != undefined){
      Nodes.create($scope.formData).success(function(data) {
        $scope.formData = {};
        $scope.nodes = data;
      });
    }
  };

  $scope.DeleteNode = function(id){
    Nodes.delete(id).success(function(data){
      $scope.nodes = data;
    });
  };
}]);
