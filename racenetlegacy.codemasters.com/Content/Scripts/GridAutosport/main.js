// Global settings
var globalAnimateSpeed = 200;

var $html;
var $body;
var $scroll;

var $background;

var $contentBackgroundBlur;
var $contentBackground;

var $scrollUsing;

var modalOptions = {
    autoPosition: true,
    autoResize: true,
    overlayClose: true,
    onOpen: function (dialog) {
        dialog.overlay.fadeIn(globalAnimateSpeed, function () {
            dialog.data.hide();
            dialog.container.fadeIn(globalAnimateSpeed, function () {
                dialog.data.fadeIn(globalAnimateSpeed);
            });
        });
    },
    onClose: function (dialog) {
        dialog.data.fadeOut(globalAnimateSpeed, function () {
            dialog.container.fadeOut(globalAnimateSpeed, function () {
                dialog.overlay.fadeOut(globalAnimateSpeed, function () {
                    $.modal.close();
                });
            });
        });
    },
    overlayCss: {
        'backgroundColor': '#000',
        'opacity': '0.75'
    },
    containerCss: {
        'borderTop': '1px solid #fff',
        'borderBottom': '1px solid #fff',
        'backgroundColor': '#000',
        'color': '#fff',
        'padding': '40px'
    }
};

function setLoading(container) {
    if (container.length) {
        container.css('position', 'relative');
        var $loading = $('<span/>').addClass('loading').appendTo(container);
    }
}

function unsetLoading(container) {
    if (container.length) {
        container.find('.loading').remove();
    }
}

function scrollToElement(element) {
    var $element = $(element);

    if ($element.length) {
        $('html, body').animate({
            scrollTop: $element.offset().top
        }, 1000);
    }
}

function confirmModal(src, maxWidth) {
    if ('ontouchstart' in document.documentElement) {
        document.location.href = src;
    } else {
        var width = 280;

        var viewportWidth = $(window).width();

        if (viewportWidth > 500 && viewportWidth < 800) {
            width = 400;
        } else if (viewportWidth >= 800 && viewportWidth < 1000) {
            width = 600;
        } else if (viewportWidth >= 1000) {
            width = 850;
        }

        if (typeof maxWidth !== "undefined") {
            if (width > maxWidth) {
                width = maxWidth;
            }
        }

        $.modal('<iframe id="modal_iframe" src="' + src + '" width="' + width + '" style="border:0">', modalOptions);

        $('#modal_iframe').load(function () {
            $iframe = $(this);

            var wait = setInterval(function () {
                var height = $iframe.contents().find("body").height();
                var width = $iframe.contents().find("body").width();

                if (height > 0 && width > 0) {
                    clearInterval(wait);

                    $iframe.height(height + 10);
                    $iframe.width(width);

                    $("#simplemodal-container").css('height', 'auto');
                    parent.$(parent.document).trigger('resize.simplemodal');

                    $.modal.setPosition();
                }
            }, 50);
        });
    }
}

$(function () {
    $.extend($.easing,
    {
        easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
    });

    $html = $('html');
    $body = $('body');
    $scroll = $('#scroll');

    $background = $('#background_container');

    $contentBackground = $('#gridautosport_content_background');

    if (/webkit/.test(navigator.userAgent.toLowerCase())) {
        $scrollUsing = $body;
    } else {
        $scrollUsing = $html;
    }

    if (!$html.hasClass('touch') && !isIe9OrEarlier()) {
        // Scrolling of main content should already be smooth on touchscreens
        $(window).scroll(alignBackground);

        // No point adding mousewheel event for touchscreen devices
        $(window).mousewheel(function (event, delta, deltaX, deltaY) {
            if (delta < 0) $scrollUsing.scrollTop($scrollUsing.scrollTop() + 30);
            else if (delta > 0) $scrollUsing.scrollTop($scrollUsing.scrollTop() - 30);
            return false;
        });
    }

    // Enable player popups
    $body.on('click', '[data-player-id]:not(a)', function () {
        var playerId = parseInt($(this).data('player-id'));
        var src = playerUrl + "?playerId=" + playerId;

        confirmModal(src, 400);
    });

    /* Background blur */

    $(window).resize(function () {
        alignBackground();
        stickyMenu();
    });

    $(window).scroll(function () {
        stickyMenu();
    });

    alignBackground();

    /* Enable tooltips */

    $body.simpleTooltip();

    $('#subnav_mobile_handle').on('click', function () {
        $('#sidebar .navigation').toggleClass('active');
        $('#subnav_mobile_handle').toggleClass('active');
    });

    /* Display correct subnav item */

    if (window.hasClub) {
        // Hide join a club
        $('#gas_subnav #Button_1').hide();
    } else {
        // Hide my racing clubs
        $('#gas_subnav #Button_2').hide();
    }

    function isIe() {
        var myNav = navigator.userAgent.toLowerCase();
        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
    }

    function isIe9OrEarlier() {
        if (isIe() && isIe() < 10) {
            return true;
        } else {
            return false;
        }
    }

    function alignBackground() {
        var yPos = $(window).scrollTop();
        var yPosBg = -Math.round(yPos / 2) + 'px';
        var yPosFg = -Math.round(yPos) + 'px';
        var yPosFl = Math.round(yPos * 1.5) + 'px';

        $background.css('top', yPosBg);
    }

    function stickyMenu() {
        var $menu = $('#menubar');
        var $subNav = $('#gridautosport_subnav');
        var $subNavSpacer = $('#gridautosport_subnav_spacer');
        var $cookieBar = $('#codemasters_cookies');

        var headerHeight = $menu.height();

        if ($cookieBar.length) {
            headerHeight += $cookieBar.height();
        }

        if ($(window).scrollTop() > headerHeight) {
            $subNavSpacer.height($subNav.height()).show();
            $subNav.addClass('stick');
        } else {
            $subNavSpacer.hide();
            $subNav.removeClass('stick');
        }
    }
});
