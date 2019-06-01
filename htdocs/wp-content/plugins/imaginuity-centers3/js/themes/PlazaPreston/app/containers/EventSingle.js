// Packages
import React, {Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let moment = require('moment');
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import EventRecommend from '../components/EventRecommend';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const EventsData = SiteURL + '/wp-json/wp/v2/events/';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class EventSingle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            event: this.props.params.eventSlug,
            page: this.props.page,
            eventData: false,
            title: '',
            siteData: '',
            homeData: '',
            eventPageData: '',
            optionsData: '',
            pageData: '',
            metaDescription: '',
        };
    }

    componentWillMount() {

        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
            axios.get(Pages + '?slug=events'),
            axios.get(EventsData + '?slug=' + this.props.params.eventSlug),
        ])
            .then(axios.spread(function (site, home, options, eventPageData, pageData) {

                console.log(pageData);

                let metaDescription;

                if (options.data.acf.use_custom_event_meta_description) {
                    metaDescription = options.data.acf.custom_event_meta_description;
                    metaDescription = metaDescription.replace('%EVENT%', entities.decode(pageData.data[0].title.rendered));
                }
                else {
                    metaDescription = options.data.acf.meta_description;
                }

                let content;
                if (pageData.data[0].acf.post_copy) {
                    content = (pageData.data[0].acf.post_copy ? entities.decode(pageData.data[0].acf.post_copy) : '');
                }
                else {
                    content = '';
                }

                let relatedStore = (typeof pageData.data[0].acf.related_store ? pageData.data[0].acf.related_store.ID : false);
                let startDate = (pageData.data[0].acf.start_date ? moment(pageData.data[0].acf.start_date).format('M/D/YY') : 'TBD');
                let endDate = (pageData.data[0].acf.end_date ? moment(pageData.data[0].acf.end_date).format('M/D/YY') : 'TBD');
                let dateString = (startDate == 'TBD' && endDate == 'TBD' ? 'TBD' : startDate + ' - ' + endDate);
                if (startDate == endDate) {
                    dateString = startDate;
                }

                let startTime = (pageData.data[0].acf.start_time ? moment(pageData.data[0].acf.start_time, 'h:mm a').format('h:mm a') : 'TBD');
                let endTime = (pageData.data[0].acf.end_time ? moment(pageData.data[0].acf.end_time, 'h:mm a').format('h:mm a') : 'TBD');
                let timeString = startTime !== endTime ? (startTime == 'TBD' && endTime == 'TBD' ? 'All Day' : startTime + ' - ' + endTime) : (startTime == 'TBD' ? 'TBD' : startTime);
                timeString = startTime == 'TBD' && endTime == 'TBD' ? 'All Day' : timeString;
                if (moment(pageData.data[0].acf.end_time, 'h:mm a').diff(moment(pageData.data[0].acf.start_time, 'h:mm a')) == 86340000 || moment(pageData.data[0].acf.start_time, 'h:mm a').diff(moment(pageData.data[0].acf.end_time, 'h:mm a')) == -86340000) {
                    timeString = 'All Day';
                }

                let weekDate;
                let monthDate;

                weekDate = (pageData.data[0].acf.start_date === pageData.data[0].acf.end_date) ? moment(pageData.data[0].acf.start_date).format('dddd') : (moment(pageData.data[0].acf.start_date).format('dddd') + ' - ' + moment(pageData.data[0].acf.end_date).format('dddd'));

                if (pageData.data[0].acf.start_date === pageData.data[0].acf.end_date) {
                    monthDate = moment(pageData.data[0].acf.start_date).format('MMMM D');
                }
                else if (moment(pageData.data[0].acf.start_date).format('MMMM') !== moment(pageData.data[0].acf.end_date).format('MMMM')) {
                    monthDate = moment(pageData.data[0].acf.start_date).format('MMM D') + ' - ' + moment(pageData.data[0].acf.end_date).format('MMM D');
                }
                else {
                    monthDate = moment(pageData.data[0].acf.start_date).format('MMMM D') + ' - ' + moment(pageData.data[0].acf.end_date).format('D');
                }

                let eventTitle = entities.decode(pageData.data[0].title.rendered);
                let eventData =
                    <div
                        data-store={relatedStore}
                        id={pageData.data[0].id}
                        className='event'
                    >
                        {pageData.data[0].acf.featured_image &&
                        <Col xs={12} md={6}
                            className="image-container"
                        >
                            <img src={pageData.data[0].acf.featured_image} className="img-responsive"
                                 alt={eventTitle + ' feature'}/>
                        </Col>
                        }
                        <Col xs={12} md={6}
                            className="background-color-setter content-wrapper"
                        >
                            {weekDate !== 'Invalid date' && monthDate !== 'Invalid date' &&
                            <h3>
                                <div className="week-date">
                                    <small>{weekDate}</small>
                                </div>
                                <div className="month-date">
                                    {monthDate}
                                </div>
                            </h3>
                            }
                            <p>{timeString}</p>
                            <h2 className="title">
                                {eventTitle}<br/>
                                {relatedStore &&
                                <Link key={pageData.data[0].acf.related_store.ID}
                                      to={'/stores/' + pageData.data[0].acf.related_store.post_name + '/'}
                                      storeID={pageData.data[0].acf.related_store.post_name}>
                                    <small>{entities.decode(pageData.data[0].acf.related_store.post_title)}</small>
                                </Link>
                                }
                            </h2>

                            <div className="content" dangerouslySetInnerHTML={{__html: content}}></div>
                        </Col>
                    </div>

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    eventPageData: eventPageData.data[0],
                    pageData: pageData.data[0],
                    eventData: eventData,
                    metaDescription: metaDescription,
                });

            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if (this.state.data) {
            return (
                <section className="event-single">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />
                    <div
                        className="header"
                        style={{'backgroundColor': this.state.eventPageData.acf.header_color_picker ? this.state.eventPageData.acf.header_color_picker : '#908E7D'}}
                    >
                        <div className="container">
                            <Link to="/events">{'<'} Return to the Events</Link>
                        </div>
                    </div>
                    <img className="branches one" src={Images + 'branches1.png'} alt="branches"/>
                    <div className="event-main container">
                        <Row>
                            {this.state.eventData}
                        </Row>
                    </div>
                    <EventRecommend categories={this.state.pageData.event_categories} id={this.state.pageData.id}/>
                </section>
            );
        }
        return <Loader/>;
    }
}

export default EventSingle;