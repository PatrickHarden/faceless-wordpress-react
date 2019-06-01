<?php
require('./wp-load.php');

if (!is_super_admin())
	wp_die('Permission Denied');

$option_mapping = array(
	array(
		'c2name' => 'logo',
		'c3name' => 'property_options_logo',
		'c3field' => 'field_57e04bb4aa109'
	),
	array(
		'c2name' => 'footerLogo',
		'c3name' => 'property_options_footer_logo',
		'c3field' => 'field_57e04c35aa10a'
	),
	array(
		'c2name' => 'copyrightName',
		'c3name' => 'property_options_copyright_name',
		'c3field' => 'field_57e04c45aa10b'
	),
	array(
		'c2name' => 'directory',
		'c3name' => 'property_options_printable_directory',
		'c3field' => 'field_57e04cb57566b'
	),
	array(
		'c2name' => 'map',
		'c3name' => 'property_options_map',
		'c3field' => 'field_57e04ea57566c'
	),
	array(
		'c2name' => 'facebook',
		'c3name' => 'property_options_facebook_url',
		'c3field' => 'field_57e04fac541b9'
	),
	array(
		'c2name' => 'twitter',
		'c3name' => 'property_options_twitter_url',
		'c3field' => 'field_57e04ff3541ba'
	),
	array(
		'c2name' => 'instagram',
		'c3name' => 'property_options_instagram_url',
		'c3field' => 'field_57e0500d541bc'
	),
	array(
		'c2name' => 'pinterest',
		'c3name' => 'property_options_pinterest_url',
		'c3field' => 'field_57e05000541bb'
	),
	array(
		'c2name' => 'email_signup_url_new',
		'c3name' => 'property_options_email_signup_url',
		'c3field' => 'field_58daa862cfbdc'
	),
	array(
		'c2name' => 'address1',
		'c3name' => 'property_options_address_1',
		'c3field' => 'field_57e05588bb415'
	),
	array(
		'c2name' => 'address2',
		'c3name' => 'property_options_address_2',
		'c3field' => 'field_57e056c6bb416'
	),
	array(
		'c2name' => 'city',
		'c3name' => 'property_options_city',
		'c3field' => 'field_57e05705bb417'
	),
	array(
		'c2name' => 'state',
		'c3name' => 'property_options_state',
		'c3field' => 'field_57e05722bb418'
	),
	array(
		'c2name' => 'zip',
		'c3name' => 'property_options_zip',
		'c3field' => 'field_57e05743bb419'
	),
	array(
		'c2name' => 'phone',
		'c3name' => 'property_options_phone',
		'c3field' => 'field_57e05768bb41a'
	),
	array(
		'c2name' => 'movie_listings_url',
		'c3name' => 'property_options_movies_url',
		'c3field' => 'field_58aca814cfbc9'
	),
//	array(
//		'c2name' => 'text_page_id',
//		'c3name' => 'property_options_mobile_signup_url',
//		'c3field' => 'field_58aca862cfbca'
//	),
	array(
		'c2name' => 'bestEntrance',
		'c3name' => 'property_options_best_entrance_icon',
		'c3field' => 'field_58c05c89e7840'
	),
	array(
		'c3name' => 'property_options_property_type',
		'c3field' => 'field_58b755bfe623e',
		'new_value' => 'regional'
	)
);
// Hours
$hours_mapping = array(
	array(
		'c2name' => 'imag_hours_week_special_instructions',
		'c3name' => 'property_options_standard_hours_0_special_instructions',
		'c3field' => 'field_57e05a27eee82'
	),
	array(
		'c2name' => 'sh_new',
		'c3name' => 'property_options_standard_hours',
		'c3field' => 'field_57e059cfeee81',
		'new_value' => 1
	)
);

