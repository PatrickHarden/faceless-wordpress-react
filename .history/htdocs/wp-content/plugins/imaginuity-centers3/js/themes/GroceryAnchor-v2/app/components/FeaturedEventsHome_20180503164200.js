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

                        let excerpt;
                        if (event.data.acf.post_copy) {
                            var regex = /(<([^>]+)>)/ig;
                            excerpt = entities.decode(event.data.acf.post_copy).replace(regex, "").substr(0, 200);
                        }
                        else {
                            excerpt = false;
                        }

                        let dateRangeCheck = (event.data.acf.start_date == event.data.acf.end_date);

                        let startWeekday = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('dddd') : '');
                        let endWeekday = (event.data.acf.end_date ? moment(event.data.acf.end_date).format('dddd') : '');

                        let singleStartMonth = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('MMM. DD') : '');

                        let rangeStartDate = (event.data.acf.start_date ? moment(event.data.acf.start_date).format('MMM. DD') : '')
                        let rangeEndDate = (event.data.acf.end_date ? moment(event.data.acf.end_date).format('MMM. DD') : '');

                        if (moment().diff(event.data.acf.end_date, 'days') <= 0 ){
                            return(
                                <div className="event font-color-setter" key={i}>
                                    {dateRangeCheck ? (
                                        <div className="date">
                                            <h4>
                                                <small>{startWeekday}</small><br />
                                                {singleStartMonth}
                                            </h4>
                                        </div>
                                    ) : (
                                        <div className="date date-range clearfix">
                                            <div className="start">
                                                <h4>
                                                    <small>{startWeekday}</small><br />
                                                    {rangeStartDate}<br />
                                                    <small>to {rangeEndDate}</small>
                                                </h4>
                                            </div>
                                        </div>
                                    )}
                                    <h3>
                                        <Link to={"/events/"+event.data.slug} key={event.data.id}>{entities.decode(event.data.title.rendered)}</Link>
                                    </h3>
                                    {excerpt &&
                                    <p>{excerpt} <Link to={"/events/"+event.data.slug} key={event.data.id}>Read More</Link></p>
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
        else{
            this.setState({
                data: true,
                events: false
            });
        }
    }

    render(){
        if(this.state.data && this.state.events){

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
                            dotsClass: 'slick-dots border-color-setter',
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        },
                    },
                    {breakpoint: 992,
                        settings: {
                            dotsClass: 'slick-dots border-color-setter',
                            slidesToShow: 2,
                            slidesToScroll: 1,
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