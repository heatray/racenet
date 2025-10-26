var clubRankingsApp = angular.module('clubRankingsApp', []);

clubRankingsApp.controller('LeaderboardCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.clubRankingsUrl = $window.clubRankingsUrl;

    $scope.period = "all";
    $scope.language = "all";
    $scope.discipline = "unknown";

    $scope.entries = [];

    $scope.lastItem = 0;

    $scope.page = 1;
    $scope.pages = 2;

    $scope.$watchCollection('[period, language, discipline]', function () {
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
            language: $scope.language,
            discipline: $scope.discipline,
            page: page,
            noCache: new Date().getTime()
        };

        $http({
            url: $scope.clubRankingsUrl,
            method: 'GET',
            params: data
        }).success(function (response) {
            $scope.page = response.Page;
            $scope.pages = response.Pages;

            if ($scope.page == 1) {
                $scope.lastItem = 0;

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
    $('#filter_period, #filter_language, #filter_discipline').dropkick({
        theme: 'grid_autosport'
    });

    $('.dk_toggle').css('width', '180px');
});