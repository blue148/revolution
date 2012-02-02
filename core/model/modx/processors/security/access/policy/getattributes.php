<?php
/**
 * Gets the tree nodes for access policies.
 *
 * @package modx
 * @subpackage processors.security.access.policy.template
 */
/* @var modX $modx
 * @var array $scriptProperties
 * @var modAccessPolicy $policy
 */

/* Get the Policy */
if (empty($scriptProperties['id'])) return $modx->error->failure($modx->lexicon('access_policy_err_ns'));
$policy = $modx->getObject('modAccessPolicy',$scriptProperties['id']);
if (empty($policy)) return $modx->error->failure($modx->lexicon('access_policy_err_nf'));

/* Load the policy's lexicon for translations */
$lexicon = $policy->get('lexicon');
if (!empty($lexicon)) { $modx->lexicon->load($lexicon); }

/* Load permissions */
$permissions = $policy->getPermissions();

$treenodes = array();
$groups = array();

/* Loop over permissions to prepare a view per group (to allow sorting on group names later on) */
foreach ($permissions as $perm) {
    $permArray = array(
        'name' => $perm[0],
        'desc' => $perm[1],
        'active' => $perm[4],
        'group' => $perm[5],
    );

    $groupName = $modx->lexicon($permArray['group']);
    /* Make sure we have our group's config */
    if (!isset($groups[$groupName])) {
        $groups[$groupName] = array(
            'text' => $groupName,
            'cls' => 'folder',
            'children' => array()
        );
    }

    /* Add the policy to the group as a tree child node */
    $groups[$permArray['group']]['children'][] = array(
        'id' => $permArray['name'],
        'text' => $modx->lexicon($permArray['name']) . ' - ' . $modx->lexicon($permArray['desc']),
        'leaf' => true,
        'checked' => ($permArray['active']) ? true : false
    );
}

/* Sort on group names */
ksort($groups);

/* Prepare tree nodes */
$treenodes = array();
foreach ($groups as $groupName) {
    $treenodes[] = $groupName;
}

/* Return nodes for tree */
return $modx->toJSON($treenodes);
