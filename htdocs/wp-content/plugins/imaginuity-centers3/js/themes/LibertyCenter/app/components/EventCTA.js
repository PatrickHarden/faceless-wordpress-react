// Packages
import React, {PropTypes, Component} from 'react';
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
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const EventsData = SiteURL + '/wp-json/wp/v2/events?per_page=100';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class EventCTA extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            events: '',
            eventCount: 0,
        }
    }

    componentWillMount() {
        const component = this;

        axios.all([
            axios.get(EventsData),
        ])
            .then(axios.spread(function (eventData) {
                let eventQueries = [];
                if (eventData.headers['x-wp-totalpages'] > 1) {
                    let paginationCount = eventData.headers['x-wp-totalpages'];
                    let x = 1;
                    while (x <= paginationCount) {
                        eventQueries.push(axios.get(eventsData + '&page=' + x));
                        x++;
                    }
                    axios.all(eventQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.handleDataResponse(data);
                        })
                        .catch((err) => {
                            console.log('error in eventQueries');
                            console.log(err);
                            component.setState({
                                error: true,
                            })
                        })
                }
                else {
                    component.handleDataResponse(eventData.data);
                }
            }))
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });
    }

    handleDataResponse(eventData) {
        let eventCount = 0;

        let events = eventData.map((event, i) => {
            if (moment().diff(event.acf.end_date, 'days') <= 0) {

                eventCount++;

                let excerpt;
                let weekDate;
                let monthDate;

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
                    excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
                }
                else {
                    excerpt = false;
                }

                return (
                    <div
                        className="event"
                        data-start-date={moment(event.acf.start_date, 'YYYYMMDD')}
                        data-end-date={moment(event.acf.end_date, 'YYYYMMDD')}
                        key={i}
                    >
                        <Link to={"/events/" + event.slug + "/"}>
                            <h3>
                                <div className="week-date">
                                    <small>{weekDate}</small>
                                </div>
                                {monthDate}
                            </h3>
                            {excerpt &&
                            <p className="blurb">{excerpt}</p>
                            }
                        </Link>
                    </div>
                );
            }
        })

        // Sort alphabetically with empties at the end
        let sortedEvents = events.sort(function (a, b) {
            if (a.props.startdate === "" || a.props.startdate === null) return 1;
            if (b.props.startdate === "" || b.props.startdate === null) return -1;
            if (a.props.startdate === b.props.startdate) return 0;
            return a.props.startdate < b.props.startdate ? -1 : 1;
        });

        sortedEvents = sortedEvents.filter((el) => {
            return el != null;
        });

        if (sortedEvents.length > 3) {
            sortedEvents = sortedEvents.slice(0, 3);
        }

        this.setState({
            data: true,
            events: sortedEvents,
            eventCount: eventCount
        });
    }

    render() {
        if (this.state.data) {
            return (
                <div className={"events-cta event-count-" + this.state.eventCount}>
                    <div className="container">
                        <div className="inner-wrapper">
                            <div className="title-wrapper one">
                                <div><h2>Happening</h2></div>
                                <div className="visible-xs"><h2>the plaza</h2></div>
                            </div>
                            <div className="image-wrapper"><img className="at-symbol" src={Images + '@.png'} alt="@"/>
                            </div>
                            <div className="title-wrapper two hidden-xs"><h2>the plaza</h2></div>
                        </div>
                        <div className='event-wrapper'>
                            {this.state.events}
                        </div>
                    </div>
                </div>
            );
        }
        return <Loader/>;
    }
}

export default EventCTA;