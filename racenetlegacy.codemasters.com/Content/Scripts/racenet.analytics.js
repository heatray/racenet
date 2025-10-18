(function ($) {
    if (window._cma.loaded)
        return window._cma;

    var cma = {
        loaded: true,
        url: window._cma_url,
        id: window._cma_id,

        handlers: {
            debug: function (x) { return { category: 'Debug', type: 'Debug', data: x }; },
            raw: function (x) { return x; },

            // Real handlers start here!
            basic: function (type, data) { return { category: 'WebAnalytic', type: type, data: data }; }
        },

        push: function () {
            var items = Array.prototype.slice.call(arguments);
            if (items.length > 0)
                $.ajax({
                    type: "POST",
                    url: cma.url,
                    contentType: 'application/json',
                    data: JSON.stringify({ id: cma.id, events: items.map(function (x) { return cma.handlers[x[0]].apply(cma, x.slice(1)); }) }),
                    dataType: 'json'
                });
        }
    };

    var queue = window._cma;
    window._cma = cma;

    cma.push.apply(null, queue);
    return cma;
})(jQuery);