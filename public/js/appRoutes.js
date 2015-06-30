angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'MainController'
  })
  .when('/ControlPanel', {
    templateUrl: 'views/ControlPanel.html',
    controller: 'ControlPanelController'
  })
  .when('/Nodes', {
    templateUrl: 'views/nodes.html',
    controller: 'NodesController'
  })
  .when('/Monitor', {
    templateUrl: 'views/monitor.html',
    controller: 'MonitorController'
  });

  $locationProvider.html5Mode(true);
}]);
