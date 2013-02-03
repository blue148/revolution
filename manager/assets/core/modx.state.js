/**
 * MODX.State
 *
 * Adds modRegistry-based state handling. The current state is being set by the
 * modManagerController calling MODX.State.setData(state data);
 */
"use strict";
(function( MODX ){
    var $ = MODX.jQuery;

    /**
     * @type {Object}
     * @see MODX.State.get
     * @see MODX.State.setData
     */
    var data = {};

    /**
     * @type {Object}
     */
    MODX.State = {
        /**
         * Set a state to a certain key (ID). This uses {@see MODX.ajax) to store the
         * state in the modRegistry.
         *
         * @param key
         * @param value
         */
        set: function(key, value) {
            MODX.ajax('system/registry/register.php',{
                action: 'send',
                register: 'state',
                topic: '/ys/user-' + MODX.user.id + '/',
                message: '{"'+key+'":"'+value+'"}',
                message_format: 'json'
            }, {})
        },

        /**
         * Gets the value for a state. This requires the internal data variable to
         * be set with the states through MODX.State.setData.
         *
         * @param key
         * @param def
         * @return mixed
         */
        get: function(key, def) {
            def = def || undefined;
            if (data[key]) {
                return data[key];
            } else {
                return def;
            }
        },

        /**
         * Sets / appends the internal data param with the object provided.
         * @param stateData object
         */
        setData: function(stateData) {
            data = $.extend(data, stateData);
        }
    };
})( MODX );
