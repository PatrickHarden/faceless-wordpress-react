// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import moment from 'moment';

// Components
import Loader from './Loader';
import Slider from 'react-slick';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const Events = SiteURL + '/wp-json/wp/v2/events/';

class FeaturedEventSlider extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            eventIDs: this.props.eventIDs,
            events: '',
        }
    }

    componentWillMount(){

        let eventPromises = [];

        if(this.props.eventIDs){
            this.state.eventIDs.map((eventID) => {
                eventPromises.push(axios.get(Events + eventID));
            });
            axios.all(eventPromises)
                .then((events) => {
                    let eventData = events.map((event, i) => {

                        let dateRangeCheck = (event.data.acf.start_date == event.data.acf.end_date);

                        let startWeekday = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('ddd') : '');
                        let endWeekday = (event.data.acf.end_date ? moment(event.data.acf.end_date).format('ddd') : '');

                        let singleStartMonth = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('M/D') : '');

                        let rangeStartDate = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('M/D') : '')
                        let rangeEndDate = (event.data.acf.end_date ? moment(event.data.acf.end_date).format('M/D') : '');

                        if (moment().diff(event.data.acf.end_date, 'days') <= 0 ){
                            return(
                                <div className="event" key={i}>
                                    {dateRangeCheck ? (
                                        <div className="date font-color-setter">
                                            <h4>
                                                <small>
                                                    {startWeekday}
                                                </small>
                                            </h4>
                                            <br />
                                            <h4>
                                                {singleStartMonth}
                                            </h4>
                                        </div>
                                    ) : (
                                        <div className="date date-range clearfix font-color-setter">
                                            <div className="weekdays">
                                                <h4><small>{startWeekday} - {endWeekday}</small></h4>
                                            </div>
                                            <div className="dates">
                                                <h4>{rangeStartDate} - {rangeEndDate}</h4>
                                            </div>
                                        </div>
                                    )}
                                    <Link to={"/events/"+event.data.slug+"/"} key={event.data.id}>
                                        <h3 className="title">
                                            {entities.decode(event.data.title.rendered)} &#187;
                                        </h3>
                                    </Link>
                                </div>
                            );
                        }
                    });
                    eventData = eventData.filter((event) => {
                        return event !== undefined;
                    });

                    this.setState({
                        events: eventData,
                        data: true,
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else{
            this.setState({
                data: true,
                events: false
            });
        }
    }

    render(){
        if(this.state.data) {
            if (this.state.events.length > 0) {
                const settings = {
                    dots: false,
                    autoplay: false,
                    autoplaySpeed: 5000,
                    pauseOnHover: false,
                    draggable: true,
                    infinite: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    speed: 800,
                    nextArrow: <div><a class="carousel-control right" role="button" href="#"><span className="sr-only">Next</span></a>
                    </div>,
                    prevArrow: <div><a class="carousel-control left" role="button" href="#"><span className="sr-only">Previous</span></a>
                    </div>,
                    responsive: [
                        {
                            breakpoint: 640,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            },
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                            }
                        }
                    ]
                };

                return (
                    <div className="featured-events-slider">
                        <Grid>
                            <Row>
                                <Col xs={12} sm={10} smOffset={1}>
                                    <div className="border-cover cover-left"></div>
                                    <Slider
                                        className={"featured-events"}
                                        ref={a => this.slider = a}
                                        {...settings}
                                    >
                                        {this.state.events}
                                    </Slider>
                                    <div className="border-cover cover-right"></div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                )
            }
            else {
                return null;
            }
        }
        return <Loader />;
    }
}

export default FeaturedEventSlider;