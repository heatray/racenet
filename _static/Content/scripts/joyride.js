function SetJoyrideCookie(nCompoundID)
{	
	var cookieString = "JoyrideCompound=";
    cookieString += nCompoundID    
    cookieString += "; path=\/"
    var exdate = new Date();
    exdate.setFullYear(exdate.getFullYear() + 1);
    var expString = exdate.toUTCString();
    cookieString = cookieString + "; expires=" + expString;
    
	document.cookie = cookieString;
}

var oldScrollPos = 0;
$(function () {
	$(window).scroll(function() {
		var scrollPos = $('html, body').scrollTop();
		if (scrollPos < 500 && !(oldScrollPos < 500) ) {
			oldScrollPos = scrollPos;
		}
		else if (scrollPos >= 500 && !(oldScrollPos >= 500)) {
			oldScrollPos = scrollPos;
		}
	});
});
