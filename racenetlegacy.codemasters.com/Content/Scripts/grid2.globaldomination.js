
(function ($) {
    var medals = window.Medals = {
        None: 0,
        Bronze: 1,
        Silver: 2,
        Gold: 3
    };

    var lookup = window.MedalLookup = {};
    for (var name in medals) {
        var value = medals[name];

        lookup[value] = name;
    }

    window.MedalClasses = (function () {
        var ret = {};
        ret[medals.Bronze] = "medal_bronze";
        ret[medals.Silver] = "medal_silver";
        ret[medals.Gold] = "medal_gold";
        return ret;
    })();
})(jQuery);