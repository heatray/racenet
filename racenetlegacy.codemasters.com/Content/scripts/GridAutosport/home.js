// Slider settings
var autoPlay = true;

$(document).ready(function () {
    $slider = $('#slider');
    $sliderMobile = $('#slider_mobile');

    var isTouch = 'ontouchstart' in document.documentElement;

    if (isTouch) {
        autoPlay = false;
    }

    var options = {
        controlNav: false,
        directionNav: true,
        animation: "slide",
        touch: true,
        start: function (slider) {
            $('.flexslider').resize();
        }
    };

    $slider.flexslider(options);
    $sliderMobile.flexslider(options);
});