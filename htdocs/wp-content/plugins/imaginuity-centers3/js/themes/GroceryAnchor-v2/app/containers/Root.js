// Packages
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import axios from 'axios';
import ReactGA from 'react-ga';

// Containers
import Main from './Main';
import Home from './Home';
import Holiday from './Holiday';
import HoursDirections from './HoursDirections';
import Information from './Information';
import Sales from './Sales';
import SalesSingle from './SaleSingle';
import Search from './Search';
import Events from './Events';
import EventSingle from './EventSingle';
import Stores from './StoreSingle';
import Jobs from './Jobs';
import JobSingle from './JobSingle';
import Coupons from './Coupons';
import SubmissionJobs from './SubmissionJobs';
import SubmissionSales from './SubmissionSale';
import Renovation from './Renovation';
import InteractiveMap from './InteractiveMap';
import Default from './Default';

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

const Root = ({ store }) => (
    <Provider store={store}>
        <Router history={browserHistory}
                onUpdate={() => {
                    if(googleAnalyticsEnabled){
                        logPageView();
                    }
                    window.scrollTo(0, 0);
                }}>
            <Route path="/" component={Main}>
                <IndexRoute name="Home" component={Home} />
                <Route name="Holiday" component={Holiday} path="/holiday" />
                <Route name="Hours & Directions" component={HoursDirections} path="/hours-directions" />
                <Route name="Information" component={Information} path="/information" />
                <Route name="Sales" component={Sales} path="/sales" />
                <Route name="Sales" component={Sales} path="/sales-offers" />
                <Route name="Sales" component={SalesSingle} path="/sales/:salesSlug" />
                <Route name="Search" component={Search} path="/search" />
                <Route name="Sale Submission" component={SubmissionSales} path="/sale-submission" />
                <Route name="Events" component={Events} path="/events" />
                <Route name="Event" component={EventSingle} path="/events/:eventSlug" />
                <Route name="Stores" component={Stores} path="/stores/:storeSlug" />
                <Route name="Jobs" component={Jobs} path="/jobs" />
                <Route name="Job" component={JobSingle} path="/jobs/:jobSlug" />
                <Route name="Job Submission" component={SubmissionJobs} path="/job-submission" />
                <Route name="Coupons" component={Coupons} path="/coupons" />
                <Route name="Renovation" component={Renovation} path="/renovation" />
                <Route name="Interactive Map" component={InteractiveMap} path="/map" />
                <Route name="Interactive Map" component={InteractiveMap} path="/interactive-map" />
                <Route name="Default Page" component={Default} path="/:pageSlug" />
            </Route>
        </Router>
    </Provider>
);

export default Root;