<?php
require('./wp-load.php');
require ( ABSPATH . 'wp-admin/includes/image.php' );

if (!is_super_admin())
	wp_die('Permission Denied');


global $wpdb;

$sites = $wpdb->get_results('SELECT blog_id, path FROM wp_blogs', ARRAY_A);

foreach ($sites as $site) {
	switch_to_blog($site['blog_id']);

	if ($site['blog_id'] == 1) {
		/*
		// base site
		$the_query = new WP_Query('post_type=global_stores&post_status=any&posts_per_page=-1&cache_results=false');

		while ($the_query->have_posts()) {
			$the_query->the_post();

		}
		*/
	} else {
		// all sites besides base site

		// run on a given mall only
		if (!empty($_GET['blog_id']) && $site['blog_id'] != $_GET['blog_id'])
			continue;

		$the_query = new WP_Query('post_type=events&post_status=any&posts_per_page=-1&cache_results=false');

		if ($the_query->have_posts()) {
			// centers2
			register_taxonomy(
				'tribe_events_cat',  //The name of the taxonomy. Name should be in slug form (must not contain capital letters or spaces).
				'events',        //post type name
				array(
					'hierarchical' => true,
					'label' => 'Event Categories',  //Display name
					'rewrite' => array(
						'slug' => 'event', // This controls the base slug that will display before each term
					),
					'show_in_rest' => true,
				)
			);
			// centers3
			register_taxonomy(
				'event_categories',  //The name of the taxonomy. Name should be in slug form (must not contain capital letters or spaces).
				'events',        //post type name
				array(
					'hierarchical' => true,
					'label' => 'Event Categories',  //Display name
					'rewrite' => array(
						'slug' => 'event', // This controls the base slug that will display before each term
					),
					'show_in_rest' => true,
				)
			);
		}

		$term_icon_classes = array(
			'food' => 'fa-cutlery',
			'kids' => 'fa-child',
			'music' => 'fa-music',
			'promotions' => 'fa-bullhorn',
			'family-fun' => 'fa-home',
			'family' => 'fa-home',
			'event' => 'fa-calendar',
			'shopping' => 'fa-shopping-bag'
		);

		while ($the_query->have_posts()) {

			$the_query->the_post();
			// copy terms from old tax to new tax
			$terms = get_the_terms($post, 'tribe_events_cat');
			if (empty($terms))
				continue;

			foreach ($terms as $term)
			{
				// copy term to new taxonomy
				$centers3_term = get_term_by('slug', $term->slug, 'event_categories');
				if (!$centers3_term) {
					$centers3_term = wp_insert_term(
						$term->name,
						'event_categories',
						array(
							'description' => $term->description,
							'slug' => $term->slug,
							'parent' => $term->parent
						)
					);

				}
				if (is_wp_error($centers3_term)) {
					echo $centers3_term->get_error_message();
					continue;
				}


				// assign icon - temporary
				switch ($term->slug) {
					case 'food':
						$icon_class = 'fa-cutlery';
						break;
					case 'kids':
						$icon_class = 'fa-child';
						break;
					case 'music':
						$icon_class = 'fa-music';
						break;
					case 'promotions':
						$icon_class = 'fa-bullhorn';
						break;
					case 'family-fun':
					case 'family':
						$icon_class = 'fa-home';
						break;
					case 'event':
						$icon_class = 'fa-calendar';
						break;
					case 'shopping':
						$icon_class = 'fa-shopping-bag';
						break;
					case 'art':
						$icon_class = 'fa-paint-brush';
						break;
					default:
						$icon_class = null;
				}
				if ($icon_class != null) {
					update_term_meta($centers3_term->term_id, 'event_category_icon', $icon_class);
					update_term_meta($centers3_term->term_id, '_event_category_icon', 'field_58caea6242273');
				}

				// assign term to this post
				$ret = wp_set_object_terms($post->ID, $centers3_term->term_id, 'event_categories', true);
				if (is_wp_error($ret))
					echo $ret->get_error_message();
			}
		}

		// make sure default terms are included
		foreach (array('food', 'kids', 'music', 'promotions') as $slug)
		if (get_term_by('slug', $slug, 'event_categories') === false) {
			$new_term_info = wp_insert_term(
				ucfirst($slug),
				'event_categories',
				array('slug' => $slug)
			);

			// assign icon
			if (array_key_exists($slug, $term_icon_classes)) {
				update_term_meta($new_term_info['term_id'], 'event_category_icon', $term_icon_classes[$slug]);
				update_term_meta($new_term_info['term_id'], '_event_category_icon', 'field_58caea6242273');
			}
		}

		echo 'Finished converting event taxonomy for site '. $site['blog_id'] .'.<br/>';
	}
}