$hours_week_mapping = array(
	array(
		'c2name' => 'imag_hours_week_1_start',
		'c3name' => 'property_options_standard_hours_0_monday_open',
		'c3field' => 'field_57e05af6eee83'
	),
	array(
		'c2name' => 'imag_hours_week_1_end',
		'c3name' => 'property_options_standard_hours_0_monday_close',
		'c3field' => 'field_57e05b5feee84'
	),
	array(
		'c2name' => 'sh_week_0_monday_closed_new',
		'c3name' => 'property_options_standard_hours_0_monday_closed',
		'c3field' => 'field_57e05b7feee85'
	),
	array(
		'c2name' => 'imag_hours_week_2_start',
		'c3name' => 'property_options_standard_hours_0_tuesday_open',
		'c3field' => 'field_57e05dee252ea'
	),
	array(
		'c2name' => 'imag_hours_week_2_end',
		'c3name' => 'property_options_standard_hours_0_tuesday_close',
		'c3field' => 'field_57e05dec252e9'
	),
	array(
		'c2name' => 'sh_week_0_tuesday_closed_new',
		'c3name' => 'property_options_standard_hours_0_tuesday_closed',
		'c3field' => 'field_57e05def252eb'
	),
	array(
		'c2name' => 'imag_hours_week_3_start',
		'c3name' => 'property_options_standard_hours_0_wednesday_open',
		'c3field' => 'field_57e05ec2c358a'
	),
	array(
		'c2name' => 'imag_hours_week_3_end',
		'c3name' => 'property_options_standard_hours_0_wednesday_close',
		'c3field' => 'field_57e05ec5c358b'
	),
	array(
		'c2name' => 'sh_week_0_wednesday_closed_new',
		'c3name' => 'property_options_standard_hours_0_wednesday_closed',
		'c3field' => 'field_57e05ebec3589'
	),
	array(
		'c2name' => 'imag_hours_week_4_start',
		'c3name' => 'property_options_standard_hours_0_thursday_open',
		'c3field' => 'field_57e05fb999361'
	),
	array(
		'c2name' => 'imag_hours_week_4_end',
		'c3name' => 'property_options_standard_hours_0_thursday_close',
		'c3field' => 'field_57e05fbd99362'
	),
	array(
		'c2name' => 'sh_week_0_thursday_closed_new',
		'c3name' => 'property_options_standard_hours_0_thursday_closed',
		'c3field' => 'field_57e05fb699360'
	),
	array(
		'c2name' => 'imag_hours_week_5_start',
		'c3name' => 'property_options_standard_hours_0_friday_open',
		'c3field' => 'field_57e060826d8d0'
	),
	array(
		'c2name' => 'imag_hours_week_5_end',
		'c3name' => 'property_options_standard_hours_0_friday_close',
		'c3field' => 'field_57e060856d8d1'
	),
	array(
		'c2name' => 'sh_week_0_friday_closed_new',
		'c3name' => 'property_options_standard_hours_0_friday_closed',
		'c3field' => 'field_57e0607c6d8cf'
	),
	array(
		'c2name' => 'imag_hours_week_6_start',
		'c3name' => 'property_options_standard_hours_0_saturday_open',
		'c3field' => 'field_57e060e6f1acc'
	),
	array(
		'c2name' => 'imag_hours_week_6_end',
		'c3name' => 'property_options_standard_hours_0_saturday_close',
		'c3field' => 'field_57e060e9f1acd'
	),
	array(
		'c2name' => 'sh_week_0_saturday_closed_new',
		'c3name' => 'property_options_standard_hours_0_saturday_closed',
		'c3field' => 'field_57e060e3f1acb'
	),
	array(
		'c2name' => 'imag_hours_week_0_start',
		'c3name' => 'property_options_standard_hours_0_sunday_open',
		'c3field' => 'field_57e0661ef8f8a'
	),
	array(
		'c2name' => 'imag_hours_week_0_end',
		'c3name' => 'property_options_standard_hours_0_sunday_close',
		'c3field' => 'field_57e05d9a9113d'
	),
	array(
		'c2name' => 'sh_week_0_sunday_closed_new',
		'c3name' => 'property_options_standard_hours_0_sunday_closed',
		'c3field' => 'field_57e05d5f9113b'
	)
);

