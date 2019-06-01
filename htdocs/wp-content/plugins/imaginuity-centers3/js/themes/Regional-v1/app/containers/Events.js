// Packages
import React, {PropTypes, Component} from 'react';
import { Link} from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import Hours from '../components/Hours';
import FeaturedEvent from '../components/FeaturedEvent';
import EventsList from '../components/EventsList';
import GoogleMapStatic from '../components/GoogleMapStatic';
import Signup from '../components/Signup';
import Loader from '../components/Loader';
import EventsSubmission from '../components/EventsSubmission';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const EventsData = SiteURL + '/wp-json/wp/v2/events?per_page=100';
const EventCategories = SiteURL + '/wp-json/wp/v2/event_categories';

class Events extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            enableSignup: '',
            optionsData: '',
            pageData: '',
            heroImage: '',
            eventsData: '',
            categoryData: '',
        };
    }

    componentWillMount(){
        const component = this;



        axios.all([
            axios.get(EventsData),
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=events'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
            axios.get(EventCategories),
        ])
            .then(axios.spread(function(eventsData, site, page, home, options, categories){

                let eventsQueries = [];
                let data = [];

                if(eventsData.headers['x-wp-totalpages'] > 1){
                    let paginationCount = eventsData.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        eventsQueries.push(axios.get(SalesData + '&page=' + x));
                        x++;
                    }
                    axios.all(eventsQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.setEventsData(eventsData, site, home, options, page, categories);
                        })
                        .catch((err) => {
                            console.log('error in eventsQueries');
                            console.log(err);
                        })
                }
                else{
                    data = eventsData.data;
                    component.setEventsData(eventsData, site, home, options, page, categories);
                }

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    setEventsData(events, site, home, options, page, categories){
        console.log(events.data);
        this.setState({
            data: true,
            siteData: site.data,
            homeData: home.data[0],
            enableSignup: home.data[0].acf.enable_mail_signup,
            optionsData: options.data,
            pageData: page.data[0],
            heroImage: page.data[0].acf.hero_image,
            eventData: events.data,
            categoryData: categories.data,
        });
    }

    render(){
        if(this.state.data){
            return(
                <div className="template-events" data-page="events">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '')  + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    <span className="hidden-xs hidden-sm">
                        <Hours optionsData={this.state.optionsData} />
                    </span>

                    {this.state.pageData.acf.enable_featured_event &&
                    <FeaturedEvent eventData={this.state.pageData} />
                    }

                    <hr className="border-color-setter-lighter" />

                    <EventsList eventsData={this.state.eventData} categories={this.state.categoryData} pageData={this.state.pageData} />

                    {this.state.optionsData.acf.enable_event_submissions &&
                    <div className="submission-button">
                        <p className="text-uppercase font-color-setter">Retailers:</p>
                        <Link to={'/event-submission/'}
                              className="btn border-color-setter font-color-setter text-uppercase">Post an Event</Link>
                    </div>
                    }

                    <GoogleMapStatic optionsData={this.state.optionsData} homeData={this.state.homeData} />

                    {this.state.enableSignup &&
                    <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    <FacebookPixel pageData={this.state.pageData} />
                </div>
            );
        }
        else if(this.state.error){
            return(
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2>An error occurred retrieving the Events.</h2>
                            <p>Please refresh the page and try again. If this error continues, please <Link to={'/contact-us'}>contact us</Link> and report the issue.</p>
                            <br/>
                        </Col>
                    </Row>
                </Grid>
            )
        }
        return <Loader />;
    }
}


export default Events;
