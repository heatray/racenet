    // Function to get the screen position of an object
    function getPositionX(object)
    {
        // Start at 0
        var left = 0;

        // Keep looking through parents until we run out
        while(object)
        {
            // Add the object's parent offect
            left += object.offsetLeft;

            // Move to the next parent
            object = object.offsetParent;
        }

        // Return the offset
        return left;
    }

    // Function to get the screen position of an object
    function getPositionY(object)
    {
        // Start at 0
        var top = 0;

        // Keep looking through parents until we run out
        while(object)
        {
            // Add the object's parent offect
            top += object.offsetTop;

            // Move to the next parent
            object = object.offsetParent;
        }

        // Return the top offset
        return top;
    }

    function setCookie(c_name, value, exdays)
    {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    function getCookieByName(cookieName)
    {
        var i,x,y,cookies = document.cookie.split(";");

        for( i = 0; i < cookies.length; ++i )
        {
            x = cookies[ i ].substr( 0, cookies[ i ].indexOf("="));
            y = cookies[ i ].substr( cookies[ i ].indexOf("=") + 1 );

            x = x.replace(/^\s+|\s+$/g,"");

            if( x == cookieName )
            {
                return unescape(y);
            }
        }

        return 0;
    }

    function scaleTextToFix(resizerId, display, desired_width) {
        $('<span />', { id: 'hidden-resizer' }).hide().appendTo(document.body);
        var resizer = $('#hidden-resizer');
        var displayNamePanel = $(display);

        resizer.css("font-size", displayNamePanel.css("font-size"));
        resizer.css("font-family", displayNamePanel.css("font-family"));
        resizer.css("letter-spacing", displayNamePanel.css("letter-spacing"));
        resizer.css("white-space", "nowrap" );

        if (displayNamePanel.size() <= 0) {
            return;
        }
     
        resizer[0].innerHTML = displayNamePanel[0].innerHTML;

        var size;
        var loopCounter = 0;
        var width = resizer.width();
        while ((resizer.width() > desired_width) && loopCounter < 50) {
            width = resizer.width();
            size = parseInt(resizer.css("font-size"), 10);
            resizer.css("font-size", size - 1);
            resizer[0].innerHTML = displayNamePanel[0].innerHTML;
            loopCounter++;
        }
        displayNamePanel.css("font-size", resizer.css("font-size"));
        $('span').remove('#hidden-resizer');
    }

    // Add a separation to the number
    function convertToSeperatedNumber(nStr, delimitingCharacter) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + delimitingCharacter + '$2');
        }
        return x1 + x2;
    }

    function buildHtml( tag, content, attr )
    {
        var res = "<" + tag;

        if( typeof(content) == 'object')
        {
            attr = content;
            content = null;
        }
        
        for( a in attr )
        {
            if( attr[a] === false ) continue;
            res += ' ' + a + '="' + attr[a] + '"';
        }
        
        res += '>';

        if( content != null )
        {
                res += content;
        }

        res = res + "</" + tag + ">";
        return res;
    }


    function EncodeQueryData(data)
    {
       var ret = [];
       for( var d in data )
       {
          ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
       }
       return ret.join("&");
   }

   $(window).on("load", function () {
       var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
       setCookie("devicePixelRatio", pixelRatio, 30);
   });