<?php
require('./wp-load.php');
require ( ABSPATH . 'wp-admin/includes/image.php' );

if (!is_super_admin())
	wp_die('Permission Denied');


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

// move global stores
switch_to_blog(4); // old retail central

echo 'Collecting global store data...<br/>';
$the_query = new WP_Query('post_type=stores&post_status=any&posts_per_page=-1&cache_results=false');

$global_stores = array();
while ($the_query->have_posts()) {
	$the_query->the_post();

	$store_data = array(
		//'ID' => $post->ID,
		'post_author' => $post->post_author,
		'post_date' => $post->post_date,
		'post_date_gmt' => $post->post_date_gmt,
		'post_content' => $post->post_content,
		'post_title' => $post->post_title,
		'post_status' => $post->post_status,
		'post_type' => 'global_stores',
		'post_name' => $post->post_name,
		'post_modified' => $post->post_modified,
		'post_modified_gmt' => $post->post_modified_gmt,
	);
	$temp = get_post_meta($post->ID);
	$metadata = array();
	$images = array();
	foreach ($temp as $key => $data) {
		// store metadata
		$metadata[$key] = maybe_unserialize($data[0]);

		// store image data
		if (!empty($data[0]) && ($key == 'logo_color' || $key == 'logo_monochrome' || $key == 'featured_image')) {
			$images[$key] = prepare_media_post($data[0]);
		}
	}

	$store_data['my_meta'] = $metadata;
	$store_data['images'] = $images;


	$global_stores[] = $store_data;
}

echo 'Creating/updating '. count($global_stores) .' global stores...<br/>';
echo '<pre>';
var_dump($global_stores[5]);
echo '</pre>';

switch_to_blog(1); // base site
foreach ($global_stores as $new_post)
{
	// create new global store if slug doesn't exist
	// otherwise, do nothing
	$query = new WP_Query('post_type=global_stores&posts_per_page=-1&name='. $new_post['post_name']);
	if ($query->post_count == 0) {
		$new_post_id = wp_insert_post($new_post);

		foreach ($store_mapping as $opt) {
			$key = $opt['c2name'];
			if (!array_key_exists($key, $new_post['my_meta']))
				continue;

			if (strpos($key, 'store_feed') !== false) {
				$feed_id = $new_post['my_meta'][$key];
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
			} else {
				$val = $new_post['my_meta'][$key];
			}
			update_field($opt['c3name'], $val, $new_post_id);
		}

		$content = $new_post['post_content'];
		if ($content)
			update_field('store_copy', $content, $new_post_id);

		// store hours
		foreach ($store_hours_week_mapping as $opt) {
			$key = $opt['c2name'];
			if (!array_key_exists($key, $new_post['my_meta']))
				continue;

			$start = $end = '';
			if (strpos($key, '_open') !== false) {
				$start = $new_post['my_meta'][$key];
				if ($start == null || $start == '')
					continue;

				$val = to_24hr($start);
			} elseif (strpos($key, '_close') !== false) {
				$end = $new_post['my_meta'][$key];
				if ($end == null || $end == '')
					continue;

				$val = to_24hr($end);
			} elseif (strpos($key, '_closed_new') !== false) {
				if ($start == $end)
					$val = 1;
				else
					$val = 0;
			} else {
				$val = $new_post['my_meta'][$key];
			}
			update_field($opt['c3name'], $val, $new_post_id);
		}

		$post_id = $new_post_id;
	} else {
		$post_id = $query->posts[0]->ID;
	}

	// images
	foreach ($new_post['images'] as $meta_field => $image_post) {
		$query = new WP_Query('post_type=attachment&posts_per_page=-1&name='. $image_post['post_name']);
		if ($query->post_count == 0) {
			echo 'Media post not found - creating<br/>';
			$image_post_id = wp_insert_post($image_post);

			// add image post metadata
			foreach ($image_post['my_meta'] as $meta_key => $meta_value) {
				update_post_meta($image_post_id, $meta_key, $meta_value);
			}

			$uploads = wp_upload_dir();
			$file_path = $uploads['basedir'] .'/'. get_post_meta($image_post_id, '_wp_attached_file', true);

			// copy file, if necessary

			if (file_exists($file_path)) {
				echo $file_path .' exists.<br/>';
			} else {
				echo $file_path .' does not exist. Copying...<br/>';
				$retail_central_url = str_replace('centers3.imag-dev.com', 'retailcentral.imaginuitycenters2.com', $uploads['baseurl']);
				$remote_url = $retail_central_url .'/sites/4/'. get_post_meta($image_post_id, '_wp_attached_file', true);
				echo 'Copying '. $remote_url .' to local uploads<br/>';
				if (!file_exists(dirname($file_path)))
					mkdir(dirname($file_path), 0775, true);
				copy($remote_url, $file_path);
			}

			// normalize metadata and generate thumbnails
			$attachment_data = wp_generate_attachment_metadata($image_post_id, $file_path);
			wp_update_attachment_metadata($image_post_id, $attachment_data);
		} else {
			echo 'Media post found - updating<br/>';
			$image_post_id = $query->posts[0]->ID;
		}
		echo "Post $post_id $meta_field is image $image_post_id <br/>";
		update_field($meta_field, $image_post_id, $post_id);
	}
}

function prepare_media_post($post_id) {
	$media_post = get_post($post_id);
	$image = array(
		//'ID' => $media_post->ID,
		'post_author' => $media_post->post_author,
		'post_date' => $media_post->post_date,
		'post_date_gmt' => $media_post->post_date_gmt,
		'post_content' => $media_post->post_content,
		'post_title' => $media_post->post_title,
		'post_status' => $media_post->post_status,
		'post_type' => $media_post->post_type,
		'post_name' => $media_post->post_name,
		'post_modified' => $media_post->post_modified,
		'post_modified_gmt' => $media_post->post_modified_gmt,
		'post_mime_type' => $media_post->post_mime_type
	);
	$temp = get_post_meta($media_post->ID);
	$media_meta = array();
	foreach ($temp as $key => $data) {
		$media_meta[$key] = maybe_unserialize($data[0]);
	}
	$image['my_meta'] = $media_meta;

	return $image;
}