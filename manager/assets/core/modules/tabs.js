"use strict";
/**
 * MODX.modules.Tabs
 * A tabs module, using the Kendo UI (web) TabStrip widget.
 */
(function( MODX ){
    var $ = MODX.jQuery;
    MODX.modules.Tabs = {};
    $.extend(MODX.modules.Tabs, MODX.modules.Base, {
        selector: 'div[data-role=tabs]',
        defaultOptions: {
            stateful: true,
            statefulDefault: 0
        },
        iterate: function (element, options) {
            /**
             * Handle stateful tabs. With stateful tabs, the open tab is stored
             * in the state modRegistry through AJAX and the right tab is opened
             * when booting up the tab.
             */
            var id = element.attr('id');
            if (options.stateful && (id.length > 0)) {
                /* Get last active tab */
                var active = MODX.State.get(id);
                if (active == undefined) {
                    active = options.statefulDefault;
                }

                /**
                 * Add the k-state-active class to the active tab. Kendo TabStrip
                 * requires this to show a tab when rendering the page.
                 */
                var activeTab = element.find('ul > li')[active];
                $(activeTab).addClass('k-state-active');

                options.activate = function(e) {
                    MODX.State.set(id, $(e.item).index());
                };
            }

            element.kendoTabStrip(options);
        }
    });
})( MODX );
