<?php
require('./wp-load.php');

if (!is_super_admin())
	wp_die('Permission Denied');


$trash_before = '20160101';

$store_mapping = array(
	array(
		'c2name' => 'store_logo_color',
		'c3name' => 'logo_color',
		'c3field' => 'field_57ee88edcd2c4'
	),
	array(
		'c2name' => 'store_logo_monochrome',
		'c3name' => 'logo_monochrome',
		'c3field' => 'field_57ee8932cd2c5'
	),
	array(
		'c2name' => 'store_image',
		'c3name' => 'featured_image',
		'c3field' => 'field_57eebdef65721'
	),
//	array(
//		'c2name' => '',
//		'c3name' => 'store_copy',
//		'c3field' => 'field_57eeb0136e01d'
//	),
	array(
		'c2name' => 'store_phone',
		'c3name' => 'phone_number',
		'c3field' => 'field_57eeb3aa6e01e'
	),
	array(
		'c2name' => 'store_location',
		'c3name' => 'location',
		'c3field' => 'field_57eeb7756e01f'
	),
	array(
		'c2name' => 'best_entrance',
		'c3name' => 'best_entrance',
		'c3field' => 'field_57eeb8c56e020'
	),
	array(
		'c2name' => 'store_menu',
		'c3name' => 'restaurant_menu',
		'c3field' => 'field_5806363be1d6b'
	),
//	array(
//		'c2name' => '',
//		'c3name' => 'lot_number',
//		'c3field' => 'field_58063e2a8b157'
//	),
	array(
		'c2name' => 'store_web',
		'c3name' => 'website',
		'c3field' => 'field_5850863634b00'
	),
	array(
		'c2name' => 'store_featured_video_1',
		'c3name' => 'featured_video',
		'c3field' => 'field_57eed2da908fb'
	),
	array(
		'c2name' => 'store_feed_facebook',
		'c3name' => 'facebook',
		'c3field' => 'field_585195def34d5'
	),
	array(
		'c2name' => 'store_feed_twitter',
		'c3name' => 'twitter',
		'c3field' => 'field_585195f5f34d6'
	),
	array(
		'c2name' => 'store_feed_pinterest',
		'c3name' => 'pinterest',
		'c3field' => 'field_585195f8f34d8'
	),
	array(
		'c2name' => 'store_feed_instagram',
		'c3name' => 'instagram',
		'c3field' => 'field_585195f7f34d7'
	),
	array(
		'c2name' => 'store_coming_soon',
		'c3name' => 'flags',
		'c3field' => 'field_58b47f0222e63'
	),
);

$store_hours_week_mapping = array(
	array(
		'c2name' => 'store_monday_open',
		'c3name' => 'standard_hours_0_monday_open'
	),
	array(
		'c2name' => 'store_monday_close',
		'c3name' => 'standard_hours_0_monday_close'
	),
	array(
		'c2name' => 'sh_week_0_monday_closed_new',
		'c3name' => 'standard_hours_0_monday_closed'
	),
	array(
		'c2name' => 'store_tuesday_open',
		'c3name' => 'standard_hours_0_monday_open'
	),
	array(
		'c2name' => 'store_tuesday_close',
		'c3name' => 'standard_hours_0_monday_close'
	),
	array(
		'c2name' => 'sh_week_0_tuesday_closed_new',
		'c3name' => 'standard_hours_0_monday_closed'
	),
	array(
		'c2name' => 'store_wednesday_open',
		'c3name' => 'standard_hours_0_monday_open'
	),
	array(
		'c2name' => 'store_wednesday_close',
		'c3name' => 'standard_hours_0_monday_close'
	),
	array(
		'c2name' => 'sh_week_0_wednesday_closed_new',
		'c3name' => 'standard_hours_0_monday_closed'
	),
	array(
		'c2name' => 'store_thursday_open',
		'c3name' => 'standard_hours_0_monday_open'
	),
	array(
		'c2name' => 'store_thursday_close',
		'c3name' => 'standard_hours_0_monday_close'
	),
	array(
		'c2name' => 'sh_week_0_thursday_closed_new',
		'c3name' => 'standard_hours_0_monday_closed'
	),
	array(
		'c2name' => 'store_friday_open',
		'c3name' => 'standard_hours_0_monday_open'
	),
	array(
		'c2name' => 'store_friday_close',
		'c3name' => 'standard_hours_0_monday_close'
	),
	array(
		'c2name' => 'sh_week_0_friday_closed_new',
		'c3name' => 'standard_hours_0_monday_closed'
	),
	array(
		'c2name' => 'store_saturday_open',
		'c3name' => 'standard_hours_0_monday_open'
	),
	array(
		'c2name' => 'store_saturday_close',
		'c3name' => 'standard_hours_0_monday_close'
	),
	array(
		'c2name' => 'sh_week_0_saturday_closed_new',
		'c3name' => 'standard_hours_0_monday_closed'
	),
	array(
		'c2name' => 'store_sunday_open',
		'c3name' => 'standard_hours_0_monday_open'
	),
	array(
		'c2name' => 'store_sunday_close',
		'c3name' => 'standard_hours_0_monday_close'
	),
	array(
		'c2name' => 'sh_week_0_sunday_closed_new',
		'c3name' => 'standard_hours_0_monday_closed'
	),
);

