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
import EventsList from '../components/EventsList';
import FeaturedEvent from '../components/FeaturedEvent';
import Loader from '../components/Loader';
import InteriorHeader from '../components/InteriorHeader';
import FooterLinks from '../components/FooterLinks';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const EventsData = SiteURL + '/wp-json/wp/v2/events?per_page=100';
const EventCategories = SiteURL + '/wp-json/wp/v2/event_categories';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

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
            categoryData: '',
            searchFilter: this.props.location.query.s ? this.props.location.query.s : '',
        };
    }

    componentWillMount(){
        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=events'),
            axios.get(PropertyOptions),
            axios.get(EventsData),
            axios.get(EventCategories),
        ])
            .then(axios.spread(function (site, page, options, events, categories){

                // console.log(events.data[0]);

                let categoryData = categories.data.map((category) => {
                    return (
                        <option value={category.id}>{entities.decode(category.name)}</option>
                    );
                });

                component.setState({
                    data: true,
                    siteData: site.data,
                    optionsData: options.data,
                    pageData: page.data[0],
                    eventData: events.data,
                    categoryData: categoryData,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    expandCalendar = (e) => {
        e.preventDefault();
        $('.date-range-picker-container').addClass('open');
        $('body').css({'overflow': 'hidden'});
    }

    closeCalendar = (e) => {
        e.preventDefault();
        $('.date-range-picker-container').removeClass('open');
        $('body').css({'overflow': 'visible'});
    }

    componentDidMount() {
        if (this.state.searchFilter) {
            $('#event-submit').addClass('active');
        }
    }

    eventNameFilter = (e) => {

        this.setState({
            searchFilter: e.target.value,
        });

        console.log("search filter", this.state.searchFilter);
        console.log("target value", e.target.value);

        let filterValue = e.target.value.toLowerCase();
        let eventValue;

        if (filterValue) {
            $('#event-submit').addClass('active');
        } else {
            $('#event-submit').removeClass('active');
        }

        $('.event-wrapper').each(function () {
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

    clearEventNameFilter = (e) => {
        e.preventDefault();

        $('#event-submit').removeClass('active');
        $('#event-name').val('');

        $('.event-wrapper').each(function () {
            $(this).show();
        });
        this.setState({
            searchFilter: '',
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
                    <InteriorHeader
                        title={this.state.pageData.acf.title ? this.state.pageData.acf.title : this.state.pageData.title.rendered}
                        imageMobile={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_desktop : false}
                    />
                    <img className="liberfly hidden-xs" src={Images + 'liberfly.png'} alt="flower"/>
                    <div className="featured-events-container">
                        {this.state.pageData.acf.featured_event &&
                        <FeaturedEvent pageData={this.state.pageData} />
                        }
                    </div>
                    <Grid>
                        <Row>
                            <Col xs={12} className="header-wrapper background-color-setter">
                                <div className="filters">
                                    <form action="" id="event-search" onSubmit={this.clearEventNameFilter}>
                                        <label className="input-label" for="event-name">
                                            <span className="sr-only">Event Name</span>
                                            <input
                                                type="text"
                                                placeholder="Search Event"
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
                            </Col>
                        </Row>
                    </Grid>
                    <EventsList eventsData={this.state.eventData} categories={this.state.categoryData} eventSearch={this.state.searchFilter} />
                    <FooterLinks optionsData={this.state.optionsData}/>
                </div>
            );
        }
        return <Loader />;
    }
}


export default Events;
