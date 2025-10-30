var $body;

$(document).ready(function () {
    var inactiveClass = 'inactive';

    $body = $('body');
    var vehicle = '.vehicle';

    $body.on('click', vehicle, function () {
        var principleId = parseInt($(this).data('principle-id'));
        var vehicleId = parseInt($(this).data('vehicle-id'));
        var modelId = parseInt($(this).data('model-id'));

        var src = vehicleUrl + '?principleId=' + principleId + '&vehicleId=' + vehicleId + "&modelId=" + modelId;

        confirmModal(src);
    });

    $body.on('mouseenter', vehicle, function () {
        $('.vehicle').addClass('inactive');

        $(this).removeClass('inactive');
    });

    $body.on('mouseleave', vehicle, function () {
        $('.vehicle').removeClass('inactive');
    });
});