$sales_events_mapping = array(
	array(
		'c2name' => 'sale_or_event_new',
		'c3name' => 'post_type'
	),
//	array(
//		'c2name' => 'holiday_event',
//		'c3name' => 'holiday_event'
//	),
	array(
		'c2name' => 'imag_sales_offers_start_date',
		'c3name' => 'start_date'
	),
	array(
		'c2name' => 'imag_sales_offers_end_date',
		'c3name' => 'end_date'
	),
	array(
		'c2name' => '_EventStartDate',
		'c3name' => 'start_date'
	),
	array(
		'c2name' => '_EventEndDate',
		'c3name' => 'end_date'
	),
	array(
		'c2name' => 'imag_sales_offers_image',
		'c3name' => 'featured_image',
		'c3field' => 'field_5807cf8633461'
	),
	array(
		'c2name' => 'featured_image', // name stays the same but the field changes
		'c3name' => 'featured_image',
		'c3field' => 'field_58cae29426f74'
	),
	array(
		'c2name' => 'imag_sales_offers_related_store',
		'c3name' => 'related_store'
	),
);

$job_listing_mapping = array(
	array(
		'c2name' => 'imag_job_related_store',
		'c3name' => 'related_store'
	),
	array(
		'c2name' => 'imag_job_listing_contact',
		'c3name' => 'contact_info'
	),
);

