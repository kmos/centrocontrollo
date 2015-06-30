angular.module('NodesService', []).factory('Nodes', ['$http', function($http) {
  return {
    get: function() {
      return $http.get('/api/nodes');
    },

    create: function(nodeData) {
      return $http.post('/api/nodes', nodeData);
    },

    delete: function(id) {
      return $http.delete('/api/nodes/' + id);
    }
  }
}]);