//TODO: count exceptions
$hours_exception_week_mapping = array(
	array(
		'c2name' => 'imag_hours_a_week_start',
		'c3name' => 'property_options_alternate_hours_0_start_date',
		'c3field' => 'field_57e06364a4d13'
	),
	array(
		'c2name' => 'imag_hours_a_week_end',
		'c3name' => 'property_options_alternate_hours_0_end_date',
		'c3field' => 'field_57e063f9a4d14'
	),
	array(
		'c2name' => 'imag_hours_a_week_special_instructions',
		'c3name' => 'property_options_alternate_hours_0_special_instructions',
		'c3field' => 'field_57e06249a4cfc'
	),
	array(
		'c2name' => 'imag_hours_a_week_1_start',
		'c3name' => 'property_options_alternate_hours_0_monday_open',
		'c3field' => 'field_57e06249a4d01'
	),
	array(
		'c2name' => 'imag_hours_a_week_1_end',
		'c3name' => 'property_options_alternate_hours_0_monday_close',
		'c3field' => 'field_57e06249a4d02'
	),
	array(
		'c2name' => 'ah_a_week_1_monday_closed_new',
		'c3name' => 'property_options_alternate_hours_0_monday_closed',
		'c3field' => 'field_57e06249a4d00'
	),
	array(
		'c2name' => 'imag_hours_a_week_2_start',
		'c3name' => 'property_options_alternate_hours_0_tuesday_open',
		'c3field' => 'field_57e06249a4d04'
	),
	array(
		'c2name' => 'imag_hours_a_week_2_end',
		'c3name' => 'property_options_alternate_hours_0_tuesday_close',
		'c3field' => 'field_57e06249a4d05'
	),
	array(
		'c2name' => 'ah_a_week_1_tuesday_closed_new',
		'c3name' => 'property_options_alternate_hours_0_tuesday_closed',
		'c3field' => 'field_57e06249a4d03'
	),
	array(
		'c2name' => 'imag_hours_a_week_3_start',
		'c3name' => 'property_options_alternate_hours_0_wednesday_open',
		'c3field' => 'field_57e06249a4d07'
	),
	array(
		'c2name' => 'imag_hours_a_week_3_end',
		'c3name' => 'property_options_alternate_hours_0_wednesday_close',
		'c3field' => 'field_57e06249a4d08'
	),
	array(
		'c2name' => 'ah_a_week_1_wednesday_closed_new',
		'c3name' => 'property_options_alternate_hours_0_wednesday_closed',
		'c3field' => 'field_57e06249a4d06'
	),
	array(
		'c2name' => 'imag_hours_a_week_4_start',
		'c3name' => 'property_options_alternate_hours_0_thursday_open',
		'c3field' => 'field_57e06249a4d0a'
	),
	array(
		'c2name' => 'imag_hours_a_week_4_end',
		'c3name' => 'property_options_alternate_hours_0_thursday_close',
		'c3field' => 'field_57e06249a4d0b'
	),
	array(
		'c2name' => 'ah_a_week_1_thursday_closed_new',
		'c3name' => 'property_options_alternate_hours_0_thursday_closed',
		'c3field' => 'field_57e06249a4d09'
	),
	array(
		'c2name' => 'imag_hours_a_week_5_start',
		'c3name' => 'property_options_alternate_hours_0_friday_open',
		'c3field' => 'field_57e06249a4d0d'
	),
	array(
		'c2name' => 'imag_hours_a_week_5_end',
		'c3name' => 'property_options_alternate_hours_0_friday_close',
		'c3field' => 'field_57e06249a4d0e'
	),
	array(
		'c2name' => 'ah_a_week_1_friday_closed_new',
		'c3name' => 'property_options_alternate_hours_0_friday_closed',
		'c3field' => 'field_57e06249a4d0c'
	),
	array(
		'c2name' => 'imag_hours_a_week_6_start',
		'c3name' => 'property_options_alternate_hours_0_saturday_open',
		'c3field' => 'field_57e06249a4d10'
	),
	array(
		'c2name' => 'imag_hours_a_week_6_end',
		'c3name' => 'property_options_alternate_hours_0_saturday_close',
		'c3field' => 'field_57e06249a4d11'
	),
	array(
		'c2name' => 'ah_a_week_1_saturday_closed_new',
		'c3name' => 'property_options_alternate_hours_0_saturday_closed',
		'c3field' => 'field_57e06249a4d0f'
	),
	array(
		'c2name' => 'imag_hours_a_week_0_start',
		'c3name' => 'property_options_alternate_hours_0_sunday_open',
		'c3field' => 'field_57e06249a4cfe'
	),
	array(
		'c2name' => 'imag_hours_a_week_0_end',
		'c3name' => 'property_options_alternate_hours_0_sunday_close',
		'c3field' => 'field_57e06249a4cff'
	),
	array(
		'c2name' => 'ah_a_week_1_sunday_closed_new',
		'c3name' => 'property_options_alternate_hours_0_sunday_closed',
		'c3field' => 'field_57e06249a4cfd'
	)
);

global $wpdb;

