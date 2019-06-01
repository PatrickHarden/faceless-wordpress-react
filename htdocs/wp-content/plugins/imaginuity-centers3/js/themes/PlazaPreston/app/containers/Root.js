// Packages
import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import axios from "axios";
import $ from 'jquery';
let ReactGA = require('react-ga');

// Containers
import Blog from './Blog';
import ContactUs from './ContactUs';
import Default from './Default';
import Dining from './Dining';
import Events from './Events';
import EventSingle from './EventSingle';
import GuestServices from './GuestServices';
import Home from './Home';
import InteractiveMap from './InteractiveMap';
import Leasing from './Leasing';
import Lookbook from './Lookbook';
import Main from './Main';
import Search from './Search';
import Shopping from './Shopping';
import Stores from './StoreSingle';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

let googleAnalyticsID;
let googleAnalyticsEnabled;

function logPageView() {
    document.elementFromPoint(0,0).click();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $('.search-form').removeClass('open');
    $('.dropdown').removeClass('open');
    if(googleAnalyticsEnabled) {
        ReactGA.set({page: window.location.pathname + window.location.search});
        ReactGA.pageview(window.location.pathname + window.location.search);
    }
}

axios.get(PropertyOptions)
    .then((response) => {

        googleAnalyticsEnabled = response.data.acf.enable_google_analytics;
        googleAnalyticsID = response.data.acf.enable_google_analytics && response.data.acf.google_analytics_tracking_ID ? response.data.acf.google_analytics_tracking_ID : false;

        if(googleAnalyticsEnabled){
            ReactGA.initialize(googleAnalyticsID);
            ReactGA.ga('send', 'pageview');
        }

    })
    .catch((err) => {
        console.log(err);
    })


const Root = () => (
    <Router history={browserHistory} onUpdate={logPageView} >
        <Route path="/" component={Main}>
            <IndexRoute name="Home" component={Home} />
            <Route name="Blog" component={Blog} path="/blog" />
            <Route name="Contact Us" component={ContactUs} path="/contact-us" />
            <Route name="Dining" component={Dining} path="/dining" />
            <Route name="Events" component={Events} path="/events" />
            <Route name="Event" component={EventSingle} path="/events/:eventSlug" />
            <Route name="Guest Services" component={GuestServices} path="/guest-services" />
            <Route name="Shopping" component={Shopping} path="/shopping" />
            <Route name="Stores" component={Stores} path="/stores/:storeSlug" />
            <Route name="Leasing" component={Leasing} path="/leasing" />
            <Route name="Lookbook" component={Lookbook} path="/lookbook" />
            <Route name="Interactive Map" component={InteractiveMap} path="/interactive-map" />
            <Route name="Search" component={Search} path="/search" />
            <Route name="Default Page" component={Default} path="/:pageSlug" />
        </Route>
    </Router>
);

export default Root;