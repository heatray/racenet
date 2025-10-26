/*
* jQuery Styled radio button plugin 0.1
*
* Codemasters
*/

(function ($) {
    var parentElement;

    $.fn.styledRadio = function (options) {
        var defaults = {
            radioName: "",
            className: "radio"
        };

        var settings = $.extend({}, defaults, options);

        parentElement = this;

        this.find('input[type=radio][name=' + settings.radioName + ']').each(function () {
            var id = $(this).attr('id');

            var isSelected = ($(this).attr("checked") != "undefined" && $(this).attr("checked") == "checked");

            $(this).before($('<span/>', { 'data-id': id, 'data-name': settings.radioName, 'class': settings.className + (isSelected ? ' selected' : '') }));

            // Would set display to none, but that breaks it in IE8
            $(this).css('width', 0).css('height', 0);
            $(this).css('display', 'inline-block');
            $(this).css('opacity', '0');

            $(this).on('change', changeHandler);
        });


        $('.' + settings.className + '[data-name=' + settings.radioName + ']').on('mouseenter mouseleave', hoverHandler);

        $('.' + settings.className + '[data-name=' + settings.radioName + ']').on('click', clickHandler);

        function hoverHandler(e) {
            var $target = $(this);

            if (e.type == 'mouseenter') {
                $target.addClass('hover');
            } else {
                $target.removeClass('hover');
            }
        }

        function clickHandler() {
            var id = $(this).data('id');

            // Uncheck all
            reset();

            $(this).addClass('selected');

            // Click corresponding radio button
            $('#' + id).trigger('click');
        }

        function changeHandler() {
            var $target = $(this);

            var id = $target.attr('id');

            var selector = '.' + settings.className + '[data-id=' + id + ']';

            // Uncheck all
            reset();

            // Now check the right one
            if ($target.attr("checked") != "undefined" && $target.attr("checked") == "checked") {
                $(selector).addClass('selected');
            }
        }

        function reset() {
            $('.' + settings.className + '[data-name=' + settings.radioName + ']').removeClass('selected');
        }
    };
})(jQuery);