$sites = $wpdb->get_results('SELECT blog_id, path FROM wp_blogs', ARRAY_A);

$jll_post = get_page_by_path('jll', OBJECT, 'clients');


foreach ($sites as $site) {
	if ($site['blog_id'] == 1)
		continue;

	// run on a given mall only
	if (!empty($_GET['blog_id']) && $site['blog_id'] != $_GET['blog_id'])
		continue;

	switch_to_blog($site['blog_id']);

	$query = 'select option_value from wp_'. $site['blog_id'] .'_options where option_name = "imag_mall_options"';
	$res = $wpdb->get_results($query, ARRAY_A);

	if ($wpdb->last_error)
		die('DB error at '. __LINE__ .': '. $wpdb->last_error);

	if ($res != null) {
		$options = unserialize($res[0]['option_value']);


		// deleting old acf field values
		$del_array = array();
		foreach (array_merge($option_mapping, $hours_mapping, $hours_week_mapping) as $opt) {
			$del_array[] = $opt['c3name'];
			$del_array[] = '_' . $opt['c3name'];
		}

		foreach (array(0, 1, 2) as $centers3_week_id) {
			foreach ($hours_exception_week_mapping as $opt) {
				$del_array[] = str_replace('0', $centers3_week_id, $opt['c3name']);
				$del_array[] = '_' . str_replace('0', $centers3_week_id, $opt['c3name']);
			}
		}

		$del_query = 'DELETE FROM wp_' . $site['blog_id'] . '_options WHERE option_name = "' .
			implode('" OR option_name = "', $del_array) . '"';
		//echo $del_query;
		$res = $wpdb->get_results($del_query);

		if ($wpdb->last_error)
			die('DB error at ' . __LINE__);

		echo 'Updating wp_'. $site['blog_id'] .'_options...<br/>';

		// adding new acf field values
		foreach($option_mapping as $opt) {
			$name = "'". $opt['c3name'] ."'";
			$field_name = "'_". $opt['c3name'] ."'";
			$field_id = "'". $opt['c3field'] ."'";

			echo '<b>Old name</b>: '.$opt['c2name']."<br/>";
			echo '<b>New name</b>: '.$opt['c3name']."<br/>";

			if (in_array($opt['c2name'], array('facebook', 'twitter', 'instagram', 'pintrest'))) {
				$social_id = $options[$opt['c2name']];
				$res = $wpdb->get_results("select feed_meta from wp_autoblog where feed_id = ".$social_id);
				$feed_data = unserialize($res[0]->feed_meta);
				$val = "'". $feed_data['url'] ."'";
			}
			else if ($opt['c2name'] == 'email_signup_url_new') {
				$val = "'". get_site_url($site['blog_id'], '/mall-mail') ."'";
			}
//			else if(in_array($opt['c2name'], array('text_page_id'))){
//				$page_id = $options[$opt['c2name']];
//				$val = "'".get_permalink($page_id)."'";
//				echo'<b>TEXT_PAGE_ID</b>:'.$page_id."<br/>";
//			}
			else if(array_key_exists('new_value', $opt)) {
				$val = "'". $opt['new_value'] ."'";
			}
			else {
				$val = "'". $options[$opt['c2name']] ."'";
			}
			echo '<b>Value</b>: '.$val."<br/><br/>";

			$res = $wpdb->get_results("insert into wp_". $site['blog_id'] ."_options values (null, $name, $val, 'yes')");
			echo 'DB QUERY: '."insert into wp_". $site['blog_id'] ."_options values (null, $name, $val, 'yes')<br/>";

			$res = $wpdb->get_results("insert into wp_". $site['blog_id'] ."_options values (null, $field_name, $field_id, 'yes')");
			echo 'DB QUERY: '."insert into wp_". $site['blog_id'] ."_options values (null, $field_name, $field_id, 'yes')<br/>";

			if ($wpdb->last_error)
				die('DB error at '. __LINE__ .': '. $wpdb->last_error);
		}

		// mobile signup URL
		if (array_key_exists('text_page_id', $options) && !empty($options['text_page_id'])) {
			update_option('property_options_mobile_signup_url', get_site_url($site['blog_id'], '/mobile'));
			update_option('_property_options_mobile_signup_url', 'field_58aca862cfbca');
			echo 'updating mobile_signup_url on site'. $site['blog_id'] .' to '. get_site_url($site['blog_id'], '/mobile') .'<br/>';
		}

		// these few options should be the same on all centers
		update_option('property_options_show_border', array('header-border', 'footer-border'));
		update_option('_property_options_show_border', 'field_58d2c1c9717b0');
		update_option('property_options_theme_type', 'full-site');
		update_option('_property_options_theme_type', 'field_58dbdda2439de');

	}

	// Hours
	$res = $wpdb->get_results('select option_value from wp_'. $site['blog_id'] .'_options where option_name = "imag_hours"', ARRAY_A);

	if ($wpdb->last_error)
		die('DB error at '. __LINE__ .': '. $wpdb->last_error);

	if ($res != null) {
		$options = unserialize($res[0]['option_value']);

		echo 'Updating wp_' . $site['blog_id'] . '_options - hours ...<br/>';

		// adding new acf field values for hours options
		foreach ($hours_mapping as $opt) {
			$name = "'" . $opt['c3name'] . "'";
			$field_name = "'_" . $opt['c3name'] . "'";
			$field_id = "'" . $opt['c3field'] . "'";
			if (strpos($opt['c2name'], '_new') !== false)
				$val = $opt['new_value'] ? $opt['new_value'] : '';
			else
				$val = "'" . $options[$opt['c2name']] . "'";

			$res = $wpdb->get_results("insert into wp_". $site['blog_id'] ."_options values (null, $name, $val, 'yes')");
			$res = $wpdb->get_results("insert into wp_". $site['blog_id'] ."_options values (null, $field_name, $field_id, 'yes')");

			if ($wpdb->last_error)
				die('DB error at ' . __LINE__ .": ". $wpdb->last_error ."<br/>name: $name val: $val field_name: $field_name field_id: $field_id");

		}

		// adding new acf field values for hours each day
		$start = $end = '';
		foreach ($hours_week_mapping as $opt) {
			$name = "'" . $opt['c3name'] . "'";
			$field_name = "'_" . $opt['c3name'] . "'";
			$field_id = "'" . $opt['c3field'] . "'";

			if (strpos($opt['c2name'], '_start') !== false) {
				$start = $options[$opt['c2name']];
				if ($start == null || $start == '')
					continue;

				$val = "'" . to_24hr($start) . "'";
			} elseif (strpos($opt['c2name'], '_end') !== false) {
				$end = $options[$opt['c2name']];
				if ($end == null || $end == '')
					continue;

				$val = "'" . to_24hr($end) . "'";
			} elseif (strpos($opt['c2name'], '_closed_new') !== false) {
				if ($start == $end)
					$val = 1;
				else
					$val = 0;
			} else {
				$val = "'" . $options[$opt['c2name']] . "'";
			}

			$res = $wpdb->get_results("insert into wp_". $site['blog_id'] ."_options values (null, $name, $val, 'yes')");
			$res = $wpdb->get_results("insert into wp_". $site['blog_id'] ."_options values (null, $field_name, $field_id, 'yes')");

			if ($wpdb->last_error)
				die('DB error at ' . __LINE__ .": ". $wpdb->last_error ."<br/>name: $name val: $val field_name: $field_name field_id: $field_id");
		}
	}

	// Exception Hours
	$res = $wpdb->get_results('select option_value from wp_'. $site['blog_id'] .'_options where option_name = "imag_hours_exceptions"', ARRAY_A);

	if ($wpdb->last_error)
		die('DB error at '. __LINE__ .': '. $wpdb->last_error);

	if ($res != null) {
		$options = unserialize($res[0]['option_value']);

		echo 'Updating wp_' . $site['blog_id'] . '_options - exception hours ...<br/>';

		// adding new acf field values for hours each day
		$start = $end = '';
		$old_exception_ids = array('_a_', '_b_', '_c_');
		$new_exception_ids = array('_0_', '_1_', '_2_');
		for ($i = 0; $i < 3; $i++) {
			foreach ($hours_exception_week_mapping as $opt) {
				$name = str_replace("_0_", $new_exception_ids[$i], "'" . $opt['c3name'] . "'");
				$field_name = str_replace("_0_", $new_exception_ids[$i], "'_" . $opt['c3name'] . "'");
				$field_id = "'" . $opt['c3field'] . "'";

				$c2name = str_replace("_a_", $old_exception_ids[$i], "'" . $opt['c2name'] . "'");
				if (strpos($c2name, '_start') !== false) {
					$start = $options[$opt['c2name']];
					if ($start == null || $start == '')
						continue;

					$val = "'" . to_24hr($start) . "'";
				} elseif (strpos($c2name, '_end') !== false) {
					$end = $options[$opt['c2name']];
					if ($end == null || $end == '')
						continue;

					$val = "'" . to_24hr($end) . "'";
				} elseif (strpos($c2name, '_closed_new') !== false) {
					if ($start == $end)
						$val = 1;
					else
						$val = 0;
				} else {
					$val = "'" . $options[$opt['c2name']] . "'";
				}

				$res = $wpdb->get_results("insert into wp_". $site['blog_id'] ."_options values (null, $name, $val, 'yes')");
				$res = $wpdb->get_results("insert into wp_". $site['blog_id'] ."_options values (null, $field_name, $field_id, 'yes')");

				if ($wpdb->last_error)
					die('DB error at ' . __LINE__ .": ". $wpdb->last_error ."<br/>name: $name val: $val field_name: $field_name field_id: $field_id");

			}
		}
	}

	$wpdb->flush();

	echo 'Switching theme to JLL (with exceptions)<br/>';
	switch ($site['blog_id']) {
		case 78:
			// do nothing
			break;
		default:
			switch_theme('JLL');
	}

	echo 'Creating and assigning default menus...<br/>';
	$primarymenuname = 'Default Primary Nav';
	$footermenuname = 'Default Footer Menu';

	// Does the menu exist already?
	$primary_menu_exists = wp_get_nav_menu_object( $primarymenuname );
	$footer_menu_exists = wp_get_nav_menu_object( $footermenuname );

	if (!$primary_menu_exists || !$footer_menu_exists) {
		// find page IDs
		$page_ids = array();
		$query = new WP_Query("post_type=page&post_status=publish&posts_per_page=-1");
		while($query->have_posts()) {
			$query->the_post();

			switch ($post->post_name) {
				case 'information':
				case 'hours-directions':
				case 'jobs':
				case 'mall-mail':
				case 'mobile':
				case 'directory':
				case 'events':
				case 'leasing':
				case 'contacts':
				case 'contact-us':
				case 'terms-of-use':
				case 'privacy':
				case 'privacy-2':
					$page_ids[$post->post_name] = $post->ID;
					break;
				default:
					break;
			}
		}
	}

	// If it doesn't exist, let's create it.
	if( !$primary_menu_exists) {
		$menulocation = 'primary';
		$menu_id = wp_create_nav_menu($primarymenuname);

		/*echo 'Page IDs:<br/><pre>';
		print_r($page_ids);
		echo '</pre>';*/
		// Add default nav items to menu
		// Information
		if (array_key_exists('information', $page_ids)) {
			$info_id = wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Information'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['information'],
					'menu-item-status' => 'publish')
			);
			//echo 'Info ID:'. $info_id;
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('General Information'),
					'menu-item-parent-id' => $info_id,
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['information'],
					'menu-item-status' => 'publish')
			);
			if (array_key_exists('hours-directions', $page_ids)) {
				wp_update_nav_menu_item($menu_id, 0, array(
						'menu-item-title' => __('Hours & Directions'),
						'menu-item-parent-id' => $info_id,
						'menu-item-type' => 'post_type',
						'menu-item-object' => 'page',
						'menu-item-object-id' => $page_ids['hours-directions'],
						'menu-item-status' => 'publish')
				);
			}
			if (array_key_exists('jobs', $page_ids)) {
				wp_update_nav_menu_item($menu_id, 0, array(
						'menu-item-title' => __('Jobs'),
						'menu-item-parent-id' => $info_id,
						'menu-item-type' => 'post_type',
						'menu-item-object' => 'page',
						'menu-item-object-id' => $page_ids['jobs'],
						'menu-item-status' => 'publish')
				);
			}
			if (array_key_exists('mall-mail', $page_ids)) {
				wp_update_nav_menu_item($menu_id, 0, array(
						'menu-item-title' => __('Mall Mail'),
						'menu-item-parent-id' => $info_id,
						'menu-item-type' => 'post_type',
						'menu-item-object' => 'page',
						'menu-item-object-id' => $page_ids['mall-mail'],
						'menu-item-status' => 'publish')
				);
			}
			if (array_key_exists('mobile', $page_ids)) {
				wp_update_nav_menu_item($menu_id, 0, array(
						'menu-item-title' => __('Mobile'),
						'menu-item-parent-id' => $info_id,
						'menu-item-type' => 'post_type',
						'menu-item-object' => 'page',
						'menu-item-object-id' => $page_ids['mobile'],
						'menu-item-status' => 'publish')
				);
			}
		}

		if (array_key_exists('directory', $page_ids)) {
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Directory'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['directory'],
					'menu-item-status' => 'publish')
			);
		}

		if (array_key_exists('events', $page_ids)) {
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Events'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['events'],
					'menu-item-status' => 'publish')
			);
		}

		if (array_key_exists('leasing', $page_ids)) {
			$leasing_id = wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Leasing'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['leasing'],
					'menu-item-status' => 'publish')
			);
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Leasing Information'),
					'menu-item-parent-id' => $leasing_id,
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['leasing'],
					'menu-item-status' => 'publish')
			);
			if (array_key_exists('contacts', $page_ids)) {
				wp_update_nav_menu_item($menu_id, 0, array(
						'menu-item-title' => __('Contacts'),
						'menu-item-parent-id' => $leasing_id,
						'menu-item-type' => 'post_type',
						'menu-item-object' => 'page',
						'menu-item-object-id' => $page_ids['contacts'],
						'menu-item-status' => 'publish')
				);
			}
		}

		if (array_key_exists('contact-us', $page_ids)) {
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Contact Us'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['contact-us'],
					'menu-item-status' => 'publish')
			);
		}


		// Assign our newly-created menu to the menu location
		//if( !has_nav_menu( $menulocation ) ){
		$locations = get_theme_mod('nav_menu_locations');
		$locations[$menulocation] = $menu_id;
		set_theme_mod('nav_menu_locations', $locations);
		//}
	}


	// If it doesn't exist, let's create it.
	if( !$footer_menu_exists) {
		$menulocation = 'footer';
		$menu_id = wp_create_nav_menu($footermenuname);

		// Add default nav items to menu
		if (array_key_exists('hours-directions', $page_ids)) {
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Hours & Directions'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['hours-directions'],
					'menu-item-status' => 'publish')
			);
		}

		if (array_key_exists('terms-of-use', $page_ids)) {
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Terms of Use'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['terms-of-use'],
					'menu-item-status' => 'publish')
			);
		}

		if (array_key_exists('privacy', $page_ids)) {
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Privacy'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['privacy'],
					'menu-item-status' => 'publish')
			);
		}

		if (array_key_exists('privacy-2', $page_ids)) {
			wp_update_nav_menu_item($menu_id, 0, array(
					'menu-item-title' => __('Privacy'),
					'menu-item-type' => 'post_type',
					'menu-item-object' => 'page',
					'menu-item-object-id' => $page_ids['privacy-2'],
					'menu-item-status' => 'publish')
			);
		}

		// Assign our newly-created menu to the menu location
		//if( !has_nav_menu( $menulocation ) ){
		$locations = get_theme_mod('nav_menu_locations');
		$locations[$menulocation] = $menu_id;
		set_theme_mod('nav_menu_locations', $locations);
		//}
	}

	// set Easy WP SMTP options
	$smtp_options = array(
		'from_email_field' => 'centers@imaginuity.com',
		'from_name_field' => get_bloginfo('name'),
		'smtp_settings' => array(
			'host' => 'int.vpc01-smtp02.imag-infra.net',
			'type_encryption' => 'none',
			'port' => '25',
			'autentication' => 'no',
			'username' => '',
			'password' => '',
		)
	);
	update_option('swpsmtp_options', $smtp_options);

	echo 'Set Easy WP SMTP options.<br/>';

	$client_group = array(
		'site_id' => 1,
		'selected_posts' => $jll_post->ID
	);
	update_option('property_options_client_group', $client_group);

	echo 'Set client group.<br/>';


}
echo 'Conversion complete.';


function to_24hr ($time_str) {
	if (stripos($time_str, 'am') === false || stripos($time_str, 'pm') === false)
		return $time_str;

	$splits = explode(' ', $time_str);
	$clock = $splits[0];
	$meridian = $splits[1];
	$splits = explode(':', $clock);
	$hours = intval($splits[0]);
	$minutes = $splits[1];
	return ($meridian == 'PM' ? $hours + 12 : $hours) .':'. $minutes .':00';
}
?>