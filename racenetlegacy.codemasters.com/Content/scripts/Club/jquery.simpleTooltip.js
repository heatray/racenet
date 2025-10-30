/*
* jQuery Simple Tooltip plugin 0.1
*
* Codemasters
*/

(function ($) {
    var parentElement;

    $.fn.simpleTooltip = function (options) {
        var defaults = {
            fadeSpeed: 500,
            className: "tooltip"
        };

        var settings = $.extend({}, defaults, options);

        parentElement = this;

        parentElement.on('mouseenter mouseleave', '[data-tooltip]', tooltipHandler);

        function tooltipHandler(e) {
            var $target = $(this);

            if (e.type == 'mouseenter') {
                var message = $(this).data('tooltip');

                $target.css('position', 'relative');

                var $tooltip = $('<span/>', { text: message }).addClass(settings.className).css('opacity', 0).appendTo($target);

                var targetWidth = $target.width();
                var tooltipPos = -($tooltip.width() / 2);

                $tooltip.css('left', (tooltipPos + (targetWidth / 2)) + 'px');

                $tooltip.animate({ opacity: 1 }, {
                    duration: settings.fadeSpeed, queue: false, complete: function () {
                        // Check that tooltip is visible
                        var left = $(this).offset().left;

                        if (left < 0) {
                            $(this).css('left', 0);
                        } else {
                            var right = left + $(this).width();

                            if (right > $(window).width()) {
                                $(this).css('left', 'auto');
                                $(this).css('right', 0);
                            }
                        }
                    }
                });
            } else {
                $tooltip = $target.find('.' + settings.className);

                $tooltip.animate({ opacity: 0 }, {
                    duration: settings.fadeSpeed, queue: false, complete: function () {
                        $(this).remove();
                    }
                });
            }
        }
    };
})(jQuery);