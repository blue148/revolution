/**
 * 
 * @class MODx.panel.AccessPolicy
 * @extends MODx.FormPanel
 * @param {Object} config An object of config properties
 * @xtype modx-panel-access-policy
 */
MODx.panel.AccessPolicy = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        url: MODx.config.connectors_url+'security/access/policy.php'
        ,baseParams: {
            action: 'update'
            ,id: MODx.request.id
        }
        ,id: 'modx-panel-access-policy'
		,cls: 'container form-with-labels'
        ,class_key: 'modAccessPolicy'
        ,plugin: ''
        ,bodyStyle: ''
        ,defaults: { collapsible: false ,autoHeight: true }
        ,items: [{
            html: '<h2>'+_('policy')+(config.record ? ': '+config.record.name : '')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
            ,id: 'modx-policy-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: {
				autoHeight: true
                ,border: true
				,bodyCssClass: 'tab-panel-wrapper'
            }
            ,forceLayout: true
            ,deferredRender: false
            ,items: [{
                title: _('policy')
                ,layout: 'form'
                ,items: [{
                    html: '<p>'+_('policy_desc')+'</p>'
					,bodyCssClass: 'panel-desc'
                    ,border: false
                },{
					xtype: 'panel'
					,border: false
					,cls:'main-wrapper'
					,layout: 'form'
					,labelAlign: 'top'
					,labelSeparator: ''
					,items: [{
						xtype: 'hidden'
						,name: 'id'
						,value: config.plugin
					},{
						xtype: 'textfield'
						,fieldLabel: _('name')+'<span class="required">*</span>'
						,description: MODx.expandHelp ? '' : _('policy_desc_name')
						,name: 'name'
						,maxLength: 255
						,enableKeyEvents: true
						,allowBlank: false
						,anchor: '100%'
						,listeners: {
							'keyup': {scope:this,fn:function(f,e) {
								Ext.getCmp('modx-policy-header').getEl().update('<h2>'+_('policy')+': '+f.getValue()+'</h2>');
							}}
						}
					},{
                        xtype: MODx.expandHelp ? 'label' : 'hidden'
                        ,forId: 'modx-policy-name'
                        ,html: _('policy_desc_name')
                        ,cls: 'desc-under'
                    },{
						xtype: 'textarea'
						,fieldLabel: _('description')
						,description: MODx.expandHelp ? '' : _('policy_desc_description')
						,name: 'description'
						,anchor: '100%'
						,grow: true
					},{
                        xtype: MODx.expandHelp ? 'label' : 'hidden'
                        ,forId: 'modx-policy-description'
                        ,html: _('policy_desc_description')
                        ,cls: 'desc-under'
                    },{
						xtype: 'textfield'
						,fieldLabel: _('lexicon')
						,description: MODx.expandHelp ? '' : _('policy_desc_lexicon')
						,name: 'lexicon'
						,allowBlank: true
						,anchor: '100%'
						,value: 'permissions'
					},{
                        xtype: MODx.expandHelp ? 'label' : 'hidden'
                        ,forId: 'modx-policy-lexicon'
                        ,html: _('policy_desc_lexicon')
                        ,cls: 'desc-under'
                    }]
                },{
                    html: '<p>'+_('permissions_desc')+'</p>'
					,bodyCssClass: 'panel-desc'
                    ,border: false
                },{
                    xtype: 'modx-tree-policy-permissions'
					,cls:'main-wrapper'
                    ,policy: MODx.request.id
                    ,autoHeight: true
                    ,preventRender: true
                }]
            }]
        }]
        ,listeners: {
            'setup': {fn:this.setup,scope:this}
            ,'success': {fn:this.success,scope:this}
            ,'beforeSubmit': {fn:this.beforeSubmit,scope:this}
        }
    });
    MODx.panel.AccessPolicy.superclass.constructor.call(this,config);
};
Ext.extend(MODx.panel.AccessPolicy,MODx.FormPanel,{
    initialized: false
    ,setup: function() {
        if (this.config.policy === '' || this.config.policy === 0) {
            this.fireEvent('ready');
            return false;
        }
        if (!this.initialized) {
            var r = this.config.record;
            this.getForm().setValues(r);

            this.fireEvent('ready');
            MODx.fireEvent('ready');
            this.initialized = true;
        }
    }
    ,beforeSubmit: function(o) {
        var g = Ext.getCmp('modx-tree-policy-permissions');
        var perms = {};
        if (g) {
            var i = 0;
            Ext.each(g.getChecked(),function(node) {
                perms[i] = { name: node.id, enabled: true };
                i++;
            });
        }
        Ext.apply(o.form.baseParams,{
            permissions: Ext.encode(perms)
        });
    }
    
    ,success: function(o) {
        Ext.getCmp('modx-tree-policy-permissions').refresh();
    }
});
Ext.reg('modx-panel-access-policy',MODx.panel.AccessPolicy);

MODx.tree.PolicyPermissions = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'modx-tree-policy-permissions'
        ,url: MODx.config.connectors_url+'security/access/index.php'
        ,action: 'policy/getattributes'
        ,baseParams: {
            id: config.policy
        }
        ,rootVisible: false
    });
    MODx.tree.PolicyPermissions.superclass.constructor.call(this, config);
};
Ext.extend(MODx.tree.PolicyPermissions,MODx.tree.Tree,{
    getMenu: function(node, event) {
        return [];
    }
});
Ext.reg('modx-tree-policy-permissions',MODx.tree.PolicyPermissions);


MODx.combo.AccessPolicyTemplate = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        name: 'template'
        ,hiddenName: 'template'
        ,fields: ['id','name','description']
        ,forceSelection: true
        ,typeAhead: false
        ,editable: false
        ,allowBlank: false
        ,listWidth: 300
        ,pageSize: 20
        ,url: MODx.config.connectors_url+'security/access/policy/template.php'
        ,tpl: new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item"><span style="font-weight: bold">{name}</span>'
            ,'<p style="margin: 0; font-size: 11px; color: gray;">{description}</p></div></tpl>')
    });
    MODx.combo.AccessPolicyTemplate.superclass.constructor.call(this,config);
};
Ext.extend(MODx.combo.AccessPolicyTemplate,MODx.combo.ComboBox);
Ext.reg('modx-combo-access-policy-template',MODx.combo.AccessPolicyTemplate);
