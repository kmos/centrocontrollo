angular.module('AlarmCtrl', []).controller('AlarmController', function($scope) {
  var alarmEvents = new EventSource("/api/alarms");

  alarmEvents.addEventListener("alarm", function(event) {
    var alarm = JSON.parse(event.data);

    $scope.alert = true;
    $scope.alarmURL = "/Node/" + alarm.nodeId;
    $scope.alarmContent = "ATTENZIONE: Ricevuto un allarme!";

    $scope.$apply();
  });
});

