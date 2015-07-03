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
  })
  .when('/Sensor/:nodeID/:sensorID', {
    templateUrl: 'views/sensor.html',
    controller: 'SensorController'
  })
  .when('/logout', {
    templateUrl: 'views/logout.html',
    controller: 'LogoutController'
  });
  $locationProvider.html5Mode(true);
}]);
