// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import MonthFilter from '../components/MonthFilter';
import DropdownFilter from '../components/DropdownFilter';
import Masonry from 'react-masonry-component';

let masonryOptions = {
    transitionDuration: 200,
    horizontalOrder: true,
};

class EventsList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            events: '',
            eventCount: 0,
        };
    }

    componentWillMount(){
        let eventCount = 0;

        let events = this.props.eventsData.map((event, i) => {

            let excerpt;
            if (event.acf.post_copy) {
                var regex = /(<([^>]+)>)/ig;
                excerpt = entities.decode(event.acf.post_copy).replace(regex, "").substr(0, 200).lastIndexOf(" ");
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

            let startTime = (event.acf.start_time ? moment(event.acf.start_time, 'h:mm a').format('h:mm a') : 'TBD');
            let endTime = (event.acf.end_time ? moment(event.acf.end_time, 'h:mm a').format('h:mm a') : 'TBD');
            let timeString = startTime !== endTime ? (startTime == 'TBD' && endTime== 'TBD' ? 'All Day' : startTime + ' - ' + endTime) : (startTime == 'TBD' ? 'TBD' : startTime );
            timeString = startTime == 'TBD' && endTime == 'TBD' ? 'All Day' : timeString;
            if(moment(event.acf.end_time, 'h:mm a').diff(moment(event.acf.start_time, 'h:mm a')) == 86340000 || moment(event.acf.start_time, 'h:mm a').diff(moment(event.acf.end_time, 'h:mm a')) == -86340000){
                timeString = 'All Day';
            }

            if(moment().diff(event.acf.end_date, 'days') <= 0 ){
                eventCount++;
                return(
                    <Col xs={12} md={6} className="event filter-item border-color-setter" data-startMonth={moment(event.acf.start_date).format('M')} data-endMonth={moment(event.acf.end_date).format('M')} data-categories={'[' + (event.event_categories ? event.event_categories : 0) + ']'} key={i} startmonth={event.acf.start_date}>
                        {event.acf.featured_image &&
                            <Col xs={12} sm={6}>
                                <Link to={"/events/"+event.slug} key={event.id} >
                                    <img className="img-responsive" src={entities.decode(event.acf.featured_image)} alt={entities.decode(event.title.rendered)} />
                                </Link>
                            </Col>
                        }
                        <Col xs={12} sm={event.acf.featured_image ? 6 : 12}>
                            <div className="date-container font-color-setter">
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
                            </div>
                            <div className="copy-container font-color-setter">
                                <p>{timeString}</p>
                                <h4><Link to={"/events/"+event.slug} key={event.id} >{entities.decode(event.title.rendered)}</Link></h4>
                                {event.acf.related_store &&
                                <Link className="store-link" key={event.acf.related_store.ID} to={'/stores/'+event.acf.related_store.post_name} storeID={event.acf.related_store.post_name}>
                                    {entities.decode(event.acf.related_store.post_title)}
                                </Link>
                                }
                                {excerpt &&
                                <p>{excerpt} <Link to={"/events/"+event.slug} key={event.id} >[...]</Link></p>
                                }
                            </div>
                        </Col>
                    </Col>
                );
            }
        });

        // Sort alphabetically with empties at the end
        let sortedEvents = events.sort(function(a, b) {
            if(a.props.startmonth === "" || a.props.startmonth === null) return 1;
            if(b.props.startmonth === "" || b.props.startmonth === null) return -1;
            if(a.props.startmonth === b.props.startmonth) return 0;
            return a.props.startmonth < b.props.startmonth ? -1 : 1;
        });

        this.setState({
            data: true,
            events: sortedEvents,
            eventCount: eventCount,
        });
    }

    setMonthFilter(e){
        if($(e.currentTarget).hasClass('active')){
            $(e.currentTarget).removeClass('active');
            $('.filter-item').removeClass('hidden');
        }
        else{
            $('.month-filter.active').removeClass('active');
            $(e.currentTarget).addClass('active');
            let filterMonth = $(e.currentTarget).data('month');
            $('.filter-item').addClass('hidden');
            $('.filter-item').each(function(){
                if(filterMonth >= $(this).data('startmonth') && filterMonth <= $(this).data('endmonth')){
                    $(this).removeClass('hidden');
                }
            });
        }
    }

    categoryFilter(){
        $('.filter-item').addClass('hidden');
        let filterValue = $('#eventCategories-filter').val();
        console.log(filterValue);
        if(filterValue == 'all'){
            $('.filter-item').removeClass('hidden');
        }
        else{
            filterValue = parseInt(filterValue);
            $('.filter-item').each(function(){
                console.log($.inArray(filterValue, $(this).data('categories')) > -1);
                if($.inArray(filterValue, $(this).data('categories')) > -1){
                    console.log($(this).data('categories'));
                    $(this).removeClass('hidden');
                }
            });
        }
    }

    render(){
        if(this.state.data){
            if(this.state.eventCount > 0){
                return(
                    <div className="events">
                        <MonthFilter filter={this.setMonthFilter.bind(this)} />
                        <DropdownFilter
                            filterType="eventCategories"
                            filterItems={this.props.categories}
                            filter={this.categoryFilter.bind(this)}
                            label="Category"
                        />
                        <Grid>
                            <Row>
                                {this.state.events}
                            </Row>
                        </Grid>
                    </div>
                );
            }
            else{
                return(
                    <div className="event">
                        <Grid>
                            <Row>
                                <Col xs={12}>
                                    <h2 style={{margin: '50px 0'}}>There are no events at this time.</h2>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                );
            }
        }
        return null;
    }
}


export default EventsList;
