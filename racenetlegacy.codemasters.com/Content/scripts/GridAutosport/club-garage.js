var clubGarageApp = angular.module('clubGarageApp', []);

clubGarageApp.controller('ClubGarageCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.teamId = $window.teamId;
    $scope.clubGarageUrl = $window.clubGarageUrl;

    $scope.vehicles = [];

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
            page: page,
            noCache: new Date().getTime()
        };

        $http({
            url: $scope.clubGarageUrl,
            method: 'GET',
            params: data
        }).success(function (response) {
            $scope.page = response.Page;
            $scope.pages = response.Pages;

            if ($scope.page == 1) {
                $scope.lastItem = 0;

                $scope.vehicles = response.Vehicles;
            } else {
                $scope.lastItem = $scope.vehicles.length;

                $scope.vehicles = $scope.vehicles.concat(response.Vehicles);
            }

            $scope.loading = false;

            // Scroll to latest
            if ($scope.lastItem > 0) {
                $window.scrollToElement('.vehicle_' + $scope.lastItem);
            }
        }).error(function (response) {
            $scope.loading = false;
        });
    };

    $scope.get();
});