<?php
/**
 * MODX Revolution
 *
 * Copyright 2006-2012 by MODX, LLC.
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @package modx
 */
/**
 * A lightweight but flexible class which profiles waiting times in a request.
 *
 * @package modx
 */
class modProfiler {
    /**
     * A reference to the modX instance
     * @var modX $modx
     */
    public $modx= null;

    public $startTime = 0;
    public $enabled = false;

    public $timing = array();

    public $currentNode = '';
    public $parentNodes = array();
    public $profileData = array();
    public $translit = array();

    const VIEW_CHRONOLOGICAL = 'chronological';
    const VIEW_HIERARCHICAL = 'hierarchical';

    /**
     * @param xPDO $modx A reference to the modX|xPDO instance
     * @param array $options
     */
    function __construct(xPDO &$modx, array $options = array()) {
        $this->modx =& $modx;

        if (isset($options['enabled']) && !empty($options['enabled'])) {
            $this->enabled = true;
        }

        /* Collect all relevant request data and register the core/init action */
        $data = array(
            'request' => $_SERVER['REQUEST_URI'],
            'http_host' => $_SERVER['HTTP_HOST'],
            'payload' => array(
                'get' => array(),
                'post' => array(),
            ),
        );
        if (!empty($_GET)) $data['payload']['get'] = $_GET;
        if (!empty($_POST)) $data['payload']['post'] = $_POST;

        if ($this->enabled) {
            $this->startProfile('init', 'core', $data, $this->modx->startTime);
            $profilerId = $this->startProfile('profiler/ready');
            $this->stopProfile($profilerId);
        }
    }

    public function startProfile($action = '', $namespace = 'core', array $data = array(), $time = 0) {
        if (!$this->enabled) return null;

        /* Validate & set default parameters */
        if (empty($action)) $action = 'unspecified';
        if (empty($namespace)) $namespace = 'core';
        if (!is_numeric($time) || $time < 1) $time = microtime(true);

        $id = uniqid($namespace.'/'.$action);
        $this->translit[$id] = array(
            'namespace' => $namespace,
            'action' => $action
        );

        $this->profileData = array(
            'id' => $id,
            'namespace' => $namespace,
            'action' => $action,
            'start' => $time,
            'data' => $data,

            /* Set placeholder items */
            'end' => null,
            'duration' => null,
        );

        $this->_profileHierarchicalStart($namespace, $action, $id);
        $this->_profileChronologicalStart($id);
        return $id;
    }

    public function stopProfile($id, $data = array(), $time = 0) {
        if (!$this->enabled) return;
        if (!is_array($data)) $data = array($data);
        if (!is_numeric($time) || $time < 1) $time = microtime(true);

        $node = $this->translit[$id];
        $this->_profileHierarchicalStop($node['namespace'], $node['action'], $id, $time, $data);
        $this->_profileChronologicalStop($id, $time, $data);
    }

    protected function _profileChronologicalStart($id) {
        $this->timing[modProfiler::VIEW_CHRONOLOGICAL][$id] = $this->profileData;
    }

    protected function _profileHierarchicalStart($namespace, $action, $id) {
        $pn =& $this->timing[modProfiler::VIEW_HIERARCHICAL];
        if (!isset($pn[$namespace])) $pn[$namespace] = array();
        if (!isset($pn[$namespace][$action])) $pn[$namespace][$action] = array();
        $pn[$namespace][$action][$id] = $this->profileData;
    }

    protected function _profileChronologicalStop($id, $end = 0, array $data = array()) {
        $node = $this->timing[modProfiler::VIEW_CHRONOLOGICAL][$id];
        $node['end'] = $end;
        $node['duration'] = $node['end'] - $node['start'];
        $node['data'] = array_merge($node['data'], $data);
        $this->timing[modProfiler::VIEW_CHRONOLOGICAL][$id] = $node;
    }

    protected function _profileHierarchicalStop($namespace, $action, $id ,$end = 0, array $data = array()) {
        $pn =& $this->timing[modProfiler::VIEW_HIERARCHICAL];

        $node = $pn[$namespace][$action][$id];
        $node['end'] = $end;
        $node['data'] = array_merge($node['data'], $data);
        $pn[$namespace][$action][$id] = $this->profileData;
    }


}
