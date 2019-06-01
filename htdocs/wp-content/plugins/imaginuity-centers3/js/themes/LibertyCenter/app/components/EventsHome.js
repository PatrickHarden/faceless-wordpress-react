// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
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
const EventData = SiteURL + '/wp-json/wp/v2/events?per_page=100';

class EventsHome extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    componentWillMount(){
        let component = this;
        let data = [];

        axios.all([
            axios.get(EventData)
        ])
            .then(axios.spread(function (eventData) {
                let eventQueries = [];
                if (eventData.headers['x-wp-totalpages'] > 1) {
                    let paginationCount = eventData.headers['x-wp-totalpages'];
                    let x = 1;
                    while (x <= paginationCount) {
                        eventQueries.push(axios.get(EventData + '&page=' + x));
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

    handleDataResponse(eventData){

        let events = [];
        let eventCount = 0;

        eventData.map((event) => {

            let dateString;
            let time;
            let excerpt;

            if (event.acf.start_date !== event.acf.end_date) {
                dateString = moment(event.acf.start_date).format('MMM. D') + ' - ' + moment(event.acf.end_date).format('MMM. D');
            }
            else if(event.acf.start_date == "Invalid date"){
                dateString = false;
            }
            else{
                dateString = moment(event.acf.start_date).format('dddd MMM. D')
            }

            if (event.acf.post_copy) {
                let regex = /(<([^>]+)>)/ig;
                excerpt = entities.decode(event.acf.post_copy).replace(regex, "").substr(0, 85);
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
            }
            else {
                excerpt = false;
            }

            time = (event.acf.start_time !== '') ? event.acf.start_time + ' - ' + event.acf.end_time : '';

            let eventObj =
                <div
                    className="event"
                    startdate={moment(event.acf.start_date).format('X')}
                >
                    <div className={"image-wrapper"}>
                        <Link to={"/events/" + event.slug + "/"}>
                            <img className="img-responsive" src={event.acf.featured_image ? event.acf.featured_image : this.props.optionsData.acf.logo}
                                 alt={entities.decode(event.title.rendered)}/>
                        </Link>
                    </div>
                    <p className="date-time">
                        {(event.acf.event_type !== "recursive" ? (dateString ? dateString + ', ' : '') : '') + (time ? time : '')}
                    </p>
                    <Link to={"/events/" + event.slug + "/"} key={event.id}>
                        <h3>
                            {entities.decode(event.title.rendered)}
                        </h3>
                    </Link>
                    {excerpt &&
                    <p>
                        {excerpt}
                    </p>
                    }
                    <Link to={"/events/" + event.slug + "/"}>Get more information &#xbb;</Link>
                </div>

            // if the event is active or upcoming, add to respective event array
            if (moment().isSameOrBefore(event.acf.end_date, 'days') || event.acf.event_type === 'recursive') {
                eventCount++;
                events.push(eventObj);
            }
        });

        // Sort alphabetically with empties at the end
        events = events.sort(function (a, b) {
            if (a.props.startdate === "" || a.props.startdate === null) return 1;
            if (b.props.startdate === "" || b.props.startdate === null) return 1;
            if (a.props.startdate === b.props.startdate) return 0;
            return a.props.startdate < b.props.startdate ? -1 : 1;
        });

        events.length > 3 ? events = events.slice(0,3) : null;

        this.setState({
            data: true,
            events: events,
            eventCount: eventCount,
        });
    }

    render(){
        if(this.state.data && this.state.events){
            return(
                <div className="events">
                    {this.state.events}
                </div>
            )
        }
        return <Loader />;
    }
}

export default EventsHome;