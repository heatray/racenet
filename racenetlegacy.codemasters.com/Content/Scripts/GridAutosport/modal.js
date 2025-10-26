var $close;

$(document).ready(function () {
    $close = $('.close');

    $close.click(function (e) {
        e.preventDefault();

        if (self == top) {
            history.go(-1);
        } else {
            parent.$.modal.close();
        }
    });

    if (self == top) {
        $('#modal').css('margin', '10px');
    }
});