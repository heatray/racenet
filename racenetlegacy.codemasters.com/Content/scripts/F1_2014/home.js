/*global $, angular, lineGraph */

// Chart
var settings = {
    canvasId: '#graph-canvas',

    width: 726,
    height: 240,

    dataUrl: window.graphUrl,

    axisOffsetX: 1,
    axisOffsetY: 30,

    axisColour: "#fff",
    axisLineWidth: 2,
    axisWatermarkWidth: 1,
    axisWatermarkAlpha: 0.3,
    numWatermarks: 5,

    numHorizontalSegments: 8,

    pointLineColour: "rgba(255, 255, 255, 0.75);",
    pointLineWidth: 4,

    areaFillColour: "rgba(0, 43, 61, 0.5);",
    areaFillAlpha: 0.25,

    axisYContainer: '#graph-axis-y',
    axisXContainer: '#graph-axis-x',
    axisLabelTemplateY: '#graph-axis-marker-template-y',
    axisLabelTemplateX: '#graph-axis-marker-template-x',
    axisLabelTemplateText: '.graph-axis-label-text',

    axisYRoundToNearestX: 10,
    axisYLabelOffsetX: 7,

    axisXRoundToNearestX: 10,
    axisXLabelOffsetY: 14,

    numberGroupSeparator: window.numberGroupSeparator,
    timeFormatSeparator: ':'
};

var graph = new lineGraph(window.settings);

function showTooltip(show, time, frequency, location) {
    "use strict";

    var tooltip = $('.graph-tooltip');

    if (show) {
        tooltip.show();
        tooltip.find('#graph-tooltip-frequency').text(frequency);
        tooltip.find('#graph-tooltip-time').text(time);
        tooltip.css('left', location.x - tooltip.width() / 2);
        tooltip.css('top', location.y - (tooltip.height() + 10));
    } else {
        tooltip.hide();
    }
}

function addPointMarker(graphContainerId, markerCssClassId, graph, modelData, dataElement) {
    "use strict";

    var d, point, marker, width, height;

    // Lookup graph element in model data that corresponds to player data
    for (d = 0; d < modelData.GraphElements.length; ++d) {
        if (modelData.GraphElements[d].X === dataElement.Time && dataElement.Time > 0) {
            point = graph.plotDataPoint(modelData.AxisX, modelData.AxisY, modelData.GraphElements[d]);
            marker = $(document.createElement('div'));

            if (dataElement.DisplayTime !== undefined) {
                dataElement.Time = dataElement.DisplayTime;
            } else {
                dataElement.Time = graph.convertLongToTimeString(dataElement.Time);
            }

            marker.attr('class', markerCssClassId);

            marker.html('&nbsp;');

            width = marker.width();
            height = marker.height();

            if (width === 0) {
                width = 20;
            }
            if (height === 0) {
                height = 20;
            }

            marker.css('left', (point.x - width / 2));
            marker.css('top', (point.y - height / 2));

            marker.mouseenter(function () {
                showTooltip(true, dataElement.Time, graph.convertToSeperatedNumber(dataElement.Frequency, settings.numberGroupSeparator), point);
            });

            marker.mouseleave(function () {
                showTooltip(false, null, null, null);
            });

            marker.appendTo(graphContainerId);
            break;
        }
    }
}

function updateRecordWidget(elementName, data) {
    "use strict";

    var recordWidget = $(elementName);
    if (data.DisplayName != null || data.DisplayName !== '-') {
        recordWidget.find('.ir-name').text(data.DisplayName);
    }
    else {
        recordWidget.find('.ir-name').text('-');
    }
    if (data.Time > 0) {
        recordWidget.find('.ir-time').text(data.DisplayTime);
    }
    else {
        recordWidget.find('.ir-time').text('');
    }
}

function processGraphData(data) {
    "use strict";

    var i;

    // Check for no data state
    if (data.WorldBestData.Time === 0) {
        $('#graph_no_data').show();
    }

    // Update individual record widgets              
    updateRecordWidget('#ir-player', data.PlayerData);
    updateRecordWidget('#ir-friend', data.FriendData);
    updateRecordWidget('#ir-world', data.WorldBestData);

    // Lookup graph element in model data that corresponds to player data
    addPointMarker('#graph-container', 'graph-point-marker-player', graph, data, data.PlayerData);

    // Lookup graph element in model data that corresponds to player data
    addPointMarker('#graph-container', 'graph-point-marker-friend', graph, data, data.FriendData);

    addPointMarker('#graph-container', 'graph-point-marker-best', graph, data, data.WorldBestData);

    for (i = 0; i < data.PointElements.length; ++i) {
        addPointMarker('#graph-container', 'graph-point-marker-data', graph, data, data.PointElements[i]);
    }
}

