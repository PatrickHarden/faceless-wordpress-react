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

        this.props.eventsData.map((event) => {

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
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
            }
            else {
                excerpt = false;
            }

            console.log(weekDate);

            let eventObj =
                <Col sm={6} md={4}
                     className="event-wrapper test"
                     data-category={(event.event_categories ? '[' + event.event_categories + ']' : 0)}
                     data-start-date={moment(event.acf.start_date, 'YYYYMMDD')}
                     data-end-date={moment(event.acf.end_date, 'YYYYMMDD')}
                     data-filter={entities.decode(event.title.rendered)}
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
                            {weekDate !== 'Invalid date' && monthDate !== 'Invalid date' &&
                            <h3>
                                <div className="week-date">
                                    <small>{weekDate}</small>
                                </div>
                                <div className="month-date">{monthDate}</div>
                            </h3>
                            }
                            <h2 className="title">
                                <Link to={"/events/" + event.slug + "/"} key={event.id}>
                                    {entities.decode(event.title.rendered)}
                                    {excerpt &&
                                    <div className="content" dangerouslySetInnerHTML={{__html: excerpt}}></div>
                                    }
                                </Link>
                            </h2>
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

    categoryFilter() {
        $('.filter-item').addClass('hidden');
        let filterValue = $('#eventCategories-filter').val();
        if (filterValue == 'all') {
            $('.filter-item').removeClass('hidden');
        }
        else {
            filterValue = parseInt(filterValue);
            $('.filter-item').each(function () {
                if ($.inArray(filterValue, $(this).data('categories')) > -1) {
                    $(this).removeClass('hidden');
                }
            });
        }
    }

    render() {
        if (this.state.data) {
            console.log(this.state.futureEvents);
            return (
                <div className="events">
                    <div className="events-container">
                        <div className="current-events container">
                            <Row>
                                <Col xs={12} className="ongoing-events-title">
                                    <h2>Ongoing Events</h2>
                                </Col>
                                {this.state.currentEvents}
                            </Row>
                        </div>
                        {this.state.futureEvents.length > 0 &&
                        <div className="future-events">
                            <div className="heading-wrapper">
                                <div className="container">
                                    <h2>Upcoming Events</h2>
                                </div>
                            </div>
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