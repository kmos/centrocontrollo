angular.module('ccApp', [
  'ngRoute',
  'ngTable',
  'appRoutes',
  'MainCtrl',
  'ControlPanelCtrl',
  'NodesCtrl',
  'NodesService',
  'MonitorCtrl',
  'AlarmCtrl',
  'NodeCtrl',
  'SensorCtrl',
  'LogoutCtrl',
]).directive('highlightActiveTab', ['$location',
  function($location) {
    return {
      link: function(scope, element, attrs) {
        scope.$on("$routeChangeSuccess", function(event, current, previous) {
          var firstLevelPath = $location.path().split('/')[1];

          angular.forEach(element.children(), function(item) {
            var li = angular.element(item)[0];
            var a = li.children[0];

            var tabLink = a.getAttribute('href').split('/')[1];

            if (firstLevelPath === tabLink ||
                (tabLink === "Nodes" && (firstLevelPath === "Node" || firstLevelPath === "Sensor"))) {
              li.classList.add("active");
            } else {
              li.classList.remove("active");
            }
          })
        });
      }
    };
  }
]);