$(document).ready(function () {
    "use strict";

    var level = window.level,
        levelEnd,
        gameLevel,
        percentage = (window.xp / levelEnd) * 100 + "%",
        pointsRemaining = level - window.xp;

    $('#right').css({
        'background-attachment': 'local'
    });

    $('#scoresMobile').flexslider({
        // touch: true,
        directionNav: false,
        animation: "slide",
        controlNav: true
    });

    switch (level) {
        case "0":
            levelEnd = 3100;
            gameLevel = 1;
            break;

        case "1":
            levelEnd = 10100;
            gameLevel = 2;
            break;

        case "2":
            levelEnd = 22700;
            gameLevel = 3;
            break;

        case "3":
            levelEnd = 44500;
            gameLevel = 4;
            break;

        case "4":
            levelEnd = 80700;
            gameLevel = 5;
            break;

        case "5":
            levelEnd = 134800;
            gameLevel = 6;
            break;

        case "6":
            levelEnd = 196200;
            gameLevel = 7;
            break;

        case "7":
            levelEnd = 266100;
            gameLevel = 8;
            break;

        default:
            levelEnd = 3100;
            gameLevel = 1;
            break;
    }

    if (window.xp >= 266100) {
        percentage = "100%";
        $('#xpAmount').stop(5000).animate({
            "width": percentage
        }, 2500);
        $("#nextUnlock").hide();
        $("#nextXpLevelBg p").hide();
    } else {
        $('#xpAmount').stop(5000).animate({
            "width": percentage
        }, 2500);
        $('.helmets').html('<p>' + gameLevel + '/8</p>');
        $("#nextUnlock").show();
        $("#nextXpLevelBg p").show();
    }

    $('#track_select').dropkick({
        theme: 'f12014'
    });

    $('#graph').bind('LineGraphDrawn', function () {
        var scope = angular.element(document.getElementById('graph')).scope();

        scope.stopLoading();
        scope.$apply();
    });
});

var homeApp = angular.module('homeApp', []);

homeApp.controller('GraphCtrl', function ($scope, $window) {
    "use strict";

    $scope.track = $window.defaultTrackId;
    $scope.zoom = "all";
    $scope.wet = false;
    $scope.assists = true;

    $scope.$watchCollection('[track, zoom, wet, assists]', function () {
        $scope.get();
    });

    $scope.stopLoading = function () {
        $scope.loading = false;
    };

    $scope.get = function () {
        $scope.loading = true;

        var timeSlice = 0,
            cv,
            ctx,
            viewModel;

        switch ($scope.zoom) {
            case "5sec":
                timeSlice = 5000;
                break;
            case "2sec":
                timeSlice = 2000;
                break;
            default:
                timeSlice = 60000;
        }

        viewModel = {
            "GraphRequest": {
                "Mode": 3,
                "Track": $scope.track,
                "WeatherWet": $scope.wet,
                "AssistsOn": $scope.assists,
                "TimeSlice": timeSlice
            }
        };

        if (window.graph !== null) {
            // Reset canvas
            cv = document.getElementById('graph-canvas');
            ctx = cv.getContext('2d');

            ctx.save();

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, cv.width, cv.height);

            ctx.restore();

            // Hide no data message
            $('#graph_no_data').hide();

            // Remove event bindings
            $('.graph-point-marker-player, .graph-point-marker-friend, .graph-point-marker-best, .graph-point-marker-data').unbind();

            // Remove axis labels
            $('#graph').find('.graph-axis-marker-x, .graph-axis-marker-y').remove();

            // Remove data markers
            $('.graph-point-marker-player, .graph-point-marker-friend, .graph-point-marker-best, .graph-point-marker-data').remove();

            window.graph.getGraphData(viewModel.GraphRequest, window.processGraphData);
        }
    };
});