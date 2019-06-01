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
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import PageLayout from '../components/PageLayout';
import GravityForm from '../components/GravityForm';
import GoogleMapStatic from '../components/GoogleMapStatic';
import Signup from '../components/Signup';
import Loader from '../components/Loader';
import FacebookPixel from '../components/FacebookPixel';

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

    componentWillMount(){

        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(PropertyOptions),
                axios.get(Pages + '?slug=events'),
                axios.get(EventsData + '?slug=' + this.props.params.eventSlug),
            ])
            .then(axios.spread(function(site, home, options, eventPageData, pageData) {

                let pageData_ = pageData.data[0];
                let metaDescription;
                let useCustomMeta = pageData_.acf.use_custom_meta_description;

                if (useCustomMeta) {
                    metaDescription = pageData_.acf.meta_description;
                }
                else if(options.data.acf.use_custom_event_meta_description){
                    metaDescription = options.data.acf.custom_event_meta_description;
                    metaDescription = metaDescription.replace('%EVENT%', entities.decode(pageData_.title.rendered));
                    metaDescription = metaDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    metaDescription = metaDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    metaDescription = metaDescription.replace('%CENTERNAME%', entities.decode(site.name));
                }
                else{
                    metaDescription = options.data.acf.meta_description;
                }

                let content;
                if(pageData_.acf.post_copy){
                    content = (pageData_.acf.post_copy ? entities.decode(pageData_.acf.post_copy) : '');
                }
                else{
                    content = '';
                }

                let relatedStore = (typeof pageData_.acf.related_store ? pageData_.acf.related_store.ID : false);
                let startDate = (pageData_.acf.start_date ? moment(pageData_.acf.start_date).format('M/D/YY') : 'TBD');
                let endDate = (pageData_.acf.end_date ? moment(pageData_.acf.end_date).format('M/D/YY') : 'TBD');
                let dateString = (startDate == 'TBD' && endDate == 'TBD' ? 'TBD' : startDate + ' - ' + endDate);
                if(startDate == endDate){
                    dateString = startDate;
                }

                let startTime = (pageData_.acf.start_time ? moment(pageData_.acf.start_time, 'h:mm a').format('h:mm a') : 'TBD');
                let endTime = (pageData_.acf.end_time ? moment(pageData_.acf.end_time, 'h:mm a').format('h:mm a') : 'TBD');
                let timeString = startTime !== endTime ? (startTime == 'TBD' && endTime== 'TBD' ? 'All Day' : startTime + ' - ' + endTime) : (startTime == 'TBD' ? 'TBD' : startTime );
                timeString = startTime == 'TBD' && endTime == 'TBD' ? 'All Day' : timeString;
                if(moment(pageData_.acf.end_time, 'h:mm a').diff(moment(pageData_.acf.start_time, 'h:mm a')) == 86340000 || moment(pageData_.acf.start_time, 'h:mm a').diff(moment(pageData_.acf.end_time, 'h:mm a')) == -86340000){
                    timeString = 'All Day';
                }

                let eventTitle = entities.decode(pageData_.title.rendered);
                let eventData =
                    <Col xs={12} data-store={relatedStore} data-category={(pageData_.categories ? pageData_.categories[0] : null)} id={pageData_.id} className='event font-color-setter'>
                        <Row>
                            {pageData_.acf.featured_image &&
                            <Col xs={12} sm={2} smOffset={2} className="image-container">
                                <img src={pageData_.acf.featured_image} className="img-responsive" alt={eventTitle + ' feature'} />
                            </Col>
                            }
                            <Col xs={12} sm={6} smOffset={pageData_.acf.featured_image ? 0 : 2}>
                                <h2>
                                    {eventTitle}<br/>
                                    {relatedStore &&
                                    <Link key={pageData_.acf.related_store.ID} to={'/stores/'+pageData_.acf.related_store.post_name+'/'} storeID={pageData_.acf.related_store.post_name}>
                                        <small>{entities.decode(pageData_.acf.related_store.post_title)}</small>
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
                    eventPageData: eventPageData.data[0],
                    pageData: pageData_,
                    eventData: eventData,
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
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.eventPageData} />

                    {this.state.eventData}

                    {this.state.pageData.acf.gravity_form &&
                        <Grid>
                            <Row>
                                <Col xs={12}>
                                    <GravityForm gformID={this.state.pageData.acf.gravity_form.id} />
                                </Col>
                            </Row>
                        </Grid>
                    }

                    <GoogleMapStatic optionsData={this.state.optionsData} homeData={this.state.homeData} />
                    {this.state.homeData.acf.enable_mail_signup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    <FacebookPixel pageData={this.state.pageData} />
                    <div className="hidden">{setTimeout(this.externalLinkChecker(), 2000)}</div>
                </section>
            );
        }
        return <Loader />;
    }
}

export default EventSingle;