var clubRosterApp = angular.module('clubRosterApp', ['ngAnimate']);

clubRosterApp.controller('InviteFriendCtrl', function ($scope) {
    $scope.friend = "";

    $scope.friendSelected = function () {
        return ($scope.friend == "" || $scope.friend == undefined) ? false : true;
    };
});

clubRosterApp.controller('ClubRosterCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.teamId = $window.teamId;
    $scope.clubRosterUrl = $window.clubRosterUrl;

    $scope.members = [];

    $scope.name = "";

    $scope.rankOrder = true;

    $scope.page = 1;
    $scope.pages = 1;

    $scope.$watch('rankOrder', function () {
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
            teamId: $scope.teamId,
            ordering: $scope.rankOrder ? 'rank' : 'level',
            page: page,
            noCache: new Date().getTime()
        };

        $http({
            url: $scope.clubRosterUrl,
            method: 'GET',
            params: data
        }).success(function (response) {
            $scope.page = response.Page;
            $scope.pages = response.Pages;

            if ($scope.page == 1) {
                $scope.members = response.Members;
            } else {
                $scope.members = $scope.members.concat(response.Members);
            }

            $scope.loading = false;
        }).error(function (response) {
            $scope.loading = false;
        });
    };
});

clubRosterApp.controller('ClubMembershipRequestsCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.teamId = $window.teamId;
    $scope.clubMembershipRequestsUrl = $window.clubMembershipRequestsUrl;

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
            teamId: $scope.teamId,
            page: page,
            noCache: new Date().getTime()
        };

        $http({
            url: $scope.clubMembershipRequestsUrl,
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

var $playerId;

function initFriendsList() {
    if ($playerId) {
        // Give model time to update
        window.setTimeout(function () {
            $playerId.val('').change();
            $playerId.dropkick('refresh');
        }, 100);
    }
}

$(document).ready(function () {
    $('#PlayerId').dropkick({
        theme: 'grid_autosport',
    });

    $('#club_roster .filters').underline();

    $('.dk_toggle').css('width', '215px');
});