<!DOCTYPE HTML>

<html xmlns="http://www.w3.org/1999/xhtml" {if $_config.manager_direction EQ 'rtl'}dir="rtl"{/if}
      lang="{$_config.manager_lang_attribute}"
      xml:lang="{$_config.manager_lang_attribute}"{if $_config.manager_html5_cache EQ 1}
      manifest="{$_config.manager_url}cache.manifest.php"{/if}>
<head>
    <title>{if $_pagetitle}{$_pagetitle} | {/if}{$_config.site_name}</title>
    <meta http-equiv="Content-Type" content="text/html; charset={$_config.modx_charset}"/>

{if $_config.manager_favicon_url}
    <link rel="shortcut icon" type="image/x-icon" href="{$_config.manager_favicon_url}"/>{/if}

{if $_config.compress_css}
    <link rel="stylesheet" type="text/css"
          href="{$_config.manager_url}min/index.php?f={$_config.manager_url}templates/default/css/structure.css,{$_config.manager_url}templates/default/css/style.css"/>
    {else}
    <link rel="stylesheet" type="text/css" href="{$_config.manager_url}templates/default/css/structure.css"/>
    <link rel="stylesheet" type="text/css" href="{$_config.manager_url}templates/default/css/style.css"/>

    <link rel="stylesheet" type="text/css" href="{$_config.manager_url}assets/kendoui/src/styles/kendo.common.css"/>
    <link rel="stylesheet" type="text/css" href="{$_config.manager_url}assets/kendoui/src/styles/kendo.default.css"/>
{/if}

{if $_config.compress_js}
    <script src="{$_config.manager_url}assets/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>
    {else}
    <script src="{$_config.manager_url}assets/jquery/jquery-1.8.3.js" type="text/javascript"></script>
    <script src="{$_config.manager_url}assets/core/modx.js" type="text/javascript"></script>
    <script src="{$_config.manager_url}assets/core/modx.state.js" type="text/javascript"></script>

    <script src="{$_config.manager_url}assets/kendoui/src/js/kendo.web.js" type="text/javascript"></script>
    <script src="{$_config.manager_url}assets/kendoui/src/js/kendo.tabstrip.js" type="text/javascript"></script>
{/if}

    <script src="{$_config.connectors_url}lang.js.php?ctx=mgr&topic=topmenu,file,resource,{$_lang_topics}&action={$smarty.get.a|strip_tags}"
            type="text/javascript"></script>
    <script src="{$_config.connectors_url}layout/modx.config.js.php?action={$smarty.get.a|strip_tags}{if $_ctx}&wctx={$_ctx}{/if}"
            type="text/javascript"></script>

{$maincssjs}
{foreach from=$cssjs item=scr}
    {$scr}
{/foreach}
</head>
<body>
<div id="modx-top">
    <div id="modx-top-meta">
        <p id="modx-top-meta-right">
        {if $canChangeProfile}<a class="modx-user-profile" href="?a={$profileAction}">{$username}</a>
            {else}<span class="modx-user-profile">{$username}</span>
        {/if}

        {if $canLogout}<a class="modx-logout" href="javascript:;" onclick="MODx.logout();">{$_lang.logout}</a>{/if}

            <a class="modx-attribution" href="http://modx.com/" onclick="window.open(this.href); return false;">
                <img src="templates/default/images/style/modx-logo-header.png" alt="Powered by MODX"/>
            </a>
        </p>

        <p id="modx-top-meta-left">
        {$_config.site_name}<br/>
            <span>MODX Revolution {$_config.settings_version} ({$_config.settings_distro})</span>
        </p>
    </div>

    <div id="modx-top-menu">
        <ul id="modx-top-menu-first">
        {$navb}
        </ul>
    </div>
</div>

<div id="modx-container">

    <div id="modx-sidebar">
        <div id="modx-sidebar-tabs" data-role="tabs" data-active="{$_state.modx-sidebar-tabs}">
            <ul>
                <li>{$_lang.resources}</li>
                <li>{$_lang.elements}</li>
                <li>{$_lang.files}</li>
            </ul>

            <!-- Resources tab -->
            <div>
                <ul>
                    <li>Home</li>
                    <li>About us
                        <ul>
                            <li>Services</li>
                            <li>Vision &amp; Values</li>
                            <li>Team</li>
                        </ul>
                    </li>
                    <li>Contact</li>
                </ul>
            </div>

            <!-- Elements tab -->
            <div>
                <ul>
                    <li>{$_lang.templates}</li>
                    <li>{$_lang.template_variables}</li>
                    <li>{$_lang.chunks}</li>
                    <li>{$_lang.snippets}</li>
                    <li>{$_lang.plugins}</li>
                    <li>{$_lang.categories}</li>
                </ul>
            </div>

            <!-- Files  tab -->
            <div>
                <ul>
                    <li>assets/</li>
                    <li>connectors/</li>
                    <li>core/</li>
                    <li>manager/</li>
                    <li>.htaccess</li>
                    <li>config.core.php</li>
                    <li>index.php</li>
                </ul>
            </div>

        </div>

    </div>
    <div id="modx-content">
