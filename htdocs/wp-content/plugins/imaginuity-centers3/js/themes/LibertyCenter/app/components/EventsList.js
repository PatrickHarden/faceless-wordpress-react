// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import $ from 'jquery';

let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from './Loader';

class EventsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            events: '',
            eventCount: 0,
        };
    }

    componentWillMount() {

        let eventCount = 0;

        let currentEvents = [];
        let futureEvents = [];

        // console.log(this.props.eventsData);

        this.props.eventsData.map((event) => {

            let weekDate;
            let monthDate;
            let time;
            let excerpt;

            weekDate = (event.acf.start_date === event.acf.end_date) ? moment(event.acf.start_date).format('dddd') : (moment(event.acf.start_date).format('dddd') + ' - ' + moment(event.acf.end_date).format('dddd'));

            if (event.acf.start_date === event.acf.end_date) {
                monthDate = moment(event.acf.start_date).format('M/D/Y');
            }
            else if (moment(event.acf.start_date) !== moment(event.acf.end_date)) {
                monthDate = moment(event.acf.start_date).format('M/D/Y') + ' - ' + moment(event.acf.end_date).format('M/D/Y');
            }

            if (event.acf.post_copy) {
                let regex = /(<([^>]+)>)/ig;
                excerpt = entities.decode(event.acf.post_copy).replace(regex, "").substr(0, 200);
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
            }
            else {
                excerpt = false;
            }

            time = (event.acf.start_time !== '') ? event.acf.start_time + ' - ' + event.acf.end_time : '';

            console.log(weekDate);

            let eventObj =
                <Col xs={12}
                     className={event.acf.event_type + " event-wrapper"}
                     data-category={(event.event_categories ? '[' + event.event_categories + ']' : 0)}
                     data-start-date={moment(event.acf.start_date, 'YYYYMMDD')}
                     data-end-date={moment(event.acf.end_date, 'YYYYMMDD')}
                     data-filter={entities.decode(event.title.rendered).toLowerCase()}
                >
                    <div className="event background-color-setter">
                        <div className={"image-wrapper"}>
                            {event.acf.featured_image &&
                            <Link to={"/events/" + event.slug + "/"}>
                                <img className="img-responsive" src={entities.decode(event.acf.featured_image)}
                                     alt={entities.decode(event.title.rendered)}/>
                            </Link>
                            }
                        </div>
                        <div className="content-wrapper">
                            {monthDate !== 'Invalid date' &&
                            <div className="month-date">{monthDate}</div>
                            }
                            <Link to={"/events/" + event.slug + "/"} key={event.id}>
                                <h2 className="title">
                                    {entities.decode(event.title.rendered)}
                                </h2>
                            </Link>
                            {time !== '' &&
                            <div className="time">{time}</div>
                            }
                            {event.acf.location_link &&
                            <Link className="location-link" to={event.acf.location_link.url + "/"} target={event.acf.location_link.target}>
                                {event.acf.location_link.title}
                            </Link>
                            }
                            {excerpt &&
                            <div className="content" dangerouslySetInnerHTML={{__html: excerpt}}></div>
                            }
                            <Link to={"/events/" + event.slug + "/"} className="liberty-button turquoise hidden-xs">See Event
                                Details</Link>
                        </div>
                    </div>
                </Col>

            // if the event is active or upcoming, add to respective event array
            if ((moment().isSameOrAfter(event.acf.start_date, 'days') && moment().isSameOrBefore(event.acf.end_date, 'days')) || (weekDate === 'Invalid date' && monthDate === 'Invalid date')) {
                eventCount++;
                currentEvents.push(eventObj);
            }
            else if (moment().isSameOrBefore(event.acf.end_date, 'days')) {
                eventCount++;
                futureEvents.push(eventObj);
            }


        });

        // Sort alphabetically with empties at the end
        currentEvents = currentEvents.sort(function (a, b) {
            if (a.props.startdate === "" || a.props.startdate === null) return 1;
            if (b.props.startdate === "" || b.props.startdate === null) return -1;
            if (a.props.startdate === b.props.startdate) return 0;
            return a.props.startdate < b.props.startdate ? -1 : 1;
        });

        futureEvents = futureEvents.sort(function (a, b) {
            if (a.props.startdate === "" || a.props.startdate === null) return 1;
            if (b.props.startdate === "" || b.props.startdate === null) return -1;
            if (a.props.startdate === b.props.startdate) return 0;
            return a.props.startdate < b.props.startdate ? -1 : 1;
        });

        this.setState({
            data: true,
            currentEvents: currentEvents,
            futureEvents: futureEvents,
            eventCount: eventCount,
        });

    }

    timeFormat = (_time) => {
        let time = _time.replace('am', 'a.m.');
        time = time.replace('pm', 'p.m.');
        return time;
    }

    
    render() {
        if (this.state.data) {
            // console.log(this.state.futureEvents);
            return (
                <div className="events">
                    <div className="events-container">
                        <div className="current-events container">
                            <Row>
                                {this.state.currentEvents}
                            </Row>
                        </div>
                        {this.state.futureEvents.length > 0 &&
                        <div className="future-events">
                            <div className="future-event-list-wrapper">
                                <Grid>
                                    <Row>
                                        {this.state.futureEvents}
                                    </Row>
                                </Grid>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default EventsList;