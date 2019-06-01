// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import moment from 'moment';

// Components
import Helmet from 'react-helmet';
import Slider from 'react-slick';

// Endpoints
const SiteURL = 'http://' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const Events = SiteURL + '/wp-json/wp/v2/events/';

class FeaturedEventSlider extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            eventIDs: this.props.eventIDs ? this.props.eventIDs : false,
            events: '',
        }
    }

    componentWillMount(){

        if(this.props.homeData.acf.enable_featured_events){

            let eventPromises = [];

            this.state.eventIDs.map((eventID) => {
                eventPromises.push(axios.get(Events + eventID));
            });

            axios.all(eventPromises)
                .then((events) => {
                    let eventData = events.map((event, i) => {

                        let excerpt;
                        if (event.data.acf.post_copy) {
                            var regex = /(<([^>]+)>)/ig;
                            excerpt = entities.decode(event.data.acf.post_copy).replace(regex, "").substr(0, 200) + "[...]";
                        }
                        else {
                            excerpt = false;
                        }

                        let dateRangeCheck = (event.data.acf.start_date == event.data.acf.end_date);

                        let startWeekday = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('dddd') : 'TBD');
                        let endWeekday = (event.data.acf.end_date ? moment(event.data.acf.end_date).format('dddd') : 'TBD');

                        let singleStartMonth = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('MMM. DD') : 'TBD');

                        let rangeStartDate = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('MM/DD') : 'TBD')
                        let rangeEndDate = (event.data.acf.end_date ? moment(event.data.acf.end_date).format('MM/DD') : 'TBD');

                        if (moment().diff(event.data.acf.end_date, 'days') <= 0 ){
                            return(
                                <div className="event" key={i}>
                                    {dateRangeCheck ? (
                                        <div className="date font-color-setter-2">
                                            <h4>{startWeekday}</h4>
                                            <h4>{singleStartMonth}</h4>
                                        </div>
                                    ) : (
                                        <div className="date date-range clearfix">
                                            <div className="start font-color-setter-2">
                                                <h4>{startWeekday}</h4>
                                                <h4>{rangeStartDate}</h4>
                                            </div>
                                            <div className="range-hyphen font-color-setter-2">
                                                <h4>-</h4>
                                            </div>
                                            <div className="end font-color-setter-2">
                                                <h4>{endWeekday}</h4>
                                                <h4>{rangeEndDate}</h4>
                                            </div>
                                        </div>
                                    )}
                                    <h3>{entities.decode(event.data.title.rendered)}</h3>
                                    {excerpt &&
                                    <p>{excerpt}</p>
                                    }
                                </div>
                            );
                        }
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

    }

    render(){

        if(this.state.data){

            const settings = {
                dots: false,
                dotsClass: 'slick-dots border-color-setter',
                autoplay: false,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: true,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                speed: 800,
                nextArrow: <div><a class="carousel-control right" role="button" href="#"><span className="sr-only">Next</span></a></div>,
                prevArrow: <div><a class="carousel-control left" role="button" href="#"><span className="sr-only">Previous</span></a></div>,
                responsive: [
                    {breakpoint: 640,
                        settings: {
                            dots: true,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        },
                    },
                    {breakpoint: 1600,
                        settings: {
                            dots: false,
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            vertical: true,
                        }
                    }
                ]
            };

            return(
                <div className="featured-events-slider">
                    <Grid>
                        <Row>
                            <Col xs={12} sm={10} smOffset={1}>
                                <Slider
                                    className={"featured-events"}
                                    ref={a => this.slider = a }
                                    {...settings}
                                >
                                    {this.state.events}
                                </Slider>
                            </Col>
                        </Row>
                    </Grid>

                </div>
            )
        }
        return null;
    }
}

export default FeaturedEventSlider;