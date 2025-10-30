/*
* jQuery Underline plugin 0.1
*
* Codemasters
*/

(function ($) {
    $.fn.underline = function (options) {
        var parentElement;
        var underline;
        var timeout = null;

        var defaults = {
            timeout: 500,
            className: "underline",
            activeClassName: "active"
        };

        var settings = $.extend({}, defaults, options);

        parentElement = this;

        var targets = parentElement.find('a');

        targets.on('mouseenter mouseleave', mouseHandler);

        underline = $('<span class="' + settings.className + '"></span>');

        underline.appendTo(parentElement);

        // Set initial position
        setWidth(getActiveElement());

        $(window).resize(function () {
            setWidth(getActiveElement());
        });

        function mouseHandler(e) {
            if (e.type == 'mouseenter') {
                clearTimeout(timeout);

                setWidth($(this));
            } else {
                timeout = setTimeout(function () {
                    setWidth(getActiveElement())
                }, settings.timeout);
            }
        }

        function getActiveElement() {
            var parent = parentElement.find('.' + settings.activeClassName).first();

            return parent.length == 0 ? null : parent;
        }

        function setWidth(activeElement) {
            if (activeElement != null) {
                var width = activeElement.width();
                var height = activeElement.height();

                var position = activeElement.position();
                var marginLeft = parseInt(activeElement.css('margin-left'));

                underline.css('width', width + 'px');
                underline.css('left', (position.left + marginLeft) + 'px');
                underline.css('top', (position.top + height) + 'px');
            }
        }
    };
})(jQuery);