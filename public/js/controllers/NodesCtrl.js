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
        color: '#666',
      });
    }

    var connectedNodes = nodes.filter(function(node) {
      return node.connected;
    });

    for (var i = 0; i < connectedNodes.length * 2; i++) {
      g.edges.push({
        id: 'e' + i,
        source: connectedNodes[Math.floor(Math.random() * connectedNodes.length)]._id,
        target: connectedNodes[Math.floor(Math.random() * connectedNodes.length)]._id,
        size: Math.random(),
        color: '#ccc',
      });
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
