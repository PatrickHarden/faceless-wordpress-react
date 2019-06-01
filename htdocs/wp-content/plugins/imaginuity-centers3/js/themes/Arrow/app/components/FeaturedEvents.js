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

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Events = SiteURL + '/wp-json/wp/v2/events/';

class FeaturedEvents extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            featuredEvents: '',
        }
    }

    componentWillMount(){

        const component = this;

        let featuredEvents = [];
        let counter = 0;

        this.props.featuredEvents.map((featuredEvent) => {
            this.props.eventsData.map((event) => {
                if(featuredEvent.ID === event.id){
                    counter++;
                    let title;
                    let smallScreenTitle;
                    let largeScreenTitle;
                    let titleFull = event.title.rendered;
                    let dateString;
                    let timeString;

                    if(event.title.rendered.length > 35){
                        title = entities.decode(event.title.rendered).substring(0, 35) + '. . .'
                    }
                    else{
                        title = entities.decode(event.title.rendered);
                    }

                    if(event.title.rendered.length > 25){
                        smallScreenTitle = entities.decode(event.title.rendered).substring(0, 25) + '. . .'
                    }
                    else{
                        smallScreenTitle = entities.decode(event.title.rendered);
                    }

                    if(event.title.rendered.length > 50){
                        largeScreenTitle = entities.decode(event.title.rendered).substring(0, 50) + '. . .'
                    }
                    else{
                        largeScreenTitle = entities.decode(event.title.rendered);
                    }


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

                    featuredEvents.push(
                        <div className={"featured-event" + (counter % 2 === 1 ? ' background-color-setter-lighter' : ' background-color-setter')}>
                            <div className="image-container hidden-xs">
                                <Link to={"/events/"+event.slug+"/"} key={event.id} >
                                    {event.acf.featured_image ? (
                                        <img src={event.acf.featured_image} alt={titleFull}/>
                                    ) : (
                                        <img src={this.props.optionsData.acf.logo} alt={titleFull} className="logo"/>
                                    )}
                                </Link>
                            </div>
                            <div className="copy">
                                {event.acf.related_store &&
                                <p className="related-store"><Link to={'/stores/'+event.acf.related_store.post_name+'/'} >{entities.decode(event.acf.related_store.post_title)}</Link></p>
                                }
                                <h3>
                                    <Link to={"/events/"+event.slug+"/"} key={event.id} >
                                        <span className="visible-xs visible-sm">{smallScreenTitle}</span>
                                        <span className="visible-md visible-lg">{title}</span>
                                        <span className="visible-xl">{largeScreenTitle}</span>
                                    </Link>
                                </h3>
                                <p className="time">
                                    {dateString}
                                    <br />
                                    {timeString}
                                </p>
                                <p className="read-more"><Link to={"/events/"+event.slug+"/"} key={event.id} >Read more &#187;</Link></p>
                            </div>
                        </div>
                    );


                }

            })
        })

        this.setState({
            data: true,
            featuredEvents: featuredEvents,
        });

    }

    render(){

        if(this.state.data){

            return(
                <div className="events-page-featured-events background-color-setter">
                    {this.state.featuredEvents}
                    <div className="clearfix"></div>
                </div>
            )
        }
        return <Loader />;
    }
}

export default FeaturedEvents;