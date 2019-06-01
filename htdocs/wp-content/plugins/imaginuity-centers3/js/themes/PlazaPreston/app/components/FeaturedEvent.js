// Packages
import React, {Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import axios from 'axios';

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
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class FeaturedEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredEvent: '',
        }
    }

    componentWillMount() {
        let component = this;

        axios.get(EventData + this.props.event)
            .then((event) => {
                console.log('Featured Event');
                console.log(event);

                let weekDate;
                let monthDate;
                let excerpt;

                weekDate = (event.data.acf.start_date === event.data.acf.end_date) ? moment(event.data.acf.start_date).format('dddd') : (moment(event.data.acf.start_date).format('dddd') + ' - ' + moment(event.data.acf.end_date).format('dddd'));

                if (event.data.acf.start_date === event.data.acf.end_date) {
                    monthDate = moment(event.data.acf.start_date).format('MMMM D');
                }
                else if (moment(event.data.acf.start_date).format('MMMM') !== moment(event.data.acf.end_date).format('MMMM')) {
                    monthDate = moment(event.data.acf.start_date).format('MMM D') + ' - ' + moment(event.data.acf.end_date).format('MMM D');
                }
                else {
                    monthDate = moment(event.data.acf.start_date).format('MMMM D') + ' - ' + moment(event.data.acf.end_date).format('D');
                }

                if (event.data.acf.post_copy) {
                    let regex = /(<([^>]+)>)/ig;
                    excerpt = entities.decode(event.data.acf.post_copy).replace(regex, "").substr(0, 200);
                    excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
                }
                else {
                    excerpt = false;
                }

                let featuredEvent =
                    <div className="event" key={event.data.id}>
                        <div className="container">
                            <Row>
                                <Col md={5}>
                                    <div className="image-wrapper">
                                        {event.data.acf.featured_image &&
                                        <img className="foreground"
                                             src={event.data.acf.featured_image}
                                             alt={entities.decode(event.data.title.rendered) + ' featured'}
                                        />
                                        }
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <div className="content-wrapper">
                                        {weekDate !== 'Invalid date' && monthDate !== 'Invalid date' &&
                                        <h3>
                                            <div className="week-date">
                                                <small>{weekDate}</small>
                                            </div>
                                            <div className="month-date">{monthDate}</div>
                                        </h3>
                                        }
                                        <Link to={'/events/' + event.data.slug + '/'}>
                                            <h3>{entities.decode(event.data.title.rendered)}</h3>
                                            {excerpt &&
                                            <div className="content" dangerouslySetInnerHTML={{__html: excerpt}}></div>
                                            }
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>


                component.setState({
                    data: true,
                    featuredEvent: featuredEvent,
                });
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
            return (
                <div className="featured-event">
                    {this.state.featuredEvent}
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