$page_mapping = array(
	array(
		'c2name' => 'leasing_ctas_0_image',
		'c3name' => 'triple_ctas_0_image',
		'c3field' => 'field_580fc7d8df30b'
	),
	array(
		'c2name' => 'leasing_ctas_0_image_alt_tags',
		'c3name' => 'triple_ctas_0_image_alt_text',
		'c3field' => 'field_580fc815df30d'
	),
	array(
		'c2name' => 'leasing_ctas_0_file_download',
		'c3name' => 'triple_ctas_0_image_url',
		'c3field' => 'field_580fc802df30c'
	),
	array(
		'c2name' => 'leasing_ctas_0_url',
		'c3name' => 'triple_ctas_0_image_url',
		'c3field' => 'field_580fc802df30c'
	),
	array(
		'c2name' => 'leasing_ctas_1_image',
		'c3name' => 'triple_ctas_1_image',
		'c3field' => 'field_580fc7d8df30b'
	),
	array(
		'c2name' => 'leasing_ctas_1_image_alt_tags',
		'c3name' => 'triple_ctas_1_image_alt_text',
		'c3field' => 'field_580fc815df30d'
	),
	array(
		'c2name' => 'leasing_ctas_1_file_download',
		'c3name' => 'triple_ctas_1_image_url',
		'c3field' => 'field_580fc802df30c'
	),
	array(
		'c2name' => 'leasing_ctas_1_url',
		'c3name' => 'triple_ctas_1_image_url',
		'c3field' => 'field_580fc802df30c'
	),
	array(
		'c2name' => 'leasing_ctas_2_image',
		'c3name' => 'triple_ctas_2_image',
		'c3field' => 'field_580fc7d8df30b'
	),
	array(
		'c2name' => 'leasing_ctas_2_image_alt_tags',
		'c3name' => 'triple_ctas_2_image_alt_text',
		'c3field' => 'field_580fc815df30d'
	),
	array(
		'c2name' => 'leasing_ctas_2_file_download',
		'c3name' => 'triple_ctas_2_image_url',
		'c3field' => 'field_580fc802df30c'
	),
	array(
		'c2name' => 'leasing_ctas_2_url',
		'c3name' => 'triple_ctas_2_image_url',
		'c3field' => 'field_580fc802df30c'
	),
	array(
		'c2name' => 'leasing_copy_one',
		'c3name' => 'leasing_space_copy'
	),
	array(
		'c2name' => 'leasing_copy_two',
		'c3name' => 'specialty_leasing_copy'
	),
	array(
		'c2name' => 'advantages_url',
		'c3name' => 'advantages_to_mall_leasing_link'
	),
	array(
		'c2name' => 'hero_image_0_image',
		'c3name' => 'hero_slider_0_image'
	),
	array(
		'c2name' => 'hero_image_1_image',
		'c3name' => 'hero_slider_1_image'
	),
	array(
		'c2name' => 'hero_image_2_image',
		'c3name' => 'hero_slider_2_image'
	),
	array(
		'c2name' => 'hero_image_3_image',
		'c3name' => 'hero_slider_3_image'
	),
	array(
		'c2name' => 'hero_image_4_image',
		'c3name' => 'hero_slider_4_image'
	),
	array(
		'c2name' => 'hero_image_5_image',
		'c3name' => 'hero_slider_5_image'
	),
	array(
		'c2name' => 'hero_image_0_link_url',
		'c3name' => 'hero_slider_0_image_url'
	),
	array(
		'c2name' => 'hero_image_1_link_url',
		'c3name' => 'hero_slider_1_image_url'
	),
	array(
		'c2name' => 'hero_image_2_link_url',
		'c3name' => 'hero_slider_2_image_url'
	),
	array(
		'c2name' => 'hero_image_3_link_url',
		'c3name' => 'hero_slider_3_image_url'
	),
	array(
		'c2name' => 'hero_image_4_link_url',
		'c3name' => 'hero_slider_4_image_url'
	),
	array(
		'c2name' => 'hero_image_5_link_url',
		'c3name' => 'hero_slider_5_image_url'
	),
	array(
		'c2name' => 'hero_image_0_image_alt_tags',
		'c3name' => 'hero_slider_0_alt_text'
	),
	array(
		'c2name' => 'hero_image_1_image_alt_tags',
		'c3name' => 'hero_slider_1_alt_text'
	),
	array(
		'c2name' => 'hero_image_2_image_alt_tags',
		'c3name' => 'hero_slider_2_alt_text'
	),
	array(
		'c2name' => 'hero_image_3_image_alt_tags',
		'c3name' => 'hero_slider_3_alt_text'
	),
	array(
		'c2name' => 'hero_image_4_image_alt_tags',
		'c3name' => 'hero_slider_4_alt_text'
	),
	array(
		'c2name' => 'hero_image_5_image_alt_tags',
		'c3name' => 'hero_slider_5_alt_text'
	),
	array(
		'c2name' => 'cta_0_image',
		'c3name' => 'triple_ctas_0_image'
	),
	array(
		'c2name' => 'cta_0_image_alt_tags',
		'c3name' => 'triple_ctas_0_image_alt_text'
	),
	array(
		'c2name' => 'cta_0_outbound_url',
		'c3name' => 'triple_ctas_0_image_url'
	),
	array(
		'c2name' => 'cta_0_url_outbound',
		'c3name' => 'triple_ctas_0_image_url'
	),
	array(
		'c2name' => 'cta_1_image',
		'c3name' => 'triple_ctas_1_image'
	),
	array(
		'c2name' => 'cta_1_image_alt_tags',
		'c3name' => 'triple_ctas_1_image_alt_text'
	),
	array(
		'c2name' => 'cta_1_outbound_url',
		'c3name' => 'triple_ctas_1_image_url'
	),
	array(
		'c2name' => 'cta_1_url_outbound',
		'c3name' => 'triple_ctas_1_image_url'
	),
	array(
		'c2name' => 'cta_2_image',
		'c3name' => 'triple_ctas_2_image'
	),
	array(
		'c2name' => 'cta_2_image_alt_tags',
		'c3name' => 'triple_ctas_2_image_alt_text'
	),
	array(
		'c2name' => 'cta_2_outbound_url',
		'c3name' => 'triple_ctas_2_image_url'
	),
	array(
		'c2name' => 'cta_2_url_outbound',
		'c3name' => 'triple_ctas_2_image_url'
	),
);


global $wpdb;

