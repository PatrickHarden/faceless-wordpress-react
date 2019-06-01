// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import FeaturedEvent from '../components/FeaturedEvent';
import EventsList from '../components/EventsList';
import Signup from '../components/Signup';
import Loader from '../components/Loader';

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
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=events'),
                axios.get(Pages + '?slug=home'),
                axios.get(PropertyOptions),
                axios.get(EventsData),
                axios.get(EventCategories),
            ])
            .then(axios.spread(function (site, page, home, options, events, categories) {

                component.setState({
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
            }))
            .catch((err) => {
                console.log(err);
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

                    {this.state.pageData.acf.enable_featured_event &&
                    <FeaturedEvent eventData={this.state.pageData} />
                    }

                    <hr className="border-color-setter-lighter" />

                    <EventsList eventsData={this.state.eventData} categories={this.state.categoryData} />

                    {this.state.enableSignup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                </div>
            );
        }
        return <Loader />;
    }
}


export default Events;
