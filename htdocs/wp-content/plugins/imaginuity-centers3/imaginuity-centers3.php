<?php

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*
Plugin Name: Imaginuity Centers 3
Plugin URI: http://imaginuity.com
Description:  Imaginuity Centers 3 is the retail center platform for Imaginuity. It is built to house information on a wide range of retail entities including, but not limited to, shopping malls, outlet malls, grocery anchored shopping chains, and lifestyle centers. It is built on ReactJS. This plugin is required to run the platform.
Version: 1.2.1
Author: Alex Patton
*/

if ( !defined( 'WP_CONTENT_URL' ) ) {
    define( 'WP_CONTENT_URL', get_option( 'siteurl' ) . '/wp-content' );
}
if ( !defined( 'WP_CONTENT_DIR' ) ) {
    define( 'WP_CONTENT_DIR', ABSPATH . 'wp-content' );
}
if ( !defined( 'WP_PLUGIN_URL' ) ) {
    define( 'WP_PLUGIN_URL', WP_CONTENT_URL . '/plugins' );
}
if ( !defined( 'WP_PLUGIN_DIR' ) ) {
    define( 'WP_PLUGIN_DIR', WP_CONTENT_DIR . '/plugins' );
}
if ( !defined( 'IC3_DIR' ) ) {
    define( 'IC3_DIR', WP_PLUGIN_DIR . '/imaginuity-centers3/' );
}
if ( !defined( 'IC3_URL' ) ) {
    define( 'IC3_URL', WP_PLUGIN_URL . '/imaginuity-centers3/' );
}

require_once(IC3_DIR . 'php/ic3_functions.php');

$ic3Func = new ic3_functions();