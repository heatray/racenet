var clubApp = angular.module('clubApp', ['ngAnimate']);

clubApp.controller('ClubLeaderboardCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.teamId = $window.teamId;
    $scope.entries = [];

    $scope.lastItem = 0;

    $scope.page = 1;
    $scope.pages = 1;

    $scope.loadMore = function () {
        $scope.get($scope.page + 1);
    };

    $scope.get = function (page) {
        if (typeof page === "undefined") {
            page = 1;
        }

        $scope.loading = true;

        var data = {
            teamId: $scope.teamId,
            page: page
        };

        $http({
            url: $window.clubLeaderboardUrl,
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
                $window.scrollToElement('.club_leaderboard_entry.entry_' + $scope.lastItem);
            }
        }).error(function (response) {
            $scope.loading = false;
        });
    };

    $scope.get();
});

clubApp.controller('ClubActivityCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.teamId = $window.teamId;
    $scope.activities = [];

    $scope.lastItem = 0;

    $scope.page = 1;
    $scope.pages = 1;

    $scope.loadMore = function () {
        $scope.get($scope.page + 1);
    };

    $scope.get = function (page) {
        if (typeof page === "undefined") {
            page = 1;
        }

        $scope.loading = true;

        var data = {
            teamId: $scope.teamId,
            page: page
        };

        $http({
            url: $window.latestActivityUrl,
            method: 'GET',
            params: data
        }).success(function (response) {
            $scope.page = response.Page;
            $scope.pages = response.Pages;

            if ($scope.page == 1) {
                $scope.lastItem = 0;

                $scope.activities = response.Activities;
            } else {
                $scope.lastItem = $scope.activities.length;

                $scope.activities = $scope.activities.concat(response.Activities);
            }

            $scope.loading = false;

            // Scroll to latest
            if ($scope.lastItem > 0) {
                $window.scrollToElement('.latest_activity_entry.entry_' + $scope.lastItem);
            }
        }).error(function (response) {
            $scope.loading = false;
        });
    };

    $scope.get();
});

$(document).ready(function () {
    // Doughnut chart
    options = {
        animation: false,
        segmentShowStroke: false,
        percentageInnerCutout: 98,
        onAnimationComplete: function () {
            var canvas = document.getElementById("doughnut1");

            $chart = $('#doughnut1');
            $parent = $chart.parent();

            $('<img/>').attr({ src: canvas.toDataURL("image/png"), width: 285, height: 285 }).appendTo($parent);
            $chart.remove();
        }
    };

    var data = [
        {
            value: clubWins,
            color: "#fd0001"
        },
        {
            value: clubPodiums,
            color: "#ffffff"
        },
        {
            value: clubOther,
            color: "#545655"
        }
    ];

    $(window).on('preloaderGone', function () {
        var doughnut = document.getElementById('doughnut1');

        if (doughnut != null) {
            var ctx = doughnut.getContext("2d");

            new Chart(ctx).Doughnut(data, options);
        }
    });

    chartClubRanking();
});