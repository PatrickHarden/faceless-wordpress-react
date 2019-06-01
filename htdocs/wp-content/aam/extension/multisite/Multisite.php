<?php

/**
 * ======================================================================
 * LICENSE: This file is subject to the terms and conditions defined in *
 * file 'license.txt', which is part of this source code package.       *
 * ======================================================================
 */

/**
 * AAM Multisite extension
 *
 * @package AAM
 * @author Vasyl Martyniuk <vasyl@vasyltech.com>
 */
class AAM_Multisite {

    /**
     * Instance of itself
     * 
     * @var AAM_PlusPackage 
     * 
     * @access private
     */
    private static $_instance = null;

    /**
     * Initialize the extension
     * 
     * @return void
     * 
     * @access protected
     */
    protected function __construct() {
        if (is_admin()) {
            if (is_network_admin()) {
                add_action('aam-sidebar-ui-action', array($this, 'getSidebar'));
                //print required JS & CSS
                add_action('admin_print_scripts', array($this, 'printJavascript'));
            }
            
            //add custom ajax handler
            add_filter('aam-ajax-filter', array($this, 'ajax'), 10, 3);
            
            //add another option to the AAM Utilities extension
            add_action('aam-utility-option-list-filter', array($this, 'utilityList'));
        }
        
        if (is_multisite()) {
            add_action('wp', array($this, 'wp'), 999);
        }
    }
    
    /**
     * 
     */
    public function wp() {
        $manage = apply_filters('aam-utility-property', 'ms-member-access', false);
        
        if (!is_main_site() && $manage) { //there is no way to restrict main site
            if (!is_user_member_of_blog()) {
                AAM_Core_API::reject('frotend', array('hook' => 'blog_access'));
            }
        }
    }
    
    /**
     * 
     */
    public function utilityList($list) {
        $list['ms-member-access'] = array(
            'title' => __('Multisite None-Member Restriction', AAM_KEY),
            'descr' => __('Restrict access to site for users that are not members of the site.', AAM_KEY),
            'value' => AAM_Core_Config::get('ms-member-access', false)
        );
        /**
         * TODO - Work on this after AAM 4.0
        $list['ms-sync'] = array(
            'title' => __('Multisite Settings Synchronization', AAM_KEY),
            'descr' => __('Sync all access settings expect Posts & Pages across all sites.', AAM_KEY),
            'value' => AAM_Core_Config::get('ms-sync', false)
        );
        **/
        return $list;
    }

    /**
     * Render sidebar
     * 
     * @param string $position
     * 
     * @return void
     * 
     * @access public
     */
    public function getSidebar($position) {
        if ($position == 'top') {
            require_once(dirname(__FILE__) . '/view/sidebar.phtml');
        }
    }

    /**
     * Print javascript libraries
     *
     * @return void
     *
     * @access public
     */
    public function printJavascript() {
        if (AAM::isAAM()) {
            $baseurl = $this->getBaseurl('/js');
            wp_enqueue_script(
                    'aam-ms', $baseurl . '/multisite.js', array('aam-main')
            );
            
            $localization = array('current' => get_current_blog_id());
            wp_localize_script('aam-ms', 'aamMultisite', $localization);
        }
    }

    /**
     * Get extension base URL
     * 
     * @param string $path
     * 
     * @return string
     * 
     * @access protected
     */
    protected function getBaseurl($path = '') {
        $contentDir = str_replace('\\', '/', WP_CONTENT_DIR);
        $baseDir = str_replace('\\', '/', dirname(__FILE__));
        
        $relative = str_replace($contentDir, '', $baseDir);
        
        return content_url() . $relative . $path;
    }

    /**
     * Custom ajax handler
     * 
     * @param mixed            $response
     * @param AAM_Core_Subject $subject
     * @param string           $action
     * 
     * @return string
     * 
     * @access public
     */
    public function ajax($response, $subject, $action) {
        if ($action == 'Multisite.getTable') {
            $response = $this->getTable();
        }

        return $response;
    }

    /**
     * Get site list
     * 
     * @return string JSON Encoded site list
     * 
     * @access protected
     */
    protected function getTable() {
        //retrieve list of users
        $sites = wp_get_sites(array(
            'limit' => AAM_Core_Request::request('length'),
            'offset' => AAM_Core_Request::request('start'),
        ));
        
        $response = array(
            'recordsTotal'    => get_blog_count(),
            'recordsFiltered' => get_blog_count(),
            'draw'            => AAM_Core_Request::request('draw'),
            'data'            => array(),
        );
        
        $sub = defined('SUBDOMAIN_INSTALL') && SUBDOMAIN_INSTALL ? 1 : 0;

        foreach ($sites as $site) {
            $details = get_blog_details($site['blog_id']);
            $main    = is_main_site($site['blog_id']) ? 1 : 0;
            
            if ($sub && !$main) {
                $url = get_admin_url($site['blog_id'], 'admin.php?page=aam');
            } else {
                $url = get_admin_url($site['blog_id'], 'index.php');
            }
            
            $response['data'][] = array(
                $site['blog_id'],
                $url,
                get_admin_url($site['blog_id'], 'admin-ajax.php'),
                $details->blogname,
                'manage',
                $main,
                ($sub && !$main ? 1 : 0)
            );
        }

        return json_encode($response);
    }

    /**
     * Bootstrap the extension
     * 
     * @return AAM_PlusPackage
     * 
     * @access public
     */
    public static function bootstrap() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self;
        }

        return self::$_instance;
    }

}