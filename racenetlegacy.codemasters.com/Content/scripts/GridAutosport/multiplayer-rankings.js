var multiplayerRankingsApp = angular.module('multiplayerRankingsApp', []);

multiplayerRankingsApp.controller('LeaderboardCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.multiplayerRankingsUrl = $window.multiplayerRankingsUrl;

    $scope.period = "all";
    $scope.group = "all";
    $scope.location = 0;
    $scope.discipline = "unknown";

    $scope.playerEntry = null;

    $scope.entries = [];

    $scope.lastItem = 0;

    $scope.page = 1;
    $scope.pages = 2;

    $scope.$watchCollection('[period, group, location, discipline]', function () {
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
            period: $scope.period,
            group: $scope.group,
            location: $scope.location,
            discipline: $scope.discipline,
            page: page,
            noCache: new Date().getTime()
        };

        $http({
            url: $scope.multiplayerRankingsUrl,
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
                $window.scrollToElement('#leaderboard .entry_' + $scope.lastItem);
            }
        }).error(function (response) {
            $scope.loading = false;
        });
    };
});

$(document).ready(function () {
    $('#filter_period, #filter_group, #filter_location, #filter_discipline').dropkick({
        theme: 'grid_autosport'
    });

    $('.dk_toggle').css('width', '180px');
});