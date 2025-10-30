/*
* jQuery Countdown plugin 0.1
*
* Codemasters
*/

(function ($) {
    $.fn.countdown = function (options) {
        var parentElement = this;

        var timeout = null;

        var defaults = {
            timeout: 10000,
            timeString: "%1$u days, %2$u hours, %3$u minutes",
            endString: "Expired"
        };

        var endTimestamp = parentElement.data('end-time');

        var endTime = new Date(endTimestamp.replace(/-/g, "/")).getTime();

        var settings = $.extend({}, defaults, options);

        timeout = setInterval(function () {
            updateTimer();
        }, settings.timeout);


        function updateTimer() {
            var now = new Date();
            var nowUtcTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()).getTime();

            var difference = endTime - nowUtcTime;

            if (difference <= 0) {
                // Event has ended
                clearInterval(timeout);

                setCountdown(settings.endString);
            } else {
                var cd = 24 * 60 * 60 * 1000;
                var ch = 60 * 60 * 1000;
                var days = Math.floor(difference / cd);
                var hours = Math.floor((difference - days * cd) / ch);
                var minutes = Math.floor((difference - days * cd - hours * ch) / 60000);

                setCountdown(sprintf(settings.timeString, days, hours, minutes));
            }
        }

        function setCountdown(text) {
            parentElement.text(text);
        }
    };
})(jQuery);