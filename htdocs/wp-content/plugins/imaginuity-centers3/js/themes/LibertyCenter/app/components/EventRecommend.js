// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';
import axios from 'axios';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import Slider from 'react-slick';

let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const EventData = SiteURL + '/wp-json/wp/v2/events?order=desc&per_page=3';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class EventRecommend extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentWillMount() {
        let component = this;

        let catLength = this.props.categories.length;
        let categories = this.props.categories.map((cat, i) => {
            return (
                i === catLength ? cat : cat + ','
            );
        })

        axios.get(EventData + '&category=' + categories + '&exclude=' + this.props.id)
            .then((eventData) => {
                console.log(eventData);
                let events = eventData.data.map((event) => {

                    let weekDate;
                    let monthDate;
                    let time;
                    let excerpt;

                    weekDate = (event.acf.start_date === event.acf.end_date) ? moment(event.acf.start_date).format('dddd') : (moment(event.acf.start_date).format('ddd') + ' - ' + moment(event.acf.end_date).format('ddd'));

                    if (event.acf.start_date === event.acf.end_date) {
                        monthDate = moment(event.acf.start_date).format('M/D/Y');
                    }
                    else if (moment(event.acf.start_date) !== moment(event.acf.end_date)) {
                        monthDate = moment(event.acf.start_date).format('M/D/Y') + ' - ' + moment(event.acf.end_date).format('M/D/Y');
                    }

                    time = (event.acf.start_time !== '') ? event.acf.start_time + ' - ' + event.acf.end_time : '';


                    if (event.acf.post_copy) {
                        let regex = /(<([^>]+)>)/ig;
                        excerpt = entities.decode(event.acf.post_copy).replace(regex, "").substr(0, 200);
                        excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '...';
                    }
                    else {
                        excerpt = false;
                    }

                    return (

                        <div className="event">
                            <div
                                className={"image-wrapper" + (!event.acf.featured_image ? ' background-color-setter-secondary' : '')}>
                                {event.acf.featured_image &&
                                <Link to={"/events/" + event.slug + "/"}>
                                    <img className="img-responsive" src={entities.decode(event.acf.featured_image)}
                                         alt={entities.decode(event.title.rendered)}/>
                                </Link>
                                }
                            </div>
                            <div className="content-wrapper">
                                <div className="date-time-container">
                                    {event.acf.event_type !== 'recursive' &&
                                    <div className="week-date">{weekDate}<span>|</span></div>
                                    }
                                    {time !== '' &&
                                    <div className="time">{time}</div>
                                    }
                                    {event.acf.location_link &&
                                    <div>
                                                <span>|</span>
                                        <Link className="location-link" to={event.acf.location_link.url} target={event.acf.location_link.target}>{event.acf.location_link.title}</Link>
                                            </div>
                                    }

                                </div>
                                <Link className="link"
                                    to={"/events/" + event.slug + '/'}
                                    key={event.id}
                                >
                                    <h3>
                                        {entities.decode(event.title.rendered)}
                                    </h3>
                                </Link>
                                <div className="content">
                                    {excerpt &&
                                    <div className="content" dangerouslySetInnerHTML={{__html: excerpt}}></div>
                                    }
                                </div>
                                <div className="share-icons">
                                    <a href={'mailto:?body=' + window.location.href + '&subject=' + entities.decode(event.title.rendered)}>
                                        <img src={Images + 'icon-email-dark-inverted.png'} alt="email"/>
                                    </a>
                                    <Link to={'https://twitter.com/home?status=' + window.location.href} target="_blank">
                                        <img src={Images + 'icon-twitter-dark-inverted.png'} alt="twitter"/>
                                    </Link>
                                    <Link to={'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href} target="_blank">
                                        <img src={Images + 'icon-facebook-dark-inverted.png'} alt="facebook"/>
                                    </Link>
                                </div>
                                <Link to={"/events/" + event.slug + '/'}
                                      className="liberty-button white">See Event
                                    Details</Link>
                            </div>
                        </div>
                    );
                })
                component.setState({
                    data: true,
                    events: events,
                })
            })
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });
    }

    render() {
        if (this.state.data) {

            const settings = {
                dots: false,
                autoplay: false,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 800,
            };

            return (
                <div className="event-recommend">
                    <div className="container">
                        <div className="heading-wrapper text-center">
                            <h2>Related Events</h2>
                        </div>
                        <Slider
                            className={"events-slider"}
                            ref={a => this.slider = a}
                            {...settings}
                        >
                            {this.state.events}
                        </Slider>
                    </div>
                    <img className="liberfly hidden-xs" src={Images + 'liberfly-dark.png'} alt="flower"/>
                </div>
            )
        }
        else if (this.state.error) {
            return null;
        }
        return <Loader/>;
    }
}

export default EventRecommend;