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
        var self = this;
        this.jQuery = jQuery;
        this.initElements();
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
            var tab = this;
            var $tab = that.jQuery(tab);
            var active = $tab.data('active');
            var activeLi = $tab.find('ul > li')[active];
            that.jQuery(activeLi).addClass('k-state-active');

            var options = {
                activate: function(e) {
                    that.State.set(tab.id, $(e.item).index());
                }
            };

            $tab.kendoTabStrip(options);
            that.components.tabStrips[tab.id] = $tab;
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
            headers: {
                'modAuth': this.config.auth,
                'Powered-By': 'MODX Revolution'
            },
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

$(document).on('ready', function() {
    MODX = MODX._construct(jQuery, MODX);
    MODX.State._construct(MODX);

    /**
     * Migrate stuff from MODx to MODX during development while connectors are untouched.
     * @type {*}
     */
    //MODX.extend(MODX, MODx);
});


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