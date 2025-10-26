var fgc;
var bgc;

var defaultBackgroundImage = 1;
var defaultForegroundImage = 1;
var defaultBackgroundColour = "#fff";
var defaultForegroundColour = "#fff";

var bgListContainer = ".bglistcontainer";
var fgListContainer = ".fglistcontainer";

var $bgList;
var $fgList;

var listsLoaded = 0;

var $bgColourPicker;
var $fgColourPicker;

var $bgFill;
var $fgFill;

var $bgColour;
var $fgColour;

var previewImageWidth = 300;
var previewImageHeight = 300;

var listScrollSpeed = 500;

$(document).ready(function () {
    $bgList = $('.bglist');
    $fgList = $('.fglist');

    $bgColourPicker = $("#bgcolourpicker");
    $fgColourPicker = $("#fgcolourpicker");

    $bgFill = $("#bgfill");
    $fgFill = $("#fgfill");

    $bgColour = $("#color");
    $fgColour = $("#fgcolor");

    bgc = $bgColour.val();
    fgc = $fgColour.val();

    //set up colour pickers..
    $bgColourPicker.farbtastic('#color');
    $fgColourPicker.farbtastic('#fgcolor');

    //change background fill
    $bgFill.click(function () {
        $bgColourPicker.toggle();
    });

    $bgColour.styleListener({
        styles: ['background-color'],
        changed: function (style, newValue, oldValue, element) {
            if (oldValue != newValue) {
                changeColor("cbg", newValue);
            }
        },
        interval: 500
    });

    //on mouse out hide colour picker
    $bgColourPicker.mouseleave(function () {
        var c = $bgColour.val();
        $(this).hide();
        changeColor("cbg", c);
        $("#Emblem_BackgroundFillColour").val(c);
    });

    //change foreground fill
    $fgFill.click(function () {
        $fgColourPicker.toggle();
    });

    $fgColour.styleListener({
        styles: ['background-color'],
        changed: function (style, newValue, oldValue, element) {
            if (oldValue != newValue) {
                changeColor("cfg", newValue);
            }
        },
        interval: 500
    });

    //on mouse out hide colour picker
    $fgColourPicker.mouseleave(function () {
        var c = $fgColour.val();
        $(this).hide();
        changeColor("cfg", c);
        $("#Emblem_ForegroundFillColour").val(c);
    });

    // Load backgrounds
    loadThumbnailList(window.bgUrl, $bgList);

    $bgList.on('click', '.option', function () {
        var $option = $(this);

        var c = $bgColour.val();

        var src = $option.data("path");
        var id = $option.data("id");

        $("#Emblem_BackgroundImage").val(id);
        $("#Emblem_BackgroundFillColour").val(c);

        $bgList.find(".option").removeClass('selected');
        $(this).addClass('selected');

        //set the colour of svg on selection to the selected colour..
        var selectedColour = $bgColour.css("background-color");

        setPreviewImage("cbg", src, selectedColour);
    });

    // Load foregrounds
    loadThumbnailList(window.fgUrl, $fgList);

    $fgList.on('click', '.option', function () {
        var $option = $(this);

        var c = $fgColour.val();

        var src = $option.data("path");
        var id = $option.data("id");

        $("#Emblem_ForegroundImage").val(id);
        $("#Emblem_ForegroundFillColour").val(c);

        $fgList.find(".option").removeClass('selected');
        $option.addClass('selected');

        var selectedColour = $fgColour.css("background-color");

        setPreviewImage("cfg", src, selectedColour);
    });

    $(window).resize(function () {
        resizeThumbnails();
    });
});

function resizeThumbnails() {
    var $thumbs = $('.listcontainer .image_container:visible');

    if ($thumbs.length) {
        var width = $thumbs.first().width();

        $svgs = $('.listcontainer .image_container svg');

        $svgs.css('width', width);
        $svgs.css('height', width);
    }
}

function loadThumbnailList(feedUrl, list) {
    // Load backgrounds
    $.getJSON(feedUrl,
        function (data) {
            //on success, 'data' contains a list of products.
            $.each(data, function (key, val) {
                var id = val.Id;
                var path = val.Path;

                // Add new image
                var $image = $('<img>').attr({
                    src: path
                });

                var $padding = $('<div>').addClass('image_container').append($image);

                $('<li>').addClass('option').attr({
                    'data-id': id,
                    'data-path': path
                }).append($padding).appendTo(list);
            });

            convertThumbnails(list);

            listsLoaded++;

            if (listsLoaded == 2) {
                applyDefaults();
            }
        });
}

