// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/ControlPanel', {
            templateUrl: 'views/ControlPanel.html',
            controller: 'ControlPanelController'
        });

    $locationProvider.html5Mode(true);

}]);

