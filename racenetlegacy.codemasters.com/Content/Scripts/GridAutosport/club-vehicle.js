var clubVehicleApp = angular.module('clubVehicleApp', ['ngSanitize']);

clubVehicleApp.controller('vehicleCompareCtrl', function ($scope, $http, $window, $filter) {
    $scope.loading = false;

    $scope.selectedVehicle = "";

    $scope.active = function () {
        return ($scope.selectedVehicle == "" || $scope.selectedVehicle == undefined) ? false : true;
    };

    $scope.clubRaces = $window.clubRaces;
    $scope.clubWins = $window.clubWins;
    $scope.clubPodiums = $window.clubPodiums;
    $scope.clubDistance = $window.clubDistance;

    $scope.playerName;
    $scope.vehicleName;
    $scope.vehicleImage;
    $scope.vehicleDisciplineImage;
    $scope.level;

    $scope.playerRaces;
    $scope.playerWins;
    $scope.playerPodiums;
    $scope.playerDistance;

    $scope.allRaces = function () { return $scope.clubRaces + $scope.playerRaces };
    $scope.allWins = function () { return $scope.clubWins + $scope.playerWins };
    $scope.allPodiums = function () { return $scope.clubPodiums + $scope.playerPodiums };
    $scope.allDistance = function () { return $scope.clubDistance + $scope.playerDistance };

    $scope.racesPercentage = function () {
        if ($scope.allRaces() > 0) {
            return ((100 / $scope.allRaces()) * $scope.clubRaces);
        } else {
            return 0;
        }
    };
    $scope.winsPercentage = function () {
        if ($scope.allWins() > 0) {
            return ((100 / $scope.allWins()) * $scope.clubWins);
        } else {
            return 0;
        }
    };
    $scope.podiumsPercentage = function () {
        if ($scope.allPodiums() > 0) {
            return ((100 / $scope.allPodiums()) * $scope.clubPodiums);
        } else {
            return 0;
        }
    };
    $scope.distancePercentage = function () {
        if ($scope.allDistance() > 0) {
            return ((100 / $scope.allDistance()) * $scope.clubDistance);
        } else {
            return 0;
        }
    };

    $scope.formatNumber = function (number) {
        return number;
    }

    $scope.resetData = function () {
        $scope.playerName = "";
        $scope.vehicleName = "";
        $scope.vehicleImage = "";
        $scope.vehicleDisciplineImage = "";
        $scope.level = 0;

        $scope.playerRaces = "--";
        $scope.playerWins = "--";
        $scope.playerPodiums = "--";
        $scope.playerDistance = "--";
    }

    $scope.$watch('selectedVehicle', function () {
        if ($scope.active()) {
            $scope.loading = true;

            var vehicleData = $scope.selectedVehicle.split("|");

            var data = {
                vehicleId: vehicleData[0],
                modelId: vehicleData[1]
            };

            $http({
                url: $window.playerVehicleUrl,
                method: 'GET',
                params: data,
                options: { cache: false }
            }).
          success(function (response) {
              $scope.playerName = response.PlayerName;
              $scope.vehicleName = response.VehicleName;
              $scope.vehicleImage = response.VehicleImage;
              $scope.vehicleDisciplineImage = response.VehicleDisciplineImage;
              $scope.level = response.Level;

              $scope.playerRaces = response.Races;
              $scope.playerWins = response.Wins;
              $scope.playerPodiums = response.Podiums;
              $scope.playerDistance = response.Distance;

              $scope.loading = false;
          }).
          error(function (response) {
              $scope.loading = false;
          });
        } else {
            $scope.resetData();
        }
    });

    $scope.resetData();
})
.filter("thousands", function (numberFilter) {
    function isNumeric(value) {
        return (!isNaN(parseFloat(value)) && isFinite(value));
    }

    return function (inputNumber, thousandsSeparator) {
        if (isNumeric(inputNumber)) {
            thousandsSeparator = (typeof thousandsSeparator === "undefined") ? "," : thousandsSeparator;

            var filteredNumber = numberFilter(inputNumber, 0);

            var formattedNumber = filteredNumber.split(",").join(thousandsSeparator);

            return formattedNumber;
        } else {
            return inputNumber;
        }
    };
});

var $id;

$(document).ready(function () {
    $id = $('#id');

    $id.dropkick({
        theme: 'grid_autosport'
    });

    if ($(window).width() > 370) {
        $('.dk_toggle').css('width', '286px');
    } else {
        $('.dk_toggle').css('width', '236px');
    }
});