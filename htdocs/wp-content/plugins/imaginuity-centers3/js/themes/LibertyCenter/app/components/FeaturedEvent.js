// Packages
import React, {Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import axios from 'axios';
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
const EventData = SiteURL + '/wp-json/wp/v2/events/';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class FeaturedEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredEvent: '',
        }
    }

    componentWillMount() {

        console.log(this.props.pageData);

        const component = this;

        let featuredEventsPromises = [];

        let featuredEvents;

        if (this.props.pageData.acf.featured_event) {
            this.props.pageData.acf.featured_event.map((event) => {

                console.log(event);

                featuredEventsPromises.push(axios.get(EventData + event.ID))

            })

            axios.all(featuredEventsPromises)
                .then((response) => {
                    console.log(response);
                    featuredEvents = response.map((event) => {

                        let weekDate;
                        let monthDate;
                        let time;
                        let excerpt;

                        weekDate = (event.data.acf.start_date === event.data.acf.end_date) ? moment(event.data.acf.start_date).format('dddd') : (moment(event.data.acf.start_date).format('ddd') + ' - ' + moment(event.data.acf.end_date).format('ddd'));

                        if (event.data.acf.start_date === event.data.acf.end_date) {
                            monthDate = moment(event.data.acf.start_date).format('M/D/Y');
                        }
                        else if (moment(event.data.acf.start_date) !== moment(event.data.acf.end_date)) {
                            monthDate = moment(event.data.acf.start_date).format('M/D/Y') + ' - ' + moment(event.data.acf.end_date).format('M/D/Y');
                        }

                        time = (event.data.acf.start_time !== '') ? event.data.acf.start_time + ' - ' + event.data.acf.end_time : '';


                        if (event.data.acf.post_copy) {
                            let regex = /(<([^>]+)>)/ig;
                            excerpt = entities.decode(event.data.acf.post_copy).replace(regex, "").substr(0, 200);
                            excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '...';
                        }
                        else {
                            excerpt = false;
                        }

                        return (
                            <div className="event">
                                <div
                                    className={"image-wrapper" + (!event.data.acf.featured_image ? ' background-color-setter-secondary' : '')}>
                                    {event.data.acf.featured_image &&
                                    <Link to={"/events/" + event.data.slug + "/"}>
                                        <img className="img-responsive"
                                             src={entities.decode(event.data.acf.featured_image)}
                                             alt={entities.decode(event.data.title.rendered)}/>
                                    </Link>
                                    }
                                </div>
                                <div className="content-wrapper">
                                    <div className="date-time-container">
                                        {event.data.acf.event_type !== 'recursive' &&
                                        <div className="week-date">{weekDate}<span>|</span></div>
                                        }
                                        {time !== '' &&
                                        <div className="time">{time}</div>
                                        }
                                        {event.data.acf.location_link &&
                                        <div>
                                            <span>|</span>
                                            <Link className="location-link" to={event.data.acf.location_link.url}
                                                  target={event.data.acf.location_link.target}>{event.data.acf.location_link.title}</Link>
                                        </div>
                                        }

                                    </div>
                                    <Link className="link"
                                          to={"/events/" + event.data.slug + '/'}
                                          key={event.data.id}
                                    >
                                        <h3>
                                            {entities.decode(event.data.title.rendered)}
                                        </h3>
                                    </Link>
                                    <div className="content">
                                        {excerpt &&
                                        <div className="content" dangerouslySetInnerHTML={{__html: excerpt}}></div>
                                        }
                                    </div>
                                    <div className="share-icons">
                                        <a
                                            href={'mailto:?body=' + window.location.href + '&subject=' + entities.decode(event.data.title.rendered)}>
                                            <img src={Images + 'icon-email-dark.png'} alt="email"/>
                                        </a>
                                        <Link to={'https://twitter.com/home?status=' + window.location.href}
                                              target="_blank">
                                            <img src={Images + 'icon-twitter-dark.png'} alt="twitter"/>
                                        </Link>
                                        <Link
                                            to={'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href}
                                            target="_blank">
                                            <img src={Images + 'icon-facebook-dark.png'} alt="facebook"/>
                                        </Link>
                                    </div>
                                    <Link to={"/events/" + event.data.slug + '/'}
                                          className="liberty-button turquoise">See Event
                                        Details</Link>
                                </div>
                            </div>

                        )
                    })
                    this.setState({
                        data: true,
                        featuredEvents: featuredEvents
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }


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
                <div className="featured-events container">
                    <div className="heading-wrapper text-center">
                        <h2>Featured Events</h2>
                    </div>
                    <Slider
                        className={"events-slider"}
                        ref={a => this.slider = a}
                        {...settings}
                    >
                        {this.state.featuredEvents}

                    </Slider>
                </div>
            )
        }
        else if (this.state.error) {
            return null;
        }
        return <Loader/>;
    }
}

export default FeaturedEvent;