// Sets the crest preview image
function setDefaults(bgimage, bgcolour, fgimage, fgcolour) {
    defaultBackgroundImage = bgimage;
    defaultForegroundImage = fgimage;
    defaultBackgroundColour = bgcolour;
    defaultForegroundColour = fgcolour;
}

function applyDefaults() {
    setPreviewBackground(defaultBackgroundImage + ".svg", defaultBackgroundColour);
    setPreviewForeground(defaultForegroundImage + ".svg", defaultForegroundColour);

    // Hightlight selected thumbnails
    var $bgItem = $bgList.find("li[data-id='" + defaultBackgroundImage + "']");
    var $fgItem = $fgList.find("li[data-id='" + defaultForegroundImage + "']");

    $bgItem.addClass('selected');
    $fgItem.addClass('selected');

    // Scroll to selected thumbnails
    $(bgListContainer).scrollTo($bgItem);
    $(fgListContainer).scrollTo($fgItem);
}

function setPreviewBackground(filename, colour) {
    imagePath = window.bgImageSrc + filename;

    setPreviewImage("cbg", imagePath, colour)
}

function setPreviewForeground(filename, colour) {
    imagePath = window.fgImageSrc + filename;

    setPreviewImage("cfg", imagePath, colour)
}

function setPreviewImage(container, imagePath, colour) {
    $('#' + container).empty();

    $('<img>').attr({
        src: imagePath,
        width: previewImageWidth,
        height: previewImageHeight
    }).addClass('svg').appendTo($('#' + container));

    convertToSVG(container, function () {
        changeColor(container, colour);
    });
}

// Replace an image with an inline SVG
function convertToSVG(container, callback) {
    $('#' + container + ' img.svg').each(function () {
        var $img = $(this);

        var imgURL = $img.attr('src');

        var svg = $img.parent().svg();

        $img.parent().removeClass('hasSVG');

        try {
            var svg = $img.parent().svg('get');
            $img.remove();
            svg.load(imgURL, {
                changeSize: false,
                onLoad: function (svg) {
                    if (callback) {
                        callback();
                    }
                }
            });
        } catch (e) { }
    });
}

function convertThumbnails(list) {
    list.find('img').each(function () {
        var $img = $(this);

        var imgURL = $img.attr('src');

        var svg = $img.parent().svg();

        try {
            var svg = $img.parent().svg('get');
            $img.remove();
            svg.load(imgURL, {
                changeSize: true,
                onLoad: function (svg) {
                    resizeThumbnails();
                }
            });
        } catch (e) { }
    });
}

function changeColor(container, colour) {
    var styles = container == "cbg" ? { fill: colour + "", stroke: "#171717", 'stroke-width': "0.01em" } : { fill: colour + "", stroke: "#171717", 'stroke-width': "0.02em" };

    $('#' + container + ' .svg').find('path, circle, polygon, rect').css(styles);

    var svg = $('#' + container + ' svg').svg();

    try {
        $('path, circle, polygon, rect', svg).attr(styles);
    } catch (e) { }
}

function getStep() {
    return $(bgListContainer).height();
}

var blockScroll = false;

$('#bgUp, #bgUp_mobile').on("click", function (event) {
    event.preventDefault();

    bgScroll("-=" + getStep() + "px");
});

$('#bgDown, #bgDown_mobile').on("click", function (event) {
    event.preventDefault();

    bgScroll("+=" + getStep() + "px");
});

$('#fgUp, #fgUp_mobile').on("click", function (event) {
    event.preventDefault();

    fgScroll("-=" + getStep() + "px");
});

$('#fgDown, #fgDown_mobile').on("click", function (event) {
    event.preventDefault();

    fgScroll("+=" + getStep() + "px");
});

// Mousewheel support for scrolling lists
$(bgListContainer).mwheelIntent(function (e, d) {
    if (d == 1) {
        bgScroll("-=" + getStep() + "px");
    } else if (d == -1) {
        bgScroll("+=" + getStep() + "px");
    }
});

$(fgListContainer).mwheelIntent(function (e, d) {
    if (d == 1) {
        fgScroll("-=" + getStep() + "px");
    } else if (d == -1) {
        fgScroll("+=" + getStep() + "px");
    }
});

function bgScroll(position) {
    if (!blockScroll) {
        blockScroll = true;

        $(bgListContainer).scrollTo({ top: position, left: 0 }, listScrollSpeed, {
            onAfter: function () {
                blockScroll = false;
            }
        });
    }
}

function fgScroll(position) {
    if (!blockScroll) {
        blockScroll = true;

        $(fgListContainer).scrollTo({ top: position, left: 0 }, listScrollSpeed, {
            onAfter: function () {
                blockScroll = false;
            }
        });
    }
}