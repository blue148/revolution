<?php
/**
 * @package modx
 * @subpackage sqlsrv
 */
$xpdo_meta_map['modAccessPermission']= array (
  'package' => 'modx',
  'version' => '1.1',
  'table' => 'access_permissions',
  'fields' => 
  array (
    'template' => 0,
    'name' => '',
    'description' => '',
    'value' => 1,
    'group' => 'group.uncategorized',
  ),
  'fieldMeta' => 
  array (
    'template' => 
    array (
      'dbtype' => 'int',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
      'index' => 'index',
    ),
    'name' => 
    array (
      'dbtype' => 'nvarchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'index',
    ),
    'description' => 
    array (
      'dbtype' => 'nvarchar',
      'precision' => 'max',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'value' => 
    array (
      'dbtype' => 'bit',
      'phptype' => 'boolean',
      'null' => false,
      'default' => 1,
    ),
    'group' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => 'group.uncategorized',
    ),
  ),
  'indexes' => 
  array (
    'template' => 
    array (
      'alias' => 'template',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'template' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'name' => 
    array (
      'alias' => 'name',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'name' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
  'aggregates' => 
  array (
    'Template' => 
    array (
      'class' => 'modAccessPolicyTemplate',
      'local' => 'template',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
