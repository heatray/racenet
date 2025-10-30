var disciplineChallengeHistoryApp = angular.module('disciplineChallengeHistoryApp', []);

disciplineChallengeHistoryApp.controller('TabCtrl', function ($scope) {
    $scope.filter = "medals";
});

$(document).ready(function () {
    // Panels must initially be disible for this to work
    $('.filters.wide').underline();

    $('.filters.narrow').underline();
});