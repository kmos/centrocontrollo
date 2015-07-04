angular.module('NodesCtrl', []).controller('NodesController', ['$scope', '$location', 'Nodes', function($scope, $location, Nodes) {
  $scope.show=true;
  $scope.insert=false;
  Nodes.get().success(function(data){
    $scope.nodes = data;
    $scope.loading = false;
  });

  $scope.setSelected = function(nodeID) {
    $location.path("/Node/" + nodeID);
  };

  $scope.createNode = function(){
    if($scope.formData._id != undefined){
      $scope.loading = true;
      Nodes.create($scope.formData)
        .success(function(data){
          $scope.loading = false;
          $scope.formData = {};
          $scope.nodes = data;
        });
    }
  };

  $scope.DeleteNode = function(id){
    $scope.loading = true;
    Nodes.delete(id)
      .success(function(data){
        $scope.loading=false;
        $scope.nodes = data;
      });
  };
}]);
