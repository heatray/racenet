var showFriend = 0;
var showTop = 0;
var tb_showMode = 0;
var tb_timer;
$(document).ready(function () {

    $('div#TripleBarDefault').show();
    $('div#TripleBarFriends').hide();
    $('div#TripleBarLegends').hide();
    $('div#TripleBarDefault .leftBox .scoreBox').hide();
    $('div#TripleBarDefault .rightBox .scoreBox').hide();
    $($('div#TripleBarDefault .leftBox .scoreBox')[showFriend]).fadeIn(1000);
    $($('div#TripleBarDefault .rightBox .scoreBox')[showTop]).fadeIn(1000);

    startTBTimer();

});

function showFriends() {
    $('div#TripleBarDefault').hide();
    $('div#TripleBarLegends').hide();

    $('div#TripleBarFriends').show();
    $('.rightBox .title, .middleBox .title').animate({ opacity: '0.01' }, 500);
    $('.leftBox .title').animate({ opacity: '1.0' }, 500);
    $('div#TripleBarFriends .letterBox').css({ width: '0%' });
    $('div#TripleBarFriends .letterBox').animate({
        width: '100%'
    }, 1000);
}

function showCommunity() {
    $('div#TripleBarDefault').hide();
    $('div#TripleBarFriends').hide();

    $('div#TripleBarLegends').show();
    $('.leftBox .title, .middleBox .title').animate({ opacity: '0.01' }, 500);
    $('.rightBox .title').animate({ opacity: '1.0' }, 500);
    $('div#TripleBarLegends .letterBox').css({ width: '0%' });
    $('div#TripleBarLegends .letterBox').animate({
        width: '100%'
    }, 1000);
}

function showDefault() {
    $('.letterBox').animate({
        width: '0%'
    }, 500, function () {
        $('div#TripleBarFriends').hide();
        $('div#TripleBarLegends').hide();

        $('div#TripleBarDefault').show();
        $('div#TripleBarDefault .middleBox .scoreBox, div#TripleBarDefault .rightBox .scoreBox').hide();
        
        $('.title').animate({ opacity: '1' }, 500);
        $('div#TripleBarDefault .middleBox .scoreBox').fadeIn(500);
        $($('div#TripleBarDefault .rightBox .scoreBox')[showFriend]).fadeIn(500);
        $($('div#TripleBarDefault .leftBox .scoreBox')[showTop]).fadeIn(500);
    });
}

function startTBTimer() {
    tb_timer = setInterval(function () {
        tb_showMode++;
        if (tb_showMode > 2) {
            tb_showMode = 0;
        }

        if (tb_showMode == 0) {
            showDefault();
        }
        else if (tb_showMode == 1) {
            showFriends();
        }
        else {
            showCommunity();
        }
    }, 5000);
}

$(function () {
    $("div.TripleBarContainer").mouseenter(function () {
        if (tb_showMode != 0) {
            showDefault();
            tb_showMode = 0;
        }
        clearInterval(tb_timer);
    });

    $("div.TripleBarContainer").mouseleave(function () {
        startTBTimer();
    });

});