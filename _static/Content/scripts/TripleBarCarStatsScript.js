var shownGame = 'feature'
var sliderSpeed = 1000;
var imageWidth = 1224;

function showNext() {
    $('div#TripleBarDefault').show();
    $('div#TripleBarFriends').hide();
    $('div#TripleBarLegends').hide();
    $('.tb_featureGame').hide();
    $('.tb_previousGame').hide();
    $('.tb_nextGame').show();

    $('.carStats .button div').hide();
    $('.carStats .showPreviousGame .race').show();
    $('.carStats .showNextGame .demolition').show();

    $('.imageSlider .slider').animate({ left: 1224 * -2 }, sliderSpeed);

    $('.carTable .carStat').hide();
    $('.carTable .carStat.hoonigan').fadeIn(1000);
    $('.TripleBar').hide();
    $('#TripleBarHoonigan').fadeIn(1000);

    if (shownGame == 'previous') {
        $('#infoFavVehDemo').fadeOut(1000);
    }
    else if (shownGame == 'feature') {
        $('#infoFavVehRace').fadeOut(1000);
    }
    $('#infoFavVehHoon').fadeIn(1000);
    shownGame = 'next'
}

function showPrevious() {

    $('div#TripleBarDefault').show();
    $('div#TripleBarFriends').hide();
    $('div#TripleBarLegends').hide();
    $('.tb_featureGame').hide();
    $('.tb_nextGame').hide();
    $('.tb_previousGame').show();

    $('.imageSlider .slider').animate({ left: '0' }, sliderSpeed);
    $('.carStats .button div').hide();
    $('.carStats .showPreviousGame .hoonigan').show();
    $('.carStats .showNextGame .race').show();

    $('.carTable .carStat').hide();
    $('.carTable .carStat.demolition').fadeIn(1000);
    $('.TripleBar').hide();
    $('#TripleBarDemolition').fadeIn(1000);

    if (shownGame == 'next') {
        $('#infoFavVehHoon').fadeOut(1000);
    }
    else if (shownGame == 'feature') {
        $('#infoFavVehRace').fadeOut(1000);
    }
    $('#infoFavVehDemo').fadeIn(1000);
    shownGame = 'previous'
}

function showFeature() {

    $('div#TripleBarDefault').show();
    $('div#TripleBarFriends').hide();
    $('div#TripleBarLegends').hide();
    $('.tb_nextGame').hide();
    $('.tb_previousGame').hide();
    $('.tb_featureGame').show();
    $('.imageSlider .slider').animate({ left: 1224 * -1 }, sliderSpeed);
    $('.carStats .button div').hide();
    $('.carStats .showPreviousGame .demolition').show();
    $('.carStats .showNextGame .hoonigan').show();

    $('.carTable .carStat').hide();
    $('.carTable .carStat.race').fadeIn(1000);
    $('.TripleBar').hide();
    $('#TripleBarRace').fadeIn(1000);

    if (shownGame == 'next') {
        $('#infoFavVehHoon').fadeOut(1000);
    }
    else if (shownGame == 'previous') {
        $('#infoFavVehDemo').fadeOut(1000);
    }
    $('#infoFavVehRace').fadeIn(1000);
    shownGame = 'feature'
}

$(function () { showFeature(); });

$(function () {
    $(".showNextGame").click(function () {
        if (shownGame == 'feature') {
            showNext();
        }
        else {
            if (shownGame == 'next') {
                showPrevious();
            }
            else {
                showFeature();
            }
        }
    });
    $(".showPreviousGame").click(function () {
        if (shownGame == 'feature') {
            showPrevious();
        }
        else {
            if (shownGame == 'previous') {
                showNext();
            }
            else {
                showFeature();
            }
        }
    });
});

$(document).ready(function () {
    $("div.TripleBar").each(function (i) {
        $(this).find('.rightBox .scoreBox').hide();
        $($(this).find('.rightBox .scoreBox')[0]).show();
    });

    var rotationInterval = setInterval(rotateCommunityScores, 5000);

    $('.navigation ul li').click(function () {
        //show the corrosponding scorebox
        clearInterval(rotationInterval);
        $(this).parentsUntil('.TripleBar').find('.scoreBox').hide();
        $($(this).parentsUntil('.TripleBar').children('.scoreBox')[$(this).index()]).fadeIn(2000);
        rotationInterval = setInterval(rotateCommunityScores, 5000);
    });
});

function rotateCommunityScores() {
    $("div.TripleBar").each(function (i) {
        if ($(this).find('.rightBox .scoreBox').length > 1) {
            showNextScoreBox($(this).find('.rightBox'));
        }
    });
}

function showNextScoreBox(container) {
    var c = container.children('.scoreBox').length;
    var current = $(container).find('.scoreBox:visible');

    if (current.length == 0) {
        //show first
        $(container).find('.scoreBox').hide();
        $(container.children('.scoreBox')[0]).fadeIn(2000);
    }
    else {
        var next = $(container).find('.scoreBox:visible + .scoreBox');
        if (next.length == 0) {
            //show first
            $(container).find('.scoreBox').hide();
            $(container.children('.scoreBox')[0]).fadeIn(2000);
        }
        else {
            $(container).find('.scoreBox').hide();
            next.fadeIn(2000);
        }
    }
}

function thisMovie(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    }
    else {
        return document[movieName];
    }
}