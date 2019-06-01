<?php

/**
 * ======================================================================
 * LICENSE: This file is subject to the terms and conditions defined in *
 * file 'license.txt', which is part of this source code package.       *
 * ======================================================================
 */

if (defined('AAM_KEY') && !defined('AAM_MULTISITE')) {
    //define extension constant as it's version #2
    define('AAM_MULTISITE', '2.3.1');

    //register activate and extension classes
    $basedir = dirname(__FILE__);
    AAM_Autoloader::add('AAM_Multisite', $basedir . '/Multisite.php');

    AAM_Multisite::bootstrap();
}