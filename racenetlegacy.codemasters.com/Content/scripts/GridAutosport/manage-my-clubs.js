var manageMyClubsApp = angular.module('manageMyClubsApp', ['ngAnimate']);

manageMyClubsApp.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

manageMyClubsApp.controller('UserMembershipRequestsCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.userMembershipRequestsUrl = $window.userMembershipRequestsUrl;

    $scope.requests = [];

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
            page: page,
            noCache: new Date().getTime()
        };

        $http({
            url: $scope.userMembershipRequestsUrl,
            method: 'GET',
            params: data
        }).success(function (response) {
            $scope.page = response.Page;
            $scope.pages = response.Pages;

            if ($scope.page == 1) {
                $scope.requests = response.Requests;
            } else {
                $scope.requests = $scope.requests.concat(response.Requests);
            }

            $scope.loading = false;
        }).error(function (response) {
            $scope.loading = false;
        });
    };

    $scope.get();
});

$(document).ready(function () {
    var settings = { items: ".club_listing" };

    $('#club_listing .active_clubs .club_listings').listingHover(settings);
    $('#club_listing .inactive_clubs .club_listings').listingHover(settings);

    settings = { items: ".user_request_listing" };

    $('#user_membership_requests .user_request_listings').listingHover(settings);
});