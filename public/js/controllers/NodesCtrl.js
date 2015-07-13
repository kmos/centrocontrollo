angular.module('NodesCtrl', []).controller('NodesController', ['$scope', '$location', 'Nodes', function($scope, $location, Nodes) {
  Nodes.get().success(function(nodes) {
    $scope.nodes = nodes;

    var g = {
      nodes: [],
      edges: []
    };

    for (var i = 0; i < nodes.length; i++) {
      g.nodes.push({
        id: nodes[i]._id,
        label: nodes[i].address,
        x: Math.random(),
        y: Math.random(),
        size: 3,
        color: nodes[i].connected ? "#00FF00" : "#666",
      });
    }

    var connectedNodes = nodes.filter(function(node) {
      return node.connected;
    });

    for (var i = 0; i < connectedNodes.length; i++) {
      for (var j = 0; j < connectedNodes.length; j++) {
        if (i == j) {
          continue;
        }

        g.edges.push({
          id: 'e' + i + j,
          source: connectedNodes[i]._id,
          target: connectedNodes[j]._id,
          size: Math.random(),
          color: '#ccc',
        });
      }
    }

    var s = new sigma({
      graph: g,
      container: 'sigma-container',
    });

    s.bind('clickNode', function(e) {
      $location.path("/Node/" + e.data.node.id);
      $scope.$apply();
    });
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
