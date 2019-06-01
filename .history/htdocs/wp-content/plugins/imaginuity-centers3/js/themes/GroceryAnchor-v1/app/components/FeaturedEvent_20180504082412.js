// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import moment from 'moment';

// Components

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Events = SiteURL + '/wp-json/wp/v2/events/';

class FeaturedEvent extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            event: this.props.eventData,
            featuredEvent: '',
        }
    }

    componentWillMount(){

        const component = this;

        axios.all([
                axios.get(Events + this.props.eventData.acf.featured_event.ID),
            ])
            .then(axios.spread(function (event){
                component.setState({
                    data: true,
                    featuredEvent: event.data,
                });
            }))
            .catch((err) => {
                console.log(err);
            })

    }

    render(){

        if(this.state.data){
            let event = this.state.featuredEvent;

            let excerpt;
            if (event.acf.post_copy) {
                var regex = /(<([^>]+)>)/ig;
                excerpt = entities.decode(event.acf.post_copy).replace(regex, "").substr(0, 200);
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ") + "[...]");
            }
            else {
                excerpt = false;
            }

            let dateRangeCheck = (event.acf.start_date == event.acf.end_date);

            let startWeekday = (event.acf.start_date ? moment(event.acf.start_date).format('dddd') : 'TBD');
            let endWeekday = (event.acf.end_date ? moment(event.acf.end_date).format('dddd') : 'TBD');
            let singleStartMonth = (event.acf.start_date ? moment(event.acf.start_date).format('MMM. DD') : 'TBD');
            let rangeStartDate = (event.acf.start_date ? moment(event.acf.start_date).format('MM/DD') : 'TBD');
            let rangeEndDate = (event.acf.end_date ? moment(event.acf.end_date).format('MM/DD') : 'TBD');

            var startTime = (event.acf.start_time ? moment(event.acf.start_time, 'h:mm a').format('h:mm a') : 'TBD');
            var endTime = (event.acf.end_time ? moment(event.acf.end_time, 'h:mm a').format('h:mm a') : 'TBD');
            let timeString = startTime !== endTime ? (startTime == 'TBD' && endTime== 'TBD' ? 'All Day' : startTime + ' - ' + endTime) : (startTime == 'TBD' ? 'TBD' : startTime );
            timeString = startTime == 'TBD' && endTime == 'TBD' ? 'All Day' : timeString;
            if(moment(event.acf.end_time, 'h:mm a').diff(moment(event.acf.start_time, 'h:mm a')) == 86340000 || moment(event.acf.start_time, 'h:mm a').diff(moment(event.acf.end_time, 'h:mm a')) == -86340000){
                timeString = 'All Day';
            }
            return(
                <div className="featured-event-single background-color-setter">
                    <div className="img-container">
                        <img src={this.state.event.acf.featured_event_image.url} alt={(this.state.event.acf.featured_event_image.alt ? this.state.acf.featured_event_image.alt : 'featured image')}/>
                    </div>
                    <div className="copy-container">
                        <div className="title-container">
                            {this.state.featuredEvent.acf.related_store &&
                            <h4>
                                <Link to={"/stores/" + this.state.featuredEvent.acf.related_store.post_name} key={this.state.featuredEvent.acf.related_store.ID} >
                                    {entities.decode(this.state.featuredEvent.acf.related_store.post_title )}
                                </Link>
                            </h4>
                            }
                            <h2><Link to={"/events/"+this.state.featuredEvent.slug} key={this.state.featuredEvent.id} >{entities.decode(this.state.event.acf.featured_event.post_title)}</Link></h2>
                        </div>
                        <div className="date-container">
                            {dateRangeCheck ? (
                                <div className="date">
                                    <h4>{startWeekday}</h4>
                                    <h4>{singleStartMonth}</h4>
                                </div>
                            ) : (
                                <div className="date date-range clearfix">
                                    <div className="start">
                                        <h4>{startWeekday}</h4>
                                        <h4>{rangeStartDate}</h4>
                                    </div>
                                    <div className="range-hyphen">
                                        <h4>-</h4>
                                    </div>
                                    <div className="end">
                                        <h4>{endWeekday}</h4>
                                        <h4>{rangeEndDate}</h4>
                                    </div>
                                </div>
                            )}
                            <br />


                        </div>
                        <p className="time ">{timeString}</p>
                        <p>{excerpt}</p>
                    </div>
                    <span className="clearfix" />
                </div>
            )
        }
        return null;
    }
}

export default FeaturedEvent;