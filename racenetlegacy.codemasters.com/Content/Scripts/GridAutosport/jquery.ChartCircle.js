/*
* jQuery Circle Chart plugin 0.1
*
* Requires: Snap.svg
*
* Codemasters
*/

(function ($) {
    $.fn.chartcircle = function (options) {
        var parentElement = this;

        var timeout = null;

        var defaults = {
            data: {},
            svgFile: '',
            type: 'withTotal',
            timeout: 5000,
            leftLineId: "RedLine_2_",
            rightLineId: "WhiteLine_2_",
            fontFamily: "EurostileNextW02-Ext",
            altFontFamily: "Arial",
            dataValueFontSize: "20px",
            dataValueTextY: "116px",
            dataLabelFontSize: "14px",
            dataLabelTextY: "136px",
            dataNameFontSize: "15px",
            dataNameTextY: "162px",
            dataDark: "#202020",
            leftDataDark: "#801411",
            leftDataLight: "#fe0002",
            rightDataDark: "#8f9190",
            rightDataLight: "#fefefe",
            nameColour: "#fefefe",
            inactiveStrokeWidth: 0,
            activeStrokeWidth: 2,
            circleRadius: 4,
            onComplete: false
        };

        var settings = $.extend({}, defaults, options);

        // Line styles
        var yourLine = {
            stroke: settings.leftDataDark,
            strokeWidth: settings.inactiveStrokeWidth,
            fill: "none"
        };

        var yourLineHighlight = {
            stroke: settings.leftDataLight,
            strokeWidth: settings.activeStrokeWidth
        };

        var theirLine = {
            stroke: settings.rightDataDark,
            strokeWidth: settings.inactiveStrokeWidth,
            fill: "none"
        };

        var theirLineHighlight = {
            stroke: settings.rightDataLight,
            strokeWidth: settings.activeStrokeWidth
        };

        var currentStat = 0;

        var numStats = 0;

        var s = Snap('#' + parentElement.attr('id'));

        Snap.load(settings.svgFile, onSvgLoaded);

        function onSvgLoaded(data) {
            parentElement.empty();

            s.append(data);

            s = Snap('#' + parentElement.attr('id') + " svg");

            // Get left guide line
            var leftStroke = s.select("#" + settings.leftLineId);
            var leftPath = leftStroke.attr('d');

            leftStroke.attr({
                fill: 'none',
                stroke: 'none'
            });

            var rightStroke = s.select("#" + settings.rightLineId);
            var rightPath = rightStroke.attr('d');

            rightStroke.attr({
                fill: 'none',
                stroke: 'none'
            });

            // Data
            var leftPathLength = Snap.path.getTotalLength(leftStroke);
            var rightPathLength = Snap.path.getTotalLength(rightStroke);

            var leftTotal = 0;
            var rightTotal = 0;

            for (var key in settings.data) {
                var data = settings.data[key];

                if (data.type == 'total') {
                    if (data.left > data.right) {
                        leftTotal = rightTotal = data.left;
                    } else {
                        leftTotal = rightTotal = data.right;
                    }
                } else {
                    leftTotal += data.left;
                    rightTotal += data.right;
                }

                if (!data.hide) {
                    numStats++;
                }
            }

            var leftUnit = leftTotal > 0 ? leftPathLength / leftTotal : 0;
            var rightUnit = rightTotal > 0 ? rightPathLength / rightTotal : 0;

            var leftCumulative = 0;
            var rightCumulative = 0;

            var number = 0;

            for (var key in settings.data) {
                number++;

                var data = settings.data[key];

                var leftValue = 0;
                var rightValue = 0;

                leftValue = leftUnit * data.left;
                rightValue = rightUnit * data.right;

                leftCumulative += leftValue;
                rightCumulative += rightValue;

                if (data.invert) {
                    leftValue = (leftPathLength - leftValue);
                    rightValue = (rightPathLength - rightValue);

                    if (rightValue < 0) {
                        rightValue = 0;
                    }
                }

                if (!data.hide) {
                    if (settings.type == 'withTotal') {
                        var leftSubPath = Snap.path.getSubpath(leftPath, 0, leftValue);
                        // Snap looks to return the full path if the start and end points are the same (and non-zero)
                        if (rightValue == 0) {
                            var rightSubPath = Snap.path.getSubpath(rightPath, 0, 0);
                        } else {
                            var rightSubPath = Snap.path.getSubpath(rightPath, rightPathLength - rightValue, rightPathLength);
                        }
                    } else {
                        if (data.type == 'total') {
                            var leftSubPath = Snap.path.getSubpath(leftPath, 0, leftPathLength);
                            var rightSubPath = Snap.path.getSubpath(rightPath, 0, rightPathLength);
                        } else {
                            var leftSubPath = Snap.path.getSubpath(leftPath, leftCumulative - leftValue, leftCumulative);
                            if (rightValue == 0) {
                                var rightSubPath = Snap.path.getSubpath(rightPath, 0, 0);
                            } else {
                                var rightSubPath = Snap.path.getSubpath(rightPath, rightPathLength - rightCumulative, (rightPathLength - rightCumulative) + rightValue);
                            }
                        }
                    }

                    createPath(s, leftSubPath, true, number, yourLine, { stroke: settings.dataDark });
                    createPath(s, rightSubPath, false, number, theirLine, { stroke: settings.dataDark });

                    if (settings.type == 'withTotal') {
                        s.circle(Snap.path.getPointAtLength(leftSubPath, leftValue).x, Snap.path.getPointAtLength(leftSubPath, leftValue).y, settings.circleRadius).attr({
                            fill: settings.leftDataLight
                        });
                        if (data.invert && rightValue == 0) {
                        } else {
                            s.circle(Snap.path.getPointAtLength(rightSubPath, 0).x, Snap.path.getPointAtLength(rightSubPath, 0).y, settings.circleRadius).attr({
                                fill: settings.rightDataLight
                            });
                        }
                    } else {
                        s.circle(Snap.path.getPointAtLength(leftSubPath, leftCumulative).x, Snap.path.getPointAtLength(leftSubPath, leftCumulative).y, settings.circleRadius).attr({
                            fill: settings.leftDataLight
                        });
                        s.circle(Snap.path.getPointAtLength(rightSubPath, 0).x, Snap.path.getPointAtLength(rightSubPath, 0).y, settings.circleRadius).attr({
                            fill: settings.rightDataLight
                        });
                    }

                    createDataPanel(s, number, data.left, data.leftLabel, data.right, data.rightLabel, key);
                }
            }

            s.circle(Snap.path.getPointAtLength(leftPath, 0).x, Snap.path.getPointAtLength(leftPath, 0).y, settings.circleRadius).attr({
                fill: settings.rightDataLight
            });
            s.circle(Snap.path.getPointAtLength(leftPath, 0).x, Snap.path.getPointAtLength(leftPath, 0).y, settings.circleRadius / 2).attr({
                fill: settings.leftDataLight
            });

            if (numStats > 1) {
                // Pagination dots
                var pagination = s.group().attr({
                    id: "paging"
                });

                for (var i = 1; i <= numStats; i++) {
                    createPagination(pagination, i, show);
                }

                startTimer();

                s.mouseover(function () {
                    stopTimer();
                });

                s.mouseout(function () {
                    startTimer();
                });
            }

            if (numStats > 0) {
                show(1);
            }

            if (settings.onComplete) {
                settings.onComplete();
            }
        }

        function startTimer() {
            if (timeout == null) {
                timeout = setInterval(function () {
                    nextStat();
                }, settings.timeout);
            }
        }

        function stopTimer() {
            clearInterval(timeout);

            timeout = null;
        }

        function nextStat() {
            if (currentStat == 0 || currentStat == numStats) {
                currentStat = 1;
            } else {
                currentStat++;
            }

            show(currentStat);
        }

        function createPagination(group, position, onClick) {
            // Work out starting position so we can center items
            var start = 135;

            var width = numStats * 15;

            var offset = start - (width / 2);

            var circle = s.circle(offset + (15 * (position - 1)), 172, settings.circleRadius).attr({
                fill: settings.rightDataLight
            })
                .hover(function () {
                    this.attr({
                        cursor: "pointer"
                    })
                })
                .click(function () {
                    if (onClick) {
                        onClick(position);
                    }
                });

            group.add(circle);
        }

        function createPath(s, path, left, number, attributes1, attributes2) {
            s.path(path)
            .attr(attributes1)
            .attr(attributes2)
            .attr({
                id: (left ? "left" : "right") + "_" + number + "_line",
                class: (left ? "left" : "right") + "_line"
            });
        }

        function createDataPanel(snap, number, yourValue, yourValueLabel, theirValue, theirValueLabel, name) {
            var yourValueText = {
                fill: settings.leftDataLight,
                style: "text-anchor: middle"
            };

            var theirValueText = {
                fill: settings.rightDataLight,
                style: "text-anchor: middle"
            };

            var valueNameText = {
                fill: settings.nameColour,
                style: "text-anchor: middle"
            };

            var valueTextInner = {
                fontSize: settings.dataValueFontSize,
                fontFamily: settings.fontFamily
            };

            var valueLabelInner = {
                fontSize: settings.dataLabelFontSize,
                fontFamily: settings.altFontFamily
            };

            var valueNameInner = {
                fontSize: settings.dataNameFontSize,
                fontFamily: settings.fontFamily
            };

            var panel = s.group().attr({
                id: 'panel_' + number,
                class: 'panel'
            });
            var yourText = s.text(80, settings.dataValueTextY, [yourValue]).attr(yourValueText);
            yourText.selectAll("tspan").attr(valueTextInner);
            panel.add(yourText);

            if (yourValueLabel && yourValueLabel != "") {
                var nameBits = yourValueLabel.split("\n");
                var yourLabelText = s.text(80, settings.dataLabelTextY, nameBits).attr(yourValueText);
                yourLabelText.selectAll("tspan").attr(valueLabelInner);
                yourLabelText.selectAll("tspan:nth-child(n+2)").attr({
                    dy: "1.2em",
                    x: 80
                });
                panel.add(yourLabelText);
            }

            var theirText = s.text(177, settings.dataValueTextY, [theirValue]).attr(theirValueText);
            theirText.selectAll("tspan").attr(valueTextInner);
            panel.add(theirText);

            if (theirValueLabel && theirValueLabel != "") {
                var nameBits = theirValueLabel.split("\n");
                var theirLabelText = s.text(177, settings.dataLabelTextY, nameBits).attr(theirValueText);
                theirLabelText.selectAll("tspan").attr(valueLabelInner);
                theirLabelText.selectAll("tspan:nth-child(n+2)").attr({
                    dy: "1.2em",
                    x: 177
                });
                panel.add(theirLabelText);
            }

            if (name != "") {
                var nameBits = name.split("\n");
                var text = s.text(127, settings.dataNameTextY, nameBits).attr(valueNameText);
                text.selectAll("tspan").attr(valueNameInner);
                text.selectAll("tspan:nth-child(n+2)").attr({
                    dy: "1.2em",
                    x: 127
                });
                panel.add(text);
            }
        }

        function highlight(element, colour) {
            element.animate({
                stroke: colour,
                strokeWidth: settings.activeStrokeWidth
            }, 500);
        }

        function unhighlight(element, colour) {
            // For some reason Snap can't animate a set
            element.attr({
                stroke: colour,
                strokeWidth: settings.inactiveStrokeWidth
            });
        }

        function show(number) {
            // Incase user initiated change
            currentStat = number;

            unhighlight(s.selectAll(".left_line"), settings.leftDataDark);
            unhighlight(s.selectAll(".right_line"), settings.rightDataDark);

            highlight(s.select("#left_" + number + "_line"), settings.leftDataLight);
            highlight(s.select("#right_" + number + "_line"), settings.rightDataLight);

            s.selectAll(".panel").attr({ style: "display:none" });
            s.select("#panel_" + number).attr({ style: "display:block" });

            try {
                s.select("#paging").selectAll("circle").attr({ fill: settings.rightDataDark });
                s.select("#paging").selectAll("circle:nth-child(" + number + ")").attr({ fill: settings.rightDataLight });
            } catch (e) {; }
        }

        function log(string) {
            console.log(string);
        }
    };
})(jQuery);