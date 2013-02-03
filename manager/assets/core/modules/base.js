"use strict";
/**
 * MODX.modules.Base
 * Extend this module in your own modules.
 */
(function( MODX ){
    var $ = MODX.jQuery;
    MODX.modules.Base = {
        selector: '',
        defaultOptions: {},
        iterate: function (element, options) {},
        run: function() {
            var that = this;
            $(that.selector).each(function () {
                var el = $(this),
                    options = $.extend(that.defaultOptions, el.data());
                that.iterate(el, options);
            });
        }
    };
})( MODX );
