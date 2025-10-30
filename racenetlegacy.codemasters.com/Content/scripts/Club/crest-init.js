$(function () {
    var svgi = 1;

    $gasWrapper = $('.gas_wrapper');

    /* Emblem customisation */
    customiseEmblems();

    $gasWrapper.bind("DOMSubtreeModified", function () {
        customiseEmblems();
    });

    function customiseEmblems() {
        var fills = $('.emblem_wrapper img.process');

        fills.each(function () {
            $(this).removeClass('process');

            var img = $(this);
            var width = img.width();
            var height = img.height();
            var fill = img.data('fill');
            var src = img.attr('src');
            var cls = img.attr('class');

            if (width > 0 && height > 0) {
                if (fill != undefined) {
                    var id = "svg" + (svgi++);

                    var $svg = $('<span/>', { id: id, 'class': cls });

                    // replaceWith doesn't work here
                    img.after($svg);
                    img.remove();

                    var svg = $("#" + id).svg();

                    try {
                        var svg = $("#" + id).svg('get');
                        svg.load(src, {
                            changeSize: false,
                            onLoad: function (svg) {
                                $container = $(svg.root()).parent();

                                if ($container.hasClass('foreground')) {
                                    $('path, circle, polygon, rect', svg.root()).attr({ "fill": fill, stroke: "#171717", 'stroke-width': "0.02em" });
                                } else {
                                    $('path, circle, polygon, rect', svg.root()).attr({ "fill": fill });
                                }
                            }
                        });
                    } catch (e) { }
                }
            }
        });
    }
});