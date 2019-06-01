// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';
import axios from 'axios';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';

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
                    let excerpt;

                    weekDate = (event.acf.start_date === event.acf.end_date) ? moment(event.acf.start_date).format('dddd') : (moment(event.acf.start_date).format('dddd') + ' - ' + moment(event.acf.end_date).format('dddd'));

                    if (event.acf.start_date === event.acf.end_date) {
                        monthDate = moment(event.acf.start_date).format('MMMM D');
                    }
                    else if (moment(event.acf.start_date).format('MMMM') !== moment(event.acf.end_date).format('MMMM')) {
                        monthDate = moment(event.acf.start_date).format('MMM D') + ' - ' + moment(event.acf.end_date).format('MMM D');
                    }
                    else {
                        monthDate = moment(event.acf.start_date).format('MMMM D') + ' - ' + moment(event.acf.end_date).format('D');
                    }

                    if (event.acf.post_copy) {
                        let regex = /(<([^>]+)>)/ig;
                        excerpt = entities.decode(event.acf.post_copy).replace(regex, "").substr(0, 200);
                        excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... >';
                    }
                    else {
                        excerpt = false;
                    }

                    return (
                        <Col xs={12} sm={6} md={4}  className="event">
                            <div
                                className={"image-wrapper" + (!event.acf.featured_image ? ' background-color-setter-secondary' : '')}>
                                {event.acf.featured_image &&
                                <Link to={"/events/" + event.slug + "/"}>
                                    <img className="img-responsive" src={entities.decode(event.acf.featured_image)}
                                         alt={entities.decode(event.title.rendered)}/>
                                </Link>
                                }
                            </div>
                            <h3>
                                <div className="week-date">
                                    <small>{weekDate}</small>
                                </div>
                                {monthDate}
                            </h3>
                                <Link
                                    to={"/" + event.slug + '/'}
                                    key={event.id}
                                >
                                    <h2>
                                        {entities.decode(event.title.rendered)} >
                                    </h2>
                                    {excerpt &&
                                    <div className="content" dangerouslySetInnerHTML={{__html: excerpt}}></div>
                                    }
                                </Link>
                        </Col>
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
            return (
                <div className="event-recommend">
                    <div className="container">
                        <Row>
                            <Col xs={12} className="text-right">
                                <h2>You might also be interested in these Events</h2>
                            </Col>
                            {this.state.events}
                        </Row>
                    </div>
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