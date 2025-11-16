function lineGraph(settings)
{
    this.graphSettings = settings;
}

lineGraph.prototype = {
    convertLongToTimeString: function (value) {
        var mins = Math.floor(value / 60000);
        var secs = Math.floor((value % 60000) / 1000);
        var ms = Math.floor((value % 60000) % 1000);

        var s = "";
        if (mins < 10) s += "0";
        s += mins + this.graphSettings.timeFormatSeparator;
        if (secs < 10) s += "0";
        s += secs + ".";
        if (ms < 10) s += "0";
        s += ms;
        // Stylistic choice: Only show two digits for milliseconds
        if (ms > 99) s = s.slice(0, s.length - 1);

        return s;
    },

    convertToSeperatedNumber: function (nStr, delimitingCharacter) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + delimitingCharacter + '$2');
        }
        return x1 + x2;
    },

    getWatermarkSeparation: function () {
        return (this.graphSettings.height - this.graphSettings.axisOffsetY) / this.graphSettings.numWatermarks;
    },

    getWatermarkYCoordinateFor: function (index) {
        var watermarkSpacing = this.getWatermarkSeparation();
        return this.graphSettings.height - index * watermarkSpacing - watermarkSpacing;
    },

    roundUpToNearestX: function (value, boundary) {
        return Math.ceil(value / boundary) * boundary;
    },

    roundDownToNearestX: function (value, boundary) {
        return Math.floor(value / boundary) * boundary;
    },

    drawGraphOutline: function (context) {
        context.save();

        // Setup line stroke style 
        context.strokeStyle = this.graphSettings.axisColour;
        context.lineWidth = this.graphSettings.axisLineWidth;

        // Draw vertical axis 
        context.beginPath();
        context.moveTo(this.graphSettings.axisOffsetX, this.graphSettings.height);
        context.lineTo(this.graphSettings.axisOffsetX, 0);
        context.stroke();

        // Draw horizontal axis 
        context.beginPath();
        context.moveTo(this.graphSettings.axisOffsetX, this.graphSettings.height);
        context.lineTo(this.graphSettings.width - this.graphSettings.axisOffsetX, this.graphSettings.height);
        context.stroke();

        context.restore();
    },

    drawGraphWatermarks: function (context) {
        // Draw y-axis watermarks 
        context.save();

        // Setup stroke style 
        context.strokeStyle = this.graphSettings.axisColour;
        context.lineWidth = this.graphSettings.axisWatermarkWidth;
        context.globalAlpha = this.graphSettings.axisWatermarkAlpha;

        var numWatermarks = this.graphSettings.numWatermarks;
        var watermarkSpacing = this.getWatermarkSeparation();
        for (var idx = 0; idx < numWatermarks; ++idx) {
            // Draw each watermark line as a path 
            var y = this.getWatermarkYCoordinateFor(idx);
            context.beginPath();
            context.moveTo(this.graphSettings.axisOffsetX, y);
            context.lineTo(this.graphSettings.width, y);
            context.stroke();
        }

        context.restore();
    },

    drawGraphPoints: function (context, pointData) {
        // Point data is an array of PointData elements, sorted in ascending order 
        // Fill area under graphed line 
        context.save();
        context.fillStyle = this.graphSettings.areaFillColour;
        context.strokeStyle = this.graphSettings.areaFillColour;
        context.lineWidth = 0;
        context.beginPath();

        // Create path that includes bottom-left corner, path through data points, then bottom-right corner 
        context.moveTo(this.graphSettings.axisOffsetX - 0.5, this.graphSettings.height);
        context.lineTo(pointData[0].x - 0.5, pointData[0].y);

        // Build path out of lines to remaining data points 
        for (var i = 1; i < pointData.length; ++i) {
            context.lineTo(pointData[i].x, pointData[i].y + 0.5);
        }
        context.lineTo(pointData[pointData.length - 1].x + 0.5, this.graphSettings.height);

        // Apply area fill         
        context.globalAlpha = this.graphSettings.areaFillAlpha;
        context.fill();
        context.restore();

        // Draw path through data points 
        context.save();
        context.strokeStyle = this.graphSettings.pointLineColour;
        context.lineWidth = this.graphSettings.pointLineWidth;
        context.beginPath();

        // Move to location of first data point 
        context.moveTo(pointData[0].x, pointData[0].y);

        // Build path out of lines to remaining data points 
        for (var i = 1; i < pointData.length; ++i) {
            context.lineTo(pointData[i].x, pointData[i].y);
        }
        context.stroke();
        context.restore();
    },

    drawGraph: function (pointData) {
        var canvas = $(this.graphSettings.canvasId)[0];
        if (canvas.getContext) {
            // HTML5 canvas supported 
            var context = canvas.getContext('2d');

            // Draw the graph watermarks 
            this.drawGraphWatermarks(context);

            // Plot the data 
            this.drawGraphPoints(context, pointData);

            // Redraw the axis 
            this.drawGraphOutline(context);

            $(this.graphSettings.canvasId).trigger("LineGraphDrawn");
        }
        else {
            // No canvas support 
        }
    },

    plotDataPoint: function (axisXData, axisYData, dataElement) {
        var xRange = axisXData.Max - axisXData.Min;
        var yMax = this.roundUpToNearestX(axisYData.Max, this.graphSettings.axisYRoundToNearestX);

        var point = {
            x: this.graphSettings.axisOffsetX + ((dataElement.X - axisXData.Min) / xRange) * this.graphSettings.width,
            y: this.graphSettings.height - (this.graphSettings.height - this.graphSettings.axisOffsetY) * dataElement.Y / yMax
        };

        return point;
    },

    convertDataModelToGraphModel: function (dataModel) {
        var pointData = new Array();

        for (var idx = 0; idx < dataModel.GraphElements.length; ++idx) {
            var element = dataModel.GraphElements[idx];
            var point = this.plotDataPoint(dataModel.AxisX, dataModel.AxisY, element);
            pointData.push(point);
        }

        return pointData;
    },

    createYAxisLabels: function (data) {
        var numWatermarks = this.graphSettings.numWatermarks;
        var watermarkSpacing = this.getWatermarkSeparation();

        // Calculate the display values for the watermark labels 
        var axisUnits = this.roundUpToNearestX(data.AxisY.Max, this.graphSettings.axisYRoundToNearestX) / numWatermarks;

        // Generate y axis labels anchored to the watermark divisions         
        for (var idx = 0; idx < numWatermarks; ++idx) {
            // Draw each watermark line as a path 
            var y = this.getWatermarkYCoordinateFor(idx);
            var label = $(this.graphSettings.axisLabelTemplateY).clone();
            var height = label.height();
            label.attr('id', 'axis-label-y-' + idx);
            label.css('position', 'absolute');
            label.css('display', 'block');
            label.css('top', y - height / 2);
            label.css('left', this.graphSettings.axisYLabelOffsetX);

            // Note: $().appendTo() adds these divs in reverse order 
            var labelValue = Math.round((idx + 1) * axisUnits);

            label.find('div' + this.graphSettings.axisLabelTemplateText).text(this.convertToSeperatedNumber(labelValue, this.graphSettings.numberGroupSeparator));
            label.appendTo(this.graphSettings.axisYContainer);
        }
    },

    createXAxisLabels: function (data) {
        var numSegments = this.graphSettings.numHorizontalSegments;
        var timeRange = data.AxisX.Max - data.AxisX.Min;
        var segmentTimeSlice = timeRange / numSegments;
        var segmentPixelWidth = segmentTimeSlice / timeRange * this.graphSettings.width;

        // Generate x axis labels at uniform intervals         
        for (var idx = 0; idx < numSegments; ++idx) {
            // Draw each watermark line as a path 
            var x = this.graphSettings.axisOffsetX + ((segmentTimeSlice * (idx + 1)) / timeRange) * this.graphSettings.width - segmentPixelWidth / 2;
            var label = $(this.graphSettings.axisLabelTemplateX).clone();
            var width = label.width();
            label.attr('id', 'axis-label-x-' + idx);
            label.css('position', 'absolute');
            label.css('text-align', 'left');
            label.css('display', 'inline');
            label.css('float', 'left');
            label.css('top', this.graphSettings.axisXLabelOffsetY);
            label.css('left', x - width / 2);

            // Note: $().appendTo() adds these divs in reverse order             
            var labelValue = data.AxisX.Min + (idx + 1) * segmentTimeSlice - segmentTimeSlice / 2;

            label.find('div' + this.graphSettings.axisLabelTemplateText).text(this.convertLongToTimeString(labelValue));
            label.appendTo(this.graphSettings.axisXContainer);
        }
    },

    createAxisLabels: function (data) {
        // Create axis labels for Y axis 
        this.createYAxisLabels(data);

        // Create axis labels for X axis 
        this.createXAxisLabels(data);
    },

    getGraphData: function (graphRequest, onSuccess) {
        var self = this;
        var request = {
            url: this.graphSettings.dataUrl,
            type: 'GET',
            dataType: 'json',
            data: graphRequest,
            success: function (data, status, xhr) {
                // Map model data to graph-friendly data model 
                var pointData = self.convertDataModelToGraphModel(data);

                // Draw the data onto the graph 
                self.drawGraph(pointData);

                // Label the axes 
                self.createAxisLabels(data);

                // Call the supplied onSuccess method
                onSuccess(data);
            }
        };

        $.ajax(request);
    }

};
  
