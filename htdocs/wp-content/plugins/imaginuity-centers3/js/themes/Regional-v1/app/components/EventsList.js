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
                excerpt = entities.decode(event.acf.post_copy).replace(regex, "").substr(0, 200);
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
            }
            else {
                excerpt = false;
            }

            let dateRangeCheck = (event.acf.start_date == event.acf.end_date);
            let startWeekday = (event.acf.start_date ? moment(event.acf.start_date).format('dddd') : '');
            let endWeekday = (event.acf.end_date ? moment(event.acf.end_date).format('dddd') : '');
            let singleStartMonth = (event.acf.start_date ? moment(event.acf.start_date).format('MMM. DD') : '');
            let rangeStartDate = (event.acf.start_date ? moment(event.acf.start_date).format('MMM. DD') : '');
            let rangeEndDate = (event.acf.end_date ? moment(event.acf.end_date).format('MMM. DD') : '');

            let startTime = (event.acf.start_time ? moment(event.acf.start_time, 'h:mm a').format('h:mm a') : '');
            let endTime = (event.acf.end_time ? moment(event.acf.end_time, 'h:mm a').format('h:mm a') : '');
            let timeString = startTime !== endTime ? (startTime == '' && endTime== '' ? 'All Day' : startTime + ' - ' + endTime) : (startTime == '' ? '' : startTime );
            if(moment(event.acf.end_time, 'h:mm a').diff(moment(event.acf.start_time, 'h:mm a')) == 86340000 || moment(event.acf.start_time, 'h:mm a').diff(moment(event.acf.end_time, 'h:mm a')) == -86340000){
                timeString = 'All Day';
            }

            if(moment().diff(event.acf.end_date, 'days') <= 0 ){
                eventCount++;
                return(
                    <Col xs={12} md={6} className="event filter-item border-color-setter"
                         data-startMonth={moment(event.acf.start_date).format('M')}
                         data-endMonth={moment(event.acf.end_date).format('M')}
                         data-categories={'[' + (event.event_categories ? event.event_categories : 0) + ']'}
                         startdate={moment(event.acf.start_date).format('DDDD')}
                         key={i}>
                        {event.acf.featured_image &&
                            <Col xs={12} sm={6}>
                                <Link to={"/events/"+event.slug+"/"}>
                                    <img className="img-responsive" src={entities.decode(event.acf.featured_image)} alt={entities.decode(event.title.rendered) + "featured image"} />
                                </Link>
                            </Col>
                        }
                        <Col xs={12} sm={event.acf.featured_image ? 6 : 12}>
                            <div className="date-container font-color-setter">
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
                            </div>
                            <div className="copy-container font-color-setter">
                                <p>{timeString}</p>
                                <h4><Link to={"/events/"+event.slug} key={event.id}>{entities.decode(event.title.rendered)}</Link></h4>
                                {event.acf.related_store &&
                                <Link className="store-link" key={event.acf.related_store.ID} to={'/stores/'+event.acf.related_store.post_name+"/"} storeID={event.acf.related_store.post_name}>
                                    {entities.decode(event.acf.related_store.post_title)}
                                </Link>
                                }
                                {excerpt &&
                                <p>{excerpt}<Link to={"/events/"+event.slug+"/"} className="font-color-setter" alt={"navigate to interior page for " + entities.decode(event.title.rendered)}>Read More</Link></p>
                                }
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
        if(filterValue == 'all'){
            $('.filter-item').removeClass('hidden');
        }
        else{
            filterValue = parseInt(filterValue);
            $('.filter-item').each(function(){
                if($.inArray(filterValue, $(this).data('categories')) > -1){
                    $(this).removeClass('hidden');
                }
            });
        }
    }

    render(){
        if(this.state.data){
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
                            {this.state.eventCount > 0 &&
                                this.state.events
                            }
                            {this.state.eventCount === 0 &&
                                <h2>{(this.props.pageData.acf.use_custom_no_events_message ? this.props.pageData.acf.no_event_message : "There are no events currently available.")}</h2>
                            }
                        </Row>
                    </Grid>
                </div>
            );
        }
        return null;
    }
}


export default EventsList;
