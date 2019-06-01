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
import FeaturedEvent from '../components/FeaturedEvent';
import InteriorHeader from '../components/InteriorHeader';
import EventsList from '../components/EventsList';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const EventsData = SiteURL + '/wp-json/wp/v2/events?per_page=100';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class Events extends Component{
    constructor(props) {
        super(props);

        this.eventNameFilter = this.eventNameFilter.bind(this);

        this.state = {
            data: false,
            siteData: '',
            optionsData: '',
            pageData: '',
            eventsData: '',
        };
    }

    componentWillMount(){
        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=events'),
                axios.get(PropertyOptions),
                axios.get(EventsData),
            ])
            .then(axios.spread(function (site, page, options, events){

                component.setState({
                    data: true,
                    siteData: site.data,
                    optionsData: options.data,
                    pageData: page.data[0],
                    eventData: events.data,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    eventNameFilter = (e) => {

        this.setState({
            searchFilter: e.target.value,
        })

        let filterValue = this.state.searchFilter.toLowerCase();
        let eventValue;

        $('#event-categories').val('all');

        if (filterValue) {
            $('#event-submit').addClass('active');
        } else {
            $('#event-submit').removeClass('active');
        }

        $('.event').each(function () {
            eventValue = $(this).data('filter');
            if (eventValue.indexOf(filterValue) === -1) {
                // $(this).slideUp();
                $(this).hide();
            }
            else {
                $(this).show();
            }
        });
    }

    render(){
        if(this.state.data){
            console.log(this.state.pageData);
            return(
                <div className="template-events" data-page="events">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '')  + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader
                        title={this.state.pageData.acf.title ? this.state.pageData.acf.title : this.state.pageData.title.rendered}
                        titleCopy={this.state.pageData.acf.title_copy}
                        color={this.state.pageData.acf.title_section_color}
                        aboveBelow={this.state.pageData.acf.above_below}
                        imageMobile={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_desktop : false}
                    />

                    <div className="featured-event-container">
                        <img className="branches one" src={Images + 'branches1.png'} alt="branches"/>
                        {this.state.pageData.acf.featured_event_image &&
                        <img className="foreground visible-md visible-lg"
                             src={this.state.pageData.acf.featured_event_image.url}
                             alt={entities.decode(this.state.pageData.title.rendered) + ' featured'}
                        />
                        }
                        <FeaturedEvent event={this.state.pageData.acf.featured_event.ID}/>
                    </div>

                    <div className="filters">
                        <div className="container">
                            <div className="filter-wrap">
                                <form action="" id="event-search" onSubmit={this.clearEventNameFilter}>
                                    <label className="input-label" for="event-name">
                                        <span className="sr-only">Event Name</span>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            id="event-name"
                                            value={this.state.searchFilter}
                                            onChange={this.eventNameFilter}
                                        />
                                    </label>
                                    <label className="submit-label" for="event-submit">
                                        <span className="sr-only">Search event</span>
                                        <input type="submit" id="event-submit"/>
                                    </label>
                                </form>
                            </div>
                        </div>
                    </div>

                    <EventsList eventsData={this.state.eventData} />

                </div>
            );
        }
        return <Loader />;
    }
}


export default Events;
