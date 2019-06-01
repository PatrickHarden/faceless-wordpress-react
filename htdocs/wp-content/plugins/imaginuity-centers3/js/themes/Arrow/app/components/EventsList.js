// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import Slider from 'react-slick';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components

class EventsList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            events: '',
            eventCount: 0,
            day: false,
        };
    }

    componentWillMount(){

        let eventCount = 0;

        let events = this.props.eventsData.map((event, i) => {

            let dateString;
            let timeString;

            if(event.acf.start_date === event.acf.end_date){
                dateString = moment(event.acf.start_date).format('M/D/YY');
            }
            else{
                dateString = moment(event.acf.start_date).format('M/D/YY') + ' - ' + moment(event.acf.end_date).format('M/D/YY');
            }

            if(event.acf.start_time === event.acf.end_time){
                timeString = "";
            }
            else{
                timeString = event.acf.start_time + ' - ' + event.acf.end_time, 'h:mm';
            }

            if(moment().diff(event.acf.end_date, 'days') <= 0 ){
                eventCount++;
                return(
                    <div className="event filter-item border-color-setter"
                         data-startdate={moment(event.acf.start_date, 'YYYYMMDD').format('DDD')}
                         startdate={moment(event.acf.start_date, 'YYYYMMDD').format('X')}
                         data-enddate={moment(event.acf.end_date, 'YYYYMMDD').format('DDD')}
                         data-title={event.title.rendered}
                         key={i}>
                        <div className={"image-container" + (!event.acf.featured_image ? ' background-color-setter no-image' : '')}>
                            <Link to={"/events/"+event.slug+"/"}>
                                {event.acf.featured_image ? (
                                    <img src={entities.decode(event.acf.featured_image)} alt={entities.decode(event.title.rendered)} />
                                ) : (
                                    <img src={this.props.optionsData.acf.logo} alt={entities.decode(event.title.rendered)} className="logo"/>
                                )}
                            </Link>
                        </div>
                        <div className="copy-container">
                            {event.acf.related_store &&
                            <Link className="store-link" key={event.acf.related_store.ID} to={'/stores/'+event.acf.related_store.post_name+'/'} storeID={event.acf.related_store.post_name}>
                                <p className="related-store">{entities.decode(event.acf.related_store.post_title)}</p>
                            </Link>
                            }
                            <Link to={"/events/"+event.slug+"/"} key={event.id} ><p>{entities.decode(event.title.rendered)}</p></Link>
                            <p>{dateString}</p>
                            <p>{timeString}</p>
                        </div>
                    </div>
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

    filterEvents(day){

        $('.date-active').removeClass('date-active');
        $('.date[data-date="' + day + '"]').addClass('date-active');
        $('.event').addClass('hidden');
        $('.event').each(function(){

            let range = moment.range($(this).data('startdate'), $(this).data('enddate'));

            if(range.contains(parseInt(day))){
                $(this).removeClass('hidden');
            }
        });

        this.setState({
            day: day
        });
    }


    render(){
        if(this.state.data){

            const settings = {
                dots: false,
                autoplay: false,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: true,
                infinite: false,
                slidesToShow: (this.state.eventCount >= 4 ? 4 : this.state.eventCount),
                slidesToScroll: 1,
                speed: 800,
                afterChange: current => ($('.date-active').length > 0 ? this.filterEvents($('.date-active').data('date')) : null),
                responsive: [
                    {breakpoint: 640,
                        settings: {
                            vertical: true,
                            arrows: false,
                            slidesToShow: (this.state.eventCount >= 4 ? 4 : this.state.eventCount),
                            slidesToScroll: 1,
                        },
                    },
                    {breakpoint: 992,
                        settings: {
                            vertical: false,
                            arrows: true,
                            slidesToShow: 2,
                            slidesToScroll: 1,
                        }
                    },
                    {breakpoint: 1600,
                        settings: {
                            vertical: false,
                            arrows: true,
                            slidesToShow: 3,
                            slidesToScroll: 1,
                        }
                    }
                ]
            };
            return(
                <div className="events-container">
                    {this.state.eventCount > 0 && (
                        <Slider
                            className={"events-page-slider"}
                            ref={a => this.slider = a }
                            {...settings}
                        >
                            {this.state.events}
                        </Slider>
                    )}
                </div>
            );
        }
        return null;
    }
}


export default EventsList;
