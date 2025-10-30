function SetCareerOverviewTierCookie(nTierID) {
    var cookieString = "CareerOverviewTier=";
    cookieString += nTierID
    cookieString += "; path=\/"
    var exdate = new Date();
    exdate.setFullYear(exdate.getFullYear() + 1);
    var expString = exdate.toUTCString();
    cookieString = cookieString + "; expires=" + expString;

    document.cookie = cookieString;
}

var oldScrollPos = 0;
$(function () {
    $(window).scroll(function () {
        var scrollPos = $('html, body').scrollTop();
        if (scrollPos < 500 && !(oldScrollPos < 500)) {
            oldScrollPos = scrollPos;
        }
        else if (scrollPos >= 500 && !(oldScrollPos >= 500)) {
            oldScrollPos = scrollPos;
        }
    });
});

function thisMovie(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    }
    else {
        return document[movieName];
    }
}