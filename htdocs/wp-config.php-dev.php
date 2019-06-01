<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
//define('DB_NAME', 'centers3_platform_db');
define('DB_NAME', 'centers3_wp_db');

/** MySQL database username */
define('DB_USER', 'centers3_user');

/** MySQL database password */
define('DB_PASSWORD', 'C3nt3rs3');

/** MySQL hostname */
define('DB_HOST', 'imag-vpc-rds-mysql01.cg28j6fwhhqk.us-east-1.rds.amazonaws.com');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'U:a1!2$76P$.#pTr]qfK9(i#QUl+gu+Lq)V bMLBE~MV%{jC<3iv+<W22oBh!7}^');
define('SECURE_AUTH_KEY',  'N})c,?ipLOOO-+P;#bi%= Vq=6$fFmTEA>7p{x3bR=RV%,r|zcc rt|C`u@)i#US');
define('LOGGED_IN_KEY',    'kZ!#,A#ljoka&0.o2k^NEO<r(Ar*,`;L)=>`,uTnl_>(zb%D@GG]p1>je-fnv@%8');
define('NONCE_KEY',        'VH?z;(69ppVXz0FH8tLt~/39eDaex;kTu<=U @ mpk?G+SX<x<&01O;*p2vm$7?y');
define('AUTH_SALT',        'lt QvAt{!}lPRiDS9jy%69mC0paWfg7nz+.3Zz+qbJp@m-t18.yO~tSFC$J/hq8m');
define('SECURE_AUTH_SALT', '[=&Rnk])bEGXG=4r?A*?l61dx+U(m$Z(~p}EiEyd(N?aL*^pe]D[:WoXqF`|jGt3');
define('LOGGED_IN_SALT',   '5#W5FhO$}OUoK24|9e7+-Hh;v{U0}<zSc^7U,tdj;4=wfW:G8T(L%T1:<:sB&ro-');
define('NONCE_SALT',       'x7{/qP4jr;R R# `*5&L<ub#T>G&xaxB7{VD`-G*0Hz|PZ9LbbqVEwOh7En.xsi+');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */

define('WP_ALLOW_MULTISITE', true);
define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', false);
//define('DOMAIN_CURRENT_SITE', '192.168.33.33');
define('DOMAIN_CURRENT_SITE', 'centers3.imag-dev.com');
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);


define('DISALLOW_FILE_EDIT',true);

/** WordPress memory limit (keep at or below php men limit) */
define('WP_MEMORY_LIMIT', '96M');


/** debugging */
/** WP_debugging */
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', true);

/** disable all auto updates: https://codex.wordpress.org/Configuring_Automatic_Background_Updates */
//define( 'AUTOMATIC_UPDATER_DISABLED', true );
/** auto updates: true, false, minor*/
define( 'WP_AUTO_UPDATE_CORE', false );


/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
define( 'SUNRISE', 'on' );
require_once(ABSPATH . 'wp-settings.php');

