var disciplineChallengeApp = angular.module('disciplineChallengeApp', []);

disciplineChallengeApp.controller('TabCtrl', function ($scope, $location) {
    $scope.discipline = "touring";

    var current = $location.path().substring(1);

    if (current != '') {
        $scope.discipline = current;
    }
});

disciplineChallengeApp.controller('LeaderboardCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.discliplineChallengeLeaderboardUrl = $window.discliplineChallengeLeaderboardUrl;

    $scope.eventId = 0;

    $scope.filter = "overall";

    $scope.playerEntry = null;

    $scope.entries = [];

    $scope.lastItem = 0;

    $scope.page = 1;
    $scope.pages = 2;

    $scope.$watch('filter', function () {
        $scope.get();
    });

    $scope.loadMore = function () {
        $scope.get($scope.page + 1);
    };

    $scope.get = function (page) {
        if (typeof page === "undefined") {
            page = 1;
        }

        $scope.loading = true;

        var data = {
            eventId: $scope.eventId,
            filter: $scope.filter,
            page: page,
            noCache: new Date().getTime()
        };

        $http({
            url: $scope.discliplineChallengeLeaderboardUrl,
            method: 'GET',
            params: data
        }).success(function (response) {
            $scope.page = response.Page;
            $scope.pages = response.Pages;

            if ($scope.page == 1) {
                $scope.lastItem = 0;

                if (response.PlayerEntry != null) {
                    $scope.playerEntry = response.PlayerEntry;
                } else {
                    $scope.playerEntry = null;
                }

                $scope.entries = response.Entries;
            } else {
                $scope.lastItem = $scope.entries.length;

                $scope.entries = $scope.entries.concat(response.Entries);
            }

            $scope.loading = false;

            // Scroll to latest
            if ($scope.lastItem > 0) {
                $window.scrollToElement('#leaderboard_' + $scope.eventId + ' .entry_' + $scope.lastItem);
            }
        }).error(function (response) {
            $scope.loading = false;
        });
    };
});

$(document).ready(function () {
    // Panels must initially be visible for this to work
    $('#challenges > .filters').underline();

    $('.challenge.touring .filters.wide').underline();
    $('.challenge.street .filters.wide').underline();
    $('.challenge.drifting .filters.wide').underline();
    $('.challenge.endurance .filters.wide').underline();
    $('.challenge.grandprix .filters.wide').underline();
    $('.challenge.promotional .filters.wide').underline();

    $('.challenge.touring .filters.narrow').underline();
    $('.challenge.street .filters.narrow').underline();
    $('.challenge.drifting .filters.narrow').underline();
    $('.challenge.endurance .filters.narrow').underline();
    $('.challenge.grandprix .filters.narrow').underline();
    $('.challenge.promotional .filters.narrow').underline();

    // Now hide inactive panels
    $('#challenges .challenge').hide();
});