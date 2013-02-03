"use strict";
(function( MODX ){
    var data = {};
    MODX.State = {
        set: function(key, value) {
            MODX.ajax('system/registry/register.php',{
                action: 'send',
                register: 'state',
                topic: '/ys/user-' + MODX.user.id + '/',
                message: '{"'+key+'":"'+value+'"}',
                message_format: 'json'
            }, {})
        },

        get: function(key, def) {
            def = def || undefined;
            if (data[key]) {
                return data[key];
            } else {
                return def;
            }
        },

        setData: function(stateData) {
            data = MODX.jQuery.extend(data, stateData);
        }
    };
})( MODX );
