// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import Slider from 'react-slick';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import DatesSlider from '../components/DatesSlider';
import FeaturedEvents from '../components/FeaturedEvents';
import EventsList from '../components/EventsList';
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
            error: false,
            siteData: '',
            homeData: '',
            enableSignup: '',
            optionsData: '',
            pageData: '',
            heroImage: '',
            eventsData: '',
            featuredEventIDs: '',
        };
    }

    componentWillMount(){
        const component = this;
        let data = [];

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=events'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
            axios.get(EventsData),
        ])
            .then(axios.spread(function(site, page, home, options, events){
                let queries = [];
                if(events.headers['x-wp-totalpages'] > 1){
                    let paginationCount = events.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        queries.push(axios.get(EventsData + '&page=' + x));
                        x++;
                    }
                    axios.all(queries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.handleDataResponse(site, page, home, options, data);
                        })
                        .catch((err) => {
                            console.log('error in queries');
                            console.log(err);
                            component.setState({
                                error: true,
                            })
                        })
                }
                else{
                    component.handleDataResponse(site, page, home, options, events.data);
                }
            }))
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });
    }
    
    handleDataResponse(site, page, home, options, events){
        this.setState({
            siteData: site.data,
            homeData: home.data[0],
            enableSignup: home.data[0].acf.enable_mail_signup,
            optionsData: options.data,
            pageData: page.data[0],
            heroImage: page.data[0].acf.hero_image,
            eventsData: events,
            featuredEvents: (page.data[0].acf.featured_events ? page.data[0].acf.featured_events : false),
            data: true,
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

                    <DatesSlider />

                    {this.state.pageData.acf.enable_featured_events &&
                    <FeaturedEvents eventsData={this.state.eventsData} featuredEvents={this.state.featuredEvents} optionsData={this.state.optionsData} />
                    }

                    <EventsList eventsData={this.state.eventsData} categories={this.state.categoryData} optionsData={this.state.optionsData} />

                    {this.state.optionsData.acf.enable_event_submissions &&
                    <div className="submission-button">
                        <p className="text-uppercase font-color-setter">Retailers:</p>
                        <Link to={'/event-submission/'}
                              className="btn border-color-setter font-color-setter text-uppercase">Post an Event</Link>
                    </div>
                    }

                    <div className="clearfix"></div>

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
