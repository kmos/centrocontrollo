angular.module('NodeCtrl', []).controller('NodeController', ["$scope", "$routeParams", function($scope, $routeParams) {
  $scope.nodeID = $routeParams.nodeID;
  $scope.sensors = [];
}]);
