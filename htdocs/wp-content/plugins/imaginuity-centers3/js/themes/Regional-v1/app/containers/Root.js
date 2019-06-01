// Packages
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import axios from "axios";
let ReactGA = require('react-ga');

// Containers
import Main from './Main';
import Home from './Home';
import Information from './Information';
import HoursDirections from './HoursDirections';
import Sales from './Sales';
import SalesSingle from './SaleSingle';
import Events from './Events';
import EventSingle from './EventSingle';
import Default from './Default';
import Directory from './Directory';
import Stores from './StoreSingle';
import Jobs from './Jobs';
import JobSingle from './JobSingle';
import Leasing from './Leasing';
import DealOfTheDay from './DealOfTheDay';
import SubmissionJobs from './SubmissionJobs';
import SubmissionSales from './SubmissionSale';
import SubmissionEvent from './SubmissionEvent';
import InteractiveMap from './InteractiveMap';
import Renovation from './Renovation';
import Blogs from './Blog';
import BlogSingle from './BlogSingle';
import Holiday from './Holiday';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

let googleAnalyticsID;
let googleAnalyticsEnabled;

function logPageView() {
    ReactGA.set({ page: window.location.pathname + window.location.search });
    ReactGA.pageview(window.location.pathname + window.location.search);
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
            <Route name="Information" component={Information} path="/information" />
            <Route name="Hours & Directions" component={HoursDirections} path="/hours-directions" />
            <Route name="Sales" component={Sales} path="/sales" />
            <Route name="Sales" component={Sales} path="/sales-offers" />
            <Route name="Sales" component={SalesSingle} path="/sales/:salesSlug" />
            <Route name="Sale Submission" component={SubmissionSales} path="/sale-submission" />
            <Route name="Events" component={Events} path="/events" />
            <Route name="Event" component={EventSingle} path="/events/:eventSlug" />
            <Route name="Blogs" component={Blogs} path="/blog" />
            <Route name="Event Submission" component={SubmissionEvent} path="/event-submission" />
            <Route name="Directory" component={Directory} path="/directory" />
            <Route name="Stores" component={Stores} path="/stores/:storeSlug" />
            <Route name="Jobs" component={Jobs} path="/jobs" />
            <Route name="Job" component={JobSingle} path="/jobs/:jobSlug" />
            <Route name="Job Submission" component={SubmissionJobs} path="/job-submission" />
            <Route name="Leasing" component={Leasing} path="/leasing" />
            <Route name="Holiday" component={Holiday} path="/holiday" />
            <Route name="Deal of the Day" component={DealOfTheDay} path="/deal" />
            <Route name="Renovation" component={Renovation} path="/renovation" />
            <Route name="Interactive Map" component={InteractiveMap} path="/interactive-map" />
            <Route name="Default Page" component={Default} path="/:pageSlug" />
        </Route>
    </Router>
);

export default Root;