$(document).ready(function () {
    $(window).on('preloaderGone', function () {
        // Animate bars
        $('#chart .bar .xp').each(function () {
            var height = $(this).data('height');

            $(this).animate({ height: height }, 2000);
        });
    });
});