$sites = $wpdb->get_results('SELECT blog_id, path FROM wp_blogs', ARRAY_A);
$global_stores = array();

foreach ($sites as $site) {
	switch_to_blog($site['blog_id']);

	if ($site['blog_id'] == 1) {
		$the_query = new WP_Query('post_type=global_stores&post_status=any&posts_per_page=-1&cache_results=false');

		foreach ($the_query->posts as $p) {
			$global_stores[$p->post_name] = $p->ID;
		}
		echo 'global stores: <pre>';
		var_dump($global_stores);
		echo '</pre>';

		continue;
	}

	// run on a given mall only
	if (!empty($_GET['blog_id']) && $site['blog_id'] != $_GET['blog_id'])
		continue;

	// store ACF data

	echo 'Updating wp_'. $site['blog_id'] .'_postmeta...<br/>';

	$the_query = new WP_Query('post_type=stores&post_status=any&posts_per_page=-1&cache_results=false');

	while ($the_query->have_posts()) {
		$the_query->the_post();

		// store data
		foreach ($store_mapping as $opt) {
			if (strpos($opt['c2name'], 'store_feed') !== false) {
				$feed_id = get_field($opt['c2name']);
				if (empty($feed_id)) {
					$val = '';
				} else {
					$rows = $wpdb->get_results('SELECT socialmedia, feed_meta FROM wp_autoblog WHERE feed_id = ' . $feed_id, ARRAY_A);
					if (empty($rows)) {
						$val = '';
					} else {
						$feed_meta = unserialize($rows[0]['feed_meta']);
						$val = $feed_meta['url'];
					}
				}
			} elseif ($opt['c2name'] == 'store_coming_soon') {
				$coming_soon_old = get_field($opt['c2name']);
				$flags = get_field($opt['c3name']);
				if (is_array($coming_soon_old) && in_array("true", $coming_soon_old)) {
					if (!in_array('Coming Soon', $flags))
						$flags[] = 'Coming Soon';
				}
				$val = $flags;
			} else {
				$val = get_field($opt['c2name']);
			}
			update_post_meta($post->ID, $opt['c3name'], $val);
			update_post_meta($post->ID, '_'. $opt['c3name'], $opt['c3field']);
		}

		$content = get_the_content();
		if ($content)
			update_field('store_copy', $content);

		// store hours
		foreach ($store_hours_week_mapping as $opt) {
			$start = $end = '';
			if (strpos($opt['c2name'], '_open') !== false) {
				$start = get_field($opt['c2name']);
				if ($start == null || $start == '')
					continue;

				$val = to_24hr($start);
			} elseif (strpos($opt['c2name'], '_close') !== false) {
				$end = get_field($opt['c2name']);
				if ($end == null || $end == '')
					continue;

				$val = to_24hr($end);
			} elseif (strpos($opt['c2name'], '_closed_new') !== false) {
				if ($start == $end)
					$val = 1;
				else
					$val = 0;
			} else {
				$val = get_field($opt['c2name']);
			}
			update_field($opt['c3name'], $val);
		}

		// global store mapping
		$global_store_id = null;
		if (array_key_exists($post->post_name, $global_stores)) {
			$global_store_id = $global_stores[$post->post_name];
		}
		else if (array_key_exists(str_replace('-and', '', $post->post_name), $global_stores)) {
			// works when local store has 'and' in slug and global store doesn't
			$global_store_id = $global_stores[str_replace('-and', '', $post->post_name)];
		}

		if (!empty($global_store_id)) {
			echo 'assigning global store'. $global_store_id .' to '. $post->post_name .'<br/>';
			$store_selector = array(
				'site_id' => 1,
				'selected_posts' => $global_store_id
			);
			update_post_meta($post->ID, 'global_store_selector', $store_selector);
			update_post_meta($post->ID, '_global_store_selector', 'field_58ae48eea9a30');
		}


	}

	// sales & events
	$the_query = new WP_Query(
		array(
			'post_type'=> array('sales_events','events','sales'),
			'post_status' => 'any',
			'posts_per_page' => -1,
			'cache_results' => false
		)
	);

	while ($the_query->have_posts()) {
		$the_query->the_post();

		foreach ($sales_events_mapping as $opt) {
			switch($opt['c2name']) {
				case 'sale_or_event_new':
					$val = !empty(get_field('_EventOrigin')) ? 'Event' : 'Sale';
					break;
				case '_EventStartDate':
					$d = get_post_meta(get_the_ID(), '_EventStartDate', true);
					if (!empty($d)) {
						$splits = explode(' ', $d);
						$val = str_replace('-', '', $splits[0]);
						update_field('start_time', $splits[1]);
					} else {
						$val = '';
					}
					break;
				case '_EventEndDate':
					$d = get_post_meta(get_the_ID(), '_EventEndDate', true);
					if (!empty($d)) {
						$splits = explode(' ', $d);
						$val = str_replace('-', '', $splits[0]);
						update_field('end_time', $splits[1]);
					} else {
						$val = '';
					}
					break;
				default:
					$val = get_post_meta(get_the_ID(), $opt['c2name'], true);
			}
			if (!empty($val)) {
				if (array_key_exists('c3field', $opt)) {
					update_post_meta(get_the_ID(), $opt['c3name'], $val); // number of rows in repeater
					update_post_meta(get_the_ID(), '_' . $opt['c3name'], $opt['c3field']);
				} else {
					update_field($opt['c3name'], $val);
				}
			}

			if ($opt['c3name'] == 'end_date') {
				if (!empty($val) && $val < $trash_before)
					wp_trash_post(get_the_ID());
			}
		}

		$content = get_the_content();

		// split into two post types
		if (get_field('post_type') == 'Event') {
			$post->post_type = 'events';
			if ($content)
				update_field('post_copy', $content);
		} else {
			$post->post_type = 'sales';
			if ($content)
				update_field('post_copy', $content);
		}
		wp_update_post($post);
	}

	// job listings
	$the_query = new WP_Query('post_type=jobs&post_status=any&posts_per_page=-1&cache_results=false');

	while ($the_query->have_posts()) {
		$the_query->the_post();

		foreach ($job_listing_mapping as $opt) {
			$val = get_post_meta(get_the_ID(), $opt['c2name'], true);
			update_field($opt['c3name'], $val);
		}

		// trash job listing posted before this date
		if (get_the_date('Ymd') < $trash_before)
			wp_trash_post(get_the_ID());

		$content = get_the_content();
		if ($content)
			update_field('listing_copy', $content);
	}

	// pages
	$the_query = new WP_Query('post_type=page&post_status=any&posts_per_page=-1&cache_results=false');

	while ($the_query->have_posts()) {
		$the_query->the_post();

		$pageTitle = get_the_title();
		echo "<b>Page Title: </b>".$pageTitle."<br/>";



		switch($post->ID){
			case 2:
				// home
				if ($post->post_name != 'home' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 2,
						'post_name' => 'home',
						'post_parent' => 0
					));
				}
				update_post_meta( $post->ID, '_wp_page_template', 'template-home.php' );
				break;
			case 8:
				// directory
				if ($post->post_name != 'directory' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 8,
						'post_name' => 'directory',
						'post_parent' => 0
					));
				}
				update_post_meta( $post->ID, '_wp_page_template', 'template-directory.php' );
				break;
			case 10:
				// events
				if ($post->post_name != 'events' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 10,
						'post_name' => 'events',
						'post_parent' => 0
					));
				}
				break;
			case 14;
				// leasing
				if ($post->post_name != 'leasing' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 14,
						'post_name' => 'leasing',
						'post_parent' => 0
					));
				}
				update_post_meta( $post->ID, '_wp_page_template', 'template-leasing.php' );
				break;
			case 16;
				// contact us
				if ($post->post_name != 'contact-us' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 16,
						'post_name' => 'contact-us',
						'post_parent' => 0
					));
				}
				update_field('gravity_form', 1, $post->ID);
				break;
			case 25:
				// hours & directions
				if ($post->post_name != 'hours-directions' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 25,
						'post_name' => 'hours-directions',
						'post_parent' => 0
					));
				}
				break;
			case 28:
				// contact us again (mockingbird station, maybe others)
				if ($post->post_name != 'contact-us' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 28,
						'post_name' => 'contact-us',
						'post_parent' => 0
					));
				}
				update_field('gravity_form', 2, $post->ID);
				break;
			case 227:
				// Contacts
				if ($post->post_name != 'mall-mail' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 227,
						'post_name' => 'Contacts',
						'post_parent' => 0
					));
				}
				update_field('gravity_form', 6, $post->ID);
				break;
			case 288:
				// Mall Mail
				if ($post->post_name != 'mall-mail' || $post->post_parent != 0) {
					wp_update_post(array(
						'ID' => 288,
						'post_name' => 'mall-mail',
						'post_parent' => 0
					));
				}
				update_field('gravity_form', 4, $post->ID);  // TODO: confirm correct ID with Alex
				break;
			default:
				if ($post->post_parent != 0) {
					wp_update_post(array(
						'ID' => $post->post_id,
						'post_parent' => 0
					));
				}
				break;
		}

		$hero_slider_slide_count = 0;
		foreach ($page_mapping as $opt) {
			$rep_field = $sub_field = $row_number = null;

			if (strpos($opt['c3name'], 'triple_ctas_') !== false) {
				update_post_meta(get_the_ID(), 'triple_ctas', 3); // number of rows in repeater
				update_post_meta(get_the_ID(), '_triple_ctas', 'field_580fc7c6df30a');
			}

			if (strpos($opt['c3name'], 'hero_slider_') !== false && preg_match('/^hero_slider_[0-9]_image$/', $opt['c3name']) == 1) {
				if (!empty(get_post_meta(get_the_ID(), $opt['c2name'], true)))
					$hero_slider_slide_count++;
			}

			if (strpos($opt['c2name'], 'cta_') !== false && strpos($opt['c2name'], '_outbound_url') !== false) {
				$page_id = get_post_meta($post->ID, $opt['c2name'], true);
				if (empty($page_id))
					$val = null;
				else
					$val = get_permalink($page_id);
			} else if (strpos($opt['c2name'], 'cta_') !== false && strpos($opt['c2name'], '_url_outbound') !== false) {
				$page_url = get_post_meta($post->ID, $opt['c2name'], true);
				if (empty($page_url))
					$val = null;
				else
					$val = $page_url;
			} else if (strpos($opt['c2name'], 'leasing_copy_') !== false) {
				$copy = get_post_meta($post->ID, $opt['c2name'], true);
				$matches = array();
				preg_match('/<[^>]+>([^<]+)<\/[^>]+>(.*)/s', $copy, $matches);

				($matches[1] ? $title = $matches[1] : null);
				$title_field = str_replace('_copy', '_title', $opt['c3name']);
				update_field($title_field, $title);

				($matches[2] ? $val = $matches[2] : null);
			}
			else {
				$val = get_post_meta(get_the_ID(), $opt['c2name'], true);
			}
			echo "<b>Page ID</b>: ".$post->ID."<br/>";
			echo $opt['c2name']." -> ";
			echo $opt['c3name'];
			echo "<br/>";
			if(empty($val)){
				echo "SKIPPED <br/><br/>";
			} else {
				echo 'Value Transferred: ' . $val . "<br/><br/>";
				if (array_key_exists('c3field', $opt)) {
					update_post_meta($post->ID, $opt['c3name'], $val);
					update_post_meta($post->ID, '_'. $opt['c3name'], $opt['c3field']);
				} else {
					update_field($opt['c3name'], $val);
				}

			}
		}

		foreach (array(0, 1, 2) as $ci) {
			$val = get_post_meta($post->ID, "leasing_ctas_{$ci}_file_download", true);
			if (!empty($val)) {
				if (is_numeric($val)) {
					// this is a post id - get the url
					echo 'getting URL of download from post ID</br>';
					$val = wp_get_attachment_url($val);
				}
				update_field("triple_ctas_{$ci}_image_url", $val);
				echo "moving triple_ctas_{$ci}_image_url to $val <br/>";
			}
		}

		$featured_area = maybe_unserialize(get_post_meta($post->ID, 'featured_area', true));
		if (!empty($featured_area) && in_array('videos', $featured_area)) {
			echo 'has featured area - ';
			$res = $wpdb->get_results("SELECT * FROM wp_". $site['blog_id']. "_postmeta WHERE meta_key LIKE 'featured_area_%' AND meta_key LIKE '%_video_id' AND post_id = ". $post->ID, ARRAY_A);
			foreach( $res as $row ) {
				$video_id = $row['meta_value'];
				echo 'tranferring value '. $video_id .' from featured area<br/>';
				update_field('featured_video_id', $video_id);
			}
		}

		if ($hero_slider_slide_count) {
			update_post_meta($post->ID, 'hero_slider', $hero_slider_slide_count); // number of rows in repeater
			update_post_meta($post->ID, '_hero_slider', 'field_580fc6e7adcab');
		}
	}

	$the_query = null;
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