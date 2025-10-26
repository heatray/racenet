var $body;

$(document).ready(function () {
    $body = $('body');

    $body.styledRadio({ radioName: 'AccessMode', className: 'styled_radio' });

    $('#Language').dropkick({
        theme: 'grid_autosport',
    });

    $('.dk_toggle').css('width', '130px');

    $body.on('click', '.cta.club_liveries', function () {
        confirmModal(clubLiveriesUrl);
    });
});