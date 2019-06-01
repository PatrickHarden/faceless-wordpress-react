// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let moment = require('moment');
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from '../components/Loader';
import EventSchema from '../components/schema/EventScheme';
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import PageLayout from '../components/PageLayout';
import Signup from '../components/Signup';
import GravityForm from '../components/GravityForm';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const EventsData = SiteURL + '/wp-json/wp/v2/events/';

class EventSingle extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: false,
            event: this.props.params.eventSlug,
            page: this.props.page,
            signleEventData: false,
            title: '',
            siteData: '',
            homeData: '',
            eventPageData: '',
            optionsData: '',
            pageData: '',
            metaDescription: '',
        };
    }

    componentWillMount(){

        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(PropertyOptions),
                axios.get(Pages + '?slug=events'),
                axios.get(EventsData + '?slug=' + this.props.params.eventSlug),
            ])
            .then(axios.spread(function(site, home, options, pageData, eventData) {

                let eventData_ = eventData.data[0];
                let metaDescription;
                let useCustomMeta = eventData_.acf.use_custom_meta_description;

                if (useCustomMeta) {
                    metaDescription = eventData_.acf.meta_description;
                }
                else if(options.data.acf.use_custom_event_meta_description){
                    metaDescription = options.data.acf.custom_event_meta_description;
                    metaDescription = metaDescription.replace('%EVENT%', entities.decode(eventData_.title.rendered));
                    metaDescription = metaDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    metaDescription = metaDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    metaDescription = metaDescription.replace('%CENTERNAME%', entities.decode(site.name));
                }
                else{
                    metaDescription = options.data.acf.meta_description;
                }

                let content;
                if(eventData_.acf.post_copy){
                    content = (eventData_.acf.post_copy ? entities.decode(eventData_.acf.post_copy) : '');
                }
                else{
                    content = '';
                }

                let relatedStore = (typeof eventData_.acf.related_store ? eventData_.acf.related_store.ID : false);
                let startDate = (eventData_.acf.start_date ? moment(eventData_.acf.start_date).format('M/D/YY') : 'TBD');
                let endDate = (eventData_.acf.end_date ? moment(eventData_.acf.end_date).format('M/D/YY') : 'TBD');
                let dateString = (startDate == 'TBD' && endDate == 'TBD' ? 'TBD' : startDate + ' - ' + endDate);
                if(startDate == endDate){
                    dateString = startDate;
                }

                let startTime = (eventData_.acf.start_time ? moment(eventData_.acf.start_time, 'h:mm a').format('h:mm a') : 'TBD');
                let endTime = (eventData_.acf.end_time ? moment(eventData_.acf.end_time, 'h:mm a').format('h:mm a') : 'TBD');
                let timeString = startTime !== endTime ? (startTime == 'TBD' && endTime== 'TBD' ? 'All Day' : startTime + ' - ' + endTime) : (startTime == 'TBD' ? 'TBD' : startTime );
                timeString = startTime == 'TBD' && endTime == 'TBD' ? 'All Day' : timeString;
                if(moment(eventData_.acf.end_time, 'h:mm a').diff(moment(eventData_.acf.start_time, 'h:mm a')) == 86340000 || moment(eventData_.acf.start_time, 'h:mm a').diff(moment(eventData_.acf.end_time, 'h:mm a')) == -86340000){
                    timeString = 'All Day';
                }

                let eventTitle = entities.decode(eventData_.title.rendered);
                let singleEventData =
                    <Col xs={12} data-store={relatedStore} data-category={(eventData_.categories ? eventData_.categories[0] : null)} id={eventData_.id} className='event font-color-setter'>
                        <Row>
                            {eventData_.acf.featured_image &&
                            <Col xs={12} sm={4} className="image-container">
                                <img src={eventData_.acf.featured_image} className="img-responsive" alt={eventTitle + ' feature'} />
                            </Col>
                            }
                            <Col xs={12} sm={8}>
                                <h2>
                                    {eventTitle}<br/>
                                    {relatedStore &&
                                    <Link key={eventData_.acf.related_store.ID} to={'/stores/'+eventData_.acf.related_store.post_name} storeID={eventData_.acf.related_store.post_name}>
                                        <small>{eventData_.acf.related_store.post_title}</small>
                                    </Link>
                                    }
                                </h2>
                                <p><b>Date</b>: {dateString}</p>
                                <p>{timeString}</p>
                                <div className="content" dangerouslySetInnerHTML={{ __html: content}}></div>
                            </Col>
                        </Row>
                    </Col>

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    eventData: eventData_,
                    pageData: pageData.data[0],
                    singleEventData: singleEventData,
                    metaDescription: metaDescription,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    externalLinkChecker(){
        $('a').each(function() {
            let a = new RegExp('/' + window.location.host + '/');
            if(!a.test(this.href)) {
                $(this).attr('target', '_blank');
            }
        });
    }

    render(){
        if(this.state.data){
            return (
                <section className="event-single">
                    <EventSchema
                        propertyOptions={this.state.optionsData}
                        image={this.state.eventData.acf.featured_image}
                        title={entities.decode(this.state.eventData.title.rendered)}
                        description={entities.decode(this.state.eventData.acf.post_copy)}
                        startDate={this.state.eventData.acf.start_date}
                        startTime={this.state.eventData.acf.start_time}
                        endDate={this.state.eventData.acf.end_date}
                        endTime={this.state.eventData.acf.end_time}
                    />
                    <Helmet
                        title={'Event - ' + entities.decode(this.state.eventData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} secondaryTitle={entities.decode(this.state.eventData.title.rendered)} />

                    {this.state.singleEventData}
                    
                    {this.state.eventData.acf.gravity_form &&
                        <Grid>
                            <Row>
                                <Col xs={12}>
                                    <GravityForm gformID={this.state.eventData.acf.gravity_form.id} />
                                </Col>
                            </Row>
                        </Grid>
                    }

                    {this.state.homeData.acf.enable_mail_signup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    <div className="hidden">{setTimeout(this.externalLinkChecker(), 2000)}</div>
                </section>
            );
        }
        return <Loader />;
    }
}

export default EventSingle;