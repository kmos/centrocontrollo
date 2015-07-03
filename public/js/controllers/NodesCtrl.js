angular.module('NodesCtrl', []).controller('NodesController', ['$scope', '$http','Nodes', function($scope,$http, Nodes) {
  //$scope.nodes = [
  //  { ID: 0, address: '127.0.0.1', connected: 'Yes', },
  //  { ID: 1, address: '127.0.0.2', connected: 'No', },
  //];
  Nodes.get()
    .success(function(data){
      $scope.nodes = data;
      $scope.loading = false;
    });
  
  $scope.createNode = function(){
    if($scope.formData.text != undefined){
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

