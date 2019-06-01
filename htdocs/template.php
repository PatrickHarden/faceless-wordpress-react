<?php

require('./wp-blog-header.php');


$templates = wp_get_theme()->get_page_templates();

foreach ( $templates as $template_name => $template_filename )
{
//    echo "$template_name ($template_filename)<br />";
}

echo '<h1>Templates</h1><br/><br/>';

echo '<a href="/" target="_blank"><h3>Home</h3>Home</a>';

echo '<a href="/directory"><h3>Directory</h3>Directory</a>';

echo '<a href="/sales-events"><h3>Sales & Events</h3>Sales & Events</a>';

echo '<a href="/hours-directions" target="_blank"><h3>Hours & Directions</h3>History</a>';

echo '<a href="/leasing" target="_blank"><h3>Leasing</h3>Awards</a>';

echo '<a href="/contact" target="_blank"><h3>Contact</h3>Contact</a>';

echo '<a href="/stores/aeropostale" target="_blank"><h3>Single Store</h3></a>';

echo '<a href="/services" target="_blank"><h3>Default Page</h3></a>';

echo '<a href="/knowledge-center/" target="_blank"><h3>404</h3></a>';

