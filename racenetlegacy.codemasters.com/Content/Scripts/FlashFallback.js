$(document).ready(function () {

    if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
        // Hide the share buttons?
        $('.shareFlashButton').hide();
    }    
    
    centreGetFlashDiv();

    $(window).resize(function () {
        centreGetFlashDiv();
    });

    $(window).scroll(function () {
        centreGetFlashDiv();
    });
});

function centreGetFlashDiv() {

    var width = parseInt($(window).width());
    var left = (width - 560) / 2;

    var height = parseInt($(window).height());
    var top = (height - 300) / 2;

    var offset = parseInt($(window).scrollTop());

    $('#no-flash-installed').css('left', left);
    $('#no-flash-installed').css('top', top + offset);
}
    