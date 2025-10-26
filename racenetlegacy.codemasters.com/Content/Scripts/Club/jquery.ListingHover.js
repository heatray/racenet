/*
* jQuery Listing Hover plugin 0.1
*
* Codemasters
*/

(function ($) {
    $.fn.listingHover = function (options) {
        var parentElement;

        var defaults = {
            items: "",
            hoverClassName: "hover",
            beforeClassName: "before",
            firstClassName: "first"
        };

        var settings = $.extend({}, defaults, options);

        parentElement = this;

        parentElement.on('mouseenter mouseleave', settings.items, mouseHandler);

        function mouseHandler(e) {
            var $target = $(this);

            if (e.type == 'mouseenter') {
                var $prev = $target.prev();

                if ($prev.length) {
                    $prev.addClass(settings.beforeClassName);
                } else {
                    parentElement.addClass(settings.firstClassName);
                }

                $target.addClass(settings.hoverClassName);
            } else {
                parentElement.find(settings.items).removeClass(settings.beforeClassName);

                $target.removeClass(settings.hoverClassName);

                parentElement.removeClass(settings.firstClassName);
            }
        }
    };
})(jQuery);