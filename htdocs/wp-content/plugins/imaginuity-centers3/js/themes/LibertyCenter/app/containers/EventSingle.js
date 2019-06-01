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
import InteriorHeader from '../components/InteriorHeader';
import FooterLinks from '../components/FooterLinks';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const EventsData = SiteURL + '/wp-json/wp/v2/events/';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";
let EventCategories = SiteURL + '/wp-json/wp/v2/event_categories?per_page=100';

class EventSingle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            eventSlug: this.props.params.eventSlug,
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
        this.retrieveEventData();
    }

    componentWillReceiveProps(nextProps) {
        // Handles navigation between interior pages (pages of the same template)
        if (nextProps.params.eventSlug !== this.state.eventSlug) {
            this.setState({
                data: false,
                eventSlug: nextProps.params.eventSlug
            }, function () {
                this.retrieveEventData();
            });
        }
    }

    retrieveEventData(){

        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
            axios.get(Pages + '?slug=events'),
            axios.get(EventsData + '?slug=' + this.props.params.eventSlug),
            axios.get(EventCategories),
        ])
            .then(axios.spread(function (site, home, options, eventPageData, pageData, categoryData) {

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
                    monthDate = moment(pageData.data[0].acf.start_date).format('M/D/Y');
                }
                else if (moment(pageData.data[0].acf.start_date) !== moment(pageData.data[0].acf.end_date)) {
                    monthDate = moment(pageData.data[0].acf.start_date).format('M/D/Y') + ' - ' + moment(pageData.data[0].acf.end_date).format('M/D/Y');
                }

                let catLength = pageData.data[0].event_categories.length;
                let catCount = 0;
                let categories = pageData.data[0].event_categories.map((categoryID) => {
                    let categoryMatches = categoryData.data.map((category) => {
                        if (category.id === categoryID) {
                            catCount++;
                            return (category.name + (catCount < catLength && catCount > 0 ? ', ' : ''));
                        }
                    });
                    return categoryMatches;
                });

                let eventTitle = entities.decode(pageData.data[0].title.rendered);

                //TODO debug for multi day events
                let googleCalTime = moment(pageData.data[0].acf.start_date).format('YYYYMMDD') + 'T' + moment(pageData.data[0].acf.start_time, 'h:mm a').format('kkmm') + "00/" + moment(pageData.data[0].acf.end_date).format('YYYYMMDD') + 'T' + moment(pageData.data[0].acf.end_time, 'h:mm a').format('kkmm') + '00';

                let googleCalendarLink = "https://calendar.google.com/calendar/r/eventedit?text=" + eventTitle + "&dates=" + googleCalTime + "&details=For+details,+link+here:" + pageData.data[0].link + "&location=" + pageData.data[0].acf.address;

                //TODO iCal link is wrong..
                let iCalLink = "https://calendar.google.com/calendar/ical/text=" + eventTitle + "&dates=" + googleCalTime + "&details=For+details,+link+here:" + pageData.data[0].link + "&location=" + pageData.data[0].acf.address + "/public/basic.ics";

                // let address = pageData.data[0].acf.address;
                //
                // let mapAddress = address.replace(/(<([^>]+)>)/ig, "").replace(/,/g, "").replace(/ /g, "+");


                console.log(pageData);

                let eventData =
                    <Row
                        data-store={relatedStore}
                        id={pageData.data[0].id}
                        className='event'
                    >
                        <Col xs={12} sm={6}>
                            <div className="content-wrapper">
                                {monthDate !== 'Invalid date' &&
                                <div className="month-date">
                                    {monthDate}
                                </div>
                                }
                                <h1 className="title">
                                    {eventTitle}
                                </h1>
                                {relatedStore &&
                                <Link className="related" key={pageData.data[0].acf.related_store.ID}
                                      to={'/stores/' + pageData.data[0].acf.related_store.post_name + '/'}
                                      storeID={pageData.data[0].acf.related_store.post_name}>
                                    {entities.decode(pageData.data[0].acf.related_store.post_title)}
                                </Link>
                                }
                                {timeString &&
                                <div className="time">
                                    {timeString}
                                </div>
                                }
                                {pageData.data[0].acf.location_link &&
                                <Link className="location-link" to={pageData.data[0].acf.location_link.url}
                                      target={pageData.data[0].acf.location_link.target}>
                                    {pageData.data[0].acf.location_link.title}
                                </Link>
                                }
                                {pageData.data[0].acf.featured_image &&
                                <img src={pageData.data[0].acf.featured_image} className="img-responsive visible-xs"
                                     alt={eventTitle + ' feature'}/>
                                }
                                <div className="content" dangerouslySetInnerHTML={{__html: content}}></div>
                            </div>

                        </Col>

                        <Col xs={12} sm={6}>
                            <div className="details-wrapper">
                                {pageData.data[0].acf.featured_image &&
                                <img src={pageData.data[0].acf.featured_image} className="img-responsive hidden-xs"
                                     alt={eventTitle + ' feature'}/>
                                }
                                <div className="button-wrapper">
                                    <Link className="liberty-button brown" to={googleCalendarLink} target="_blank">
                                        Add to Google Calendar
                                    </Link>
                                </div>
                                {catLength > 0 &&
                                <div className="event-categories">
                                    <div>Event Categories:</div>
                                    <div>{categories}</div>
                                </div>
                                }
                                {pageData.data[0].acf.address &&
                                <div className="venue">
                                    <div>Venue:</div>
                                    <div className="address"
                                         dangerouslySetInnerHTML={{__html: pageData.data[0].acf.address}}></div>
                                    <Link className="maps-link"
                                          to={"//maps.google.com/?q=" + pageData.data[0].acf.address.replace(/(<([^>]+)>)/ig, "").replace(/,/g, "").replace(/ /g, "+")} target="_blank">Google Map
                                        It</Link>
                                </div>
                                }
                            </div>
                        </Col>

                    </Row>

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    eventPageData: eventPageData.data[0],
                    pageData: pageData.data[0],
                    eventData: eventData,
                    metaDescription: metaDescription,
                    categories: categories,
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
                    <InteriorHeader
                        imageMobile={this.state.eventPageData.acf.use_featured_image ? this.state.eventPageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.eventPageData.acf.use_featured_image ? this.state.eventPageData.acf.header_featured_image_desktop : false}
                    />
                    <div className="event-main container">
                        {this.state.eventData}
                    </div>
                    <EventRecommend categories={this.state.pageData.event_categories} id={this.state.pageData.id}/>
                    <FooterLinks optionsData={this.state.optionsData}/>
                </section>
            );
        }
        return <Loader/>;
    }
}

export default EventSingle;