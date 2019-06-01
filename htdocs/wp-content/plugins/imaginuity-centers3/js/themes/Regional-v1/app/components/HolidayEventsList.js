// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
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

class HolidayEventsList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            events: '',
            eventCount: 0,
        };
    }

    componentWillMount(){

        const component = this;

        axios.all([
            axios.get(EventsData),
        ])
            .then(axios.spread(function(eventsData){

                let eventsQueries = [];
                let data = [];

                if(eventsData.headers['x-wp-totalpages'] > 1){
                    let paginationCount = eventsData.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        eventsQueries.push(axios.get(SalesData + '&page=' + x));
                        x++;
                    }
                    axios.all(eventsQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.setEventsData(data);
                        })
                        .catch((err) => {
                            console.log('error in eventsQueries');
                            console.log(err);
                        })
                }
                else{
                    data = eventsData.data;
                    component.setEventsData(data);
                }

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    setEventsData(eventsData){

        let eventCount = 0;

        let events = eventsData.map((event, i) => {

            let excerpt;
            if (event.acf.post_copy) {
                let regex = /(<([^>]+)>)/ig;
                excerpt = entities.decode(event.acf.post_copy).replace(regex, "").substr(0, 200);
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + ' . . . ';
            }
            else {
                excerpt = false;
            }

            let startWeekday = (event.acf.start_date ? moment(event.acf.start_date).format('dddd') : '');
            let endWeekday = (event.acf.end_date ? moment(event.acf.end_date).format('dddd') : '');

            let rangeStartDate = (event.acf.start_date ? moment(event.acf.start_date).format('M/DD') : '');
            let rangeEndDate = (event.acf.end_date ? moment(event.acf.end_date).format('M/DD') : '');

            let startTime = (event.acf.start_time ? moment(event.acf.start_time, 'h:mm a').format('h:mm a') : '');
            let endTime = (event.acf.end_time ? moment(event.acf.end_time, 'h:mm a').format('h:mm a') : '');
            let timeString = startTime !== endTime ? (startTime == '' && endTime== '' ? 'All Day' : startTime + ' - ' + endTime) : (startTime == '' ? '' : startTime );
            if(moment(event.acf.end_time, 'h:mm a').diff(moment(event.acf.start_time, 'h:mm a')) == 86340000 || moment(event.acf.start_time, 'h:mm a').diff(moment(event.acf.end_time, 'h:mm a')) == -86340000){
                timeString = 'All Day';
            }

            if(moment().diff(event.acf.end_date, 'days') <= 0 && event.acf.flags.indexOf('Holiday') > -1){
                eventCount++;
                return(
                    <Col
                        xs={12}
                        md={6}
                        className="event filter-item"
                        key={i}
                        startdate={rangeStartDate}
                    >
                        {event.acf.featured_image &&
                        <Col xs={12} sm={6}>
                            <Link to={"/events/"+event.slug+"/"}>
                                <img className="img-responsive" src={entities.decode(event.acf.featured_image)} alt={entities.decode(event.title.rendered) + "featured image"} />
                            </Link>
                        </Col>
                        }
                        <Col
                            xs={12}
                            sm={event.acf.featured_image ? 6 : 12}
                        >
                            <div className="content">
                                <div className="date-container">
                                    <div className="date date-range clearfix">
                                        <div className="start">
                                            <h4>
                                                <small>{startWeekday}{endWeekday ? " - " + endWeekday : ''}</small><br />
                                                {rangeStartDate}{rangeEndDate ? " - " + rangeEndDate : ''}<br />
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="copy-container">
                                    <p className="timestring">{timeString}</p>
                                    <h4><Link to={"/events/"+event.slug} key={event.id}>{entities.decode(event.title.rendered)}</Link></h4>
                                    {event.acf.related_store &&
                                    <Link className="store-link" key={event.acf.related_store.ID} to={'/stores/'+event.acf.related_store.post_name+"/"} storeID={event.acf.related_store.post_name}>
                                        {entities.decode(event.acf.related_store.post_title)}
                                    </Link>
                                    }
                                    {excerpt &&
                                    <p>{excerpt} <Link to={"/events/"+event.slug}>Read More</Link></p>
                                    }
                                </div>
                            </div>
                        </Col>
                    </Col>
                );
            }
        });

        // Sort alphabetically with empties at the end
        let sortedEvents = events.sort(function(a, b) {
            if(a.props.startdate === "" || a.props.startdate === null) return 1;
            if(b.props.startdate === "" || b.props.startdate === null) return -1;
            if(a.props.startdate === b.props.startdate) return 0;
            return a.props.startdate < b.props.startdate ? -1 : 1;
        });

        this.setState({
            data: true,
            events: sortedEvents,
            eventCount: eventCount,
        });
    }

    render(){
        if(this.state.data){
            return(
                <div className="events holiday-events">
                    <Grid>
                        <Row>
                            <h2>Holiday Events</h2>
                            {this.state.eventCount > 0 &&
                                <div className={"events-container event-count-" + (this.state.eventCount%2 === 0 ? 'even' : 'odd')}>
                                    {this.state.events}
                                </div>
                            }
                            {this.state.eventCount === 0 &&
                            <h4 className="no-events">There are no holiday events currently available.</h4>
                            }
                        </Row>
                    </Grid>
                </div>
            );
        }
        return <Loader />;
    }
}


export default HolidayEventsList;
