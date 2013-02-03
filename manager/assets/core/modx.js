"use strict";

/**
 * jQuery-using MODX JavaScript API.
 * This API handles all the dynamic functionality you'll need to use within the MODX
 * manager and uses jQuery for a bunch of the heavy lifting.
 * @type {Object}
 */
var MODX = MODX || {};
MODX._construct = function(jQuery, MODX) {
    this.init = function() {
        this.jQuery = jQuery;
        this.initElements();
        this.setupAjax();
        this.State = this.State._construct(this);
        this.initGlobalListeners();
        this.setContainerHeight();
        this.autoLoadComponents();

        return this;
    };

    /**
     * Provide reference to jQuery. Use these instead of jQuery directly to aid
     * future testing and portability.
     */
    this.jQuery = jQuery;
    /**
     * Cache of commonly accessed elements.
     */
    this.elements = {};
    this.components = {
        tabStrips: {}
    };

    /**
     * Simple console.log wrapper which only logs if the console is available.
     * This prevents breaking javascript in older versions of IE and allows
     * more advanced logging methods in the future.
     *
     * If you want use a specific console method (the default is "log"), you can pass
     * it as the first parameter. The following are allowed:
     * - log
     * - debug
     * - info
     * - warn
     * - error
     */
    this.log = function() {
        var method = 'log';
        if (console) {
            for(var i=0; i<arguments.length; i++) {
                var val = arguments[i];
                if ((i == 0) && (-1 < this.jQuery.inArray(val, ['log','debug', 'info', 'warn', 'error']))) {
                    method = val;
                } else {
                    console[method](val);
                }
            }
        }
    },

    /**
     * Set up listeners for various core/global events affecting
     * the entire framework/manager.
     */
    this.initGlobalListeners = function() {
        this.elements.window.resize(function() {
            self.setContainerHeight()
        });
    };

    /**
     * Make certain elements available through a simple cache for best performance.
     */
    this.initElements = function() {
        this.elements.modxTop = this.jQuery('#modx-top');
        this.elements.modxContainer = this.jQuery('#modx-container');
        this.elements.window = this.jQuery(window);
    };

    this.setupAjax = function() {
        this.jQuery.ajaxSetup({
            headers: {
                'modAuth': this.auth,
                'Powered-By': 'MODX Revolution'
            }
        });
    };

    /**
     * Calculates the proper height for the #modx-container div to prevent scrolling
     * while filling 100% of the height.
     */
    this.setContainerHeight = function() {
        var windowHeight = this.elements.window.outerHeight();
        var topHeight = this.elements.modxTop.outerHeight();
        var containerHeight = windowHeight - topHeight;
        this.elements.modxContainer.css('height', containerHeight);
    };

    this.autoLoadComponents = function() {
        var that = this;

        /**
         * Auto initiate tabstrips
         */
        var tabStrips = this.jQuery('div[data-role=tabs]');
        this.jQuery.each(tabStrips, function() {
            var options = {};
            var tab = this;
            var $tab = that.jQuery(tab);

            /* Stateful tabs */
            var stateful = $tab.data('stateful');
            if (stateful) {
                /* Get current state */
                var active = that.State.get(tab.id);
                if (active == undefined) {
                    active = $tab.data('stateful-default') || 0;
                }

                var activeTab = $tab.find('ul > li')[active];
                that.jQuery(activeTab).addClass('k-state-active');

                options.activate = function(e) {
                    that.State.set(tab.id, $(e.item).index());
                };
            }

            $tab.kendoTabStrip(options);
        }, this);

        var displayTriggers = this.jQuery('[data-role=toggle]');
        this.jQuery.each(displayTriggers, function() {
            that.jQuery(this).click(function(event) {
                event.preventDefault();
                var el = $(this),
                    target = el.data('target'),
                    $target = that.jQuery(target),
                    animated = el.data('animated'),
                    hideTrigger = el.data('hide-trigger');
                animated = animated ? animated : true;
                hideTrigger = hideTrigger ? hideTrigger : false;

                if ($target) {
                    if (animated) {
                        $target.slideToggle();
                        if (hideTrigger) {
                            el.fadeOut();
                        }
                    }
                    /** Not animated */
                    else {
                        $target.toggle();
                        if (hideTrigger) {
                            el.hide();
                        }
                    }
                } else {
                    that.log('Toggle target not found. Trigger: ' + trigger + ' | Target: ' + target);
                }

            });
        }, this);
    };

    /**
     * Request data from MODX-style connector/processors using {jQuery.ajax}.
     *
     * @param connector
     * @param params
     * @param ajaxOptions
     * @return {*}
     * @constructor
     */
    this.ajax = function(connector, params, ajaxOptions) {
        params = params || {};
        ajaxOptions = this.extend(ajaxOptions,{
            data: params,
            type: 'POST'
        });


        var url = this.config.connectors_url;
        if (ajaxOptions.connectors_url) {
            url = ajaxOptions.connectors_url;
        }
        url = url + connector;
        return this.jQuery.ajax(url, ajaxOptions);
    };

    /**
     * Returns a recursively merged object.
     *
     * @see jQuery.extend
     * @param target
     * @param object
     * @return {*}
     */
    this.extend = function(target, object) {
        return this.jQuery.extend(true, target, object);
    };

    return this.init();
};


/**
 * Attempt to make testing during development somewhat easier by preventing
 * a bunch of errors that simply still need to get fixed.
 */

var Ext = {
    namespace: function() {},
    onReady: function() {}
};
var MODx = $.extend(true, Ext,{
    lang: {},
    config: {},
    load: function() {}
});
