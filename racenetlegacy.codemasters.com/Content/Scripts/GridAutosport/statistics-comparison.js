var statisticsComparisonApp = angular.module('statisticsComparisonApp', []);

statisticsComparisonApp.controller('TabCtrl', function ($scope) {
    $scope.filter = "career";
});

statisticsComparisonApp.controller('playerComparisonCtrl', function ($scope, $http, $window) {
    $scope.loading = false;

    $scope.selectedPlayer = $window.selectedPlayerId;

    $scope.$watch('selectedPlayer', function () {
        $scope.loading = true;

        var data = {
            playerId: $scope.selectedPlayer
        };

        $http({
            url: $window.playerStatisticsUrl,
            method: 'GET',
            params: data,
            options: { cache: false }
        }).
      success(function (response) {
          // Career
          if ($window.chartCareerDisciplineXp) {
              $window.chartCareerDisciplineXp(response.CareerTouringXp, response.CareerStreetXp, response.CareerTunerXp, response.CareerGrandPrixXp, response.CareerEnduranceXp);
          }

          if ($window.chartCareerChampionships) {
              $window.chartCareerChampionships(response.CareerChampionships);
          }

          if ($window.chartCareerRacesEntered) {
              $window.chartCareerRacesEntered(response.CareerWins, response.CareerPodiums, response.CareerRaces);
          }

          // Multiplayer
          if ($window.chartMultiplayerDisciplineXp) {
              $window.chartMultiplayerDisciplineXp(response.MultiplayerTouringXp, response.MultiplayerStreetXp, response.MultiplayerTunerXp, response.MultiplayerGrandPrixXp, response.MultiplayerEnduranceXp);
          }

          if ($window.chartMultiplayerRacesEntered) {
              $window.chartMultiplayerRacesEntered(response.MultiplayerWins, response.MultiplayerPodiums, response.MultiplayerRaces);
          }

          if ($window.chartDisciplineChallenges) {
              $window.chartDisciplineChallenges(response.DisciplineChallengePlatinum, response.DisciplineChallengeGold, response.DisciplineChallengeSilver, response.DisciplineChallengeBronze, response.DisciplineChallengeRaces);
          }

          // Overall
          if ($window.chartTopSpeed) {
              $window.chartTopSpeed(response.TopSpeed);
          }

          if ($window.chartNoOfRaces) {
              $window.chartNoOfRaces(response.Races);
          }

          if ($window.chartLongestDrift) {
              $window.chartLongestDrift(response.LongestDrift);
          }

          if ($window.chartDistanceTravelled) {
              $window.chartDistanceTravelled(response.DistanceTravelled);
          }

          $scope.loading = false;
      }).
      error(function (response) {
          $scope.loading = false;
      });
    });
});

$(document).ready(function () {
    $('#id').dropkick({
        theme: 'grid_autosport'
    });

    $('#statistics_comparison .filters').underline();

    setChartSize();

    $(window).resize(function () {
        setChartSize();
    });
});

function setChartSize() {
    var width = $('.chart:visible').first().width() - 28;

    $(".chart img, .chart svg").css({ width: width, height: width });
}