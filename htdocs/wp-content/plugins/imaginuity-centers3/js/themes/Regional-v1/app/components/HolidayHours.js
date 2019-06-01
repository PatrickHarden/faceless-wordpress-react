// Packages
import React, { Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let $ = require('jquery');
let moment = require('moment');
let momentRange = require('moment-range/dist/moment-range.js');
moment = momentRange.extendMoment(moment);

// Components
import Loader from './Loader';
import Slider from 'react-slick';
// import { ArrowLeft } from "react-icons/lib/ti";
// import { ArrowRight } from "react-icons/lib/ti";

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Stores = SiteURL + '/wp-json/wp/v2/stores';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class HolidayHours extends Component {
    constructor(props){
        super(props);

        this.state = {
            template: this.props.template,
            storeID: this.props.storeID,
            customHours: this.props.customHours,
            storeHours: false,
            alternate_hours_label: '',
            start_date: '',
            end_date: '',
            special_instructions: '',
            monday_closed: '',
            monday_open: '',
            monday_close: '',
            tuesday_closed: '',
            tuesday_open: '',
            tuesday_close: '',
            wednesday_closed: '',
            wednesday_open: '',
            wednesday_close: '',
            thursday_closed: '',
            thursday_open: '',
            thursday_close: '',
            friday_closed: '',
            friday_open: '',
            friday_close: '',
            saturday_closed: '',
            saturday_open: '',
            saturday_close: '',
            sunday_closed: '',
            sunday_open: '',
            sunday_close: ''
        }
    }

    componentWillMount(){

        // Get page with the Home Page template applied, return advanced custom fields
        this.serverRequest = $.get(PropertyOptions, function (data) {

            let counter = 0;
            let weekCount = Math.abs(moment().diff('January 10 2018', 'weeks'));
            let weekChecker = moment().startOf('isoWeek').format('M/DD/YYYY');

            let hours_label;
            let today;
            let dateString;
            let startDate;
            let endDate;
            let special_instructions;
            let monday_closed;
            let monday_open;
            let monday_close;
            let tuesday_closed;
            let tuesday_open;
            let tuesday_close;
            let wednesday_closed;
            let wednesday_open;
            let wednesday_close;
            let thursday_closed;
            let thursday_open;
            let thursday_close;
            let friday_closed;
            let friday_open;
            let friday_close;
            let saturday_closed;
            let saturday_open;
            let saturday_close;
            let sunday_closed;
            let sunday_open;
            let sunday_close;

            let hoursArray = [];

            while (counter <= weekCount) {
                // test for active alternative hours
                if (data.acf.alternate_hours) {
                    $.each(data.acf.alternate_hours, function () {

                        if (moment(this.start_date).format('M/DD/YYYY') === weekChecker) {

                            moment.createFromInputFallback = function (config) {
                                // unreliable string magic, or
                                config._d = new Date(config._i);
                            };

                            startDate = this.start_date;
                            endDate = this.end_date;

                            hours_label = this.alternate_hours_label;
                            startDate = this.start_date;
                            endDate = this.end_date;
                            special_instructions = this.special_instructions;
                            monday_closed = this.monday_closed;
                            monday_open = this.monday_open;
                            monday_close = this.monday_close;
                            tuesday_closed = this.tuesday_closed;
                            tuesday_open = this.tuesday_open;
                            tuesday_close = this.tuesday_close;
                            wednesday_closed = this.wednesday_closed;
                            wednesday_open = this.wednesday_open;
                            wednesday_close = this.wednesday_close;
                            thursday_closed = this.thursday_closed;
                            thursday_open = this.thursday_open;
                            thursday_close = this.thursday_close;
                            friday_closed = this.friday_closed;
                            friday_open = this.friday_open;
                            friday_close = this.friday_close;
                            saturday_closed = this.saturday_closed;
                            saturday_open = this.saturday_open;
                            saturday_close = this.saturday_close;
                            sunday_closed = this.sunday_closed;
                            sunday_open = this.sunday_open;
                            sunday_close = this.sunday_close;

                            // if the start date and end date do not have the same month, show date abbreviations for both. Else, just display the day range
                            dateString = (moment(startDate, 'M/DD/YYYY').format('M') !== moment(endDate, 'M/DD/YYYY').format('M') ? moment(startDate, 'M/DD/YYYY').format('MMM D') + ' - ' + moment(endDate, 'M/DD/YYYY').format('MMM D') : moment(startDate, 'M/DD/YYYY').format('MMM D') + ' - ' + moment(endDate, 'M/DD/YYYY').format('D'));
                            return false;
                        }
                        else {



                            hours_label = 'Holiday Hours';
                            startDate = moment(weekChecker).startOf('isoWeek');
                            endDate = moment(weekChecker).endOf('isoWeek');
                            special_instructions = data.acf.standard_hours[0].special_instructions;
                            monday_closed = data.acf.standard_hours[0].monday_closed;
                            monday_open = data.acf.standard_hours[0].monday_open;
                            monday_close = data.acf.standard_hours[0].monday_close;
                            tuesday_closed = data.acf.standard_hours[0].tuesday_closed;
                            tuesday_open = data.acf.standard_hours[0].tuesday_open;
                            tuesday_close = data.acf.standard_hours[0].tuesday_close;
                            wednesday_closed = data.acf.standard_hours[0].wednesday_closed;
                            wednesday_open = data.acf.standard_hours[0].wednesday_open;
                            wednesday_close = data.acf.standard_hours[0].wednesday_close;
                            thursday_closed = data.acf.standard_hours[0].thursday_closed;
                            thursday_open = data.acf.standard_hours[0].thursday_open;
                            thursday_close = data.acf.standard_hours[0].thursday_close;
                            friday_closed = data.acf.standard_hours[0].friday_closed;
                            friday_open = data.acf.standard_hours[0].friday_open;
                            friday_close = data.acf.standard_hours[0].friday_close;
                            saturday_closed = data.acf.standard_hours[0].saturday_closed;
                            saturday_open = data.acf.standard_hours[0].saturday_open;
                            saturday_close = data.acf.standard_hours[0].saturday_close;
                            sunday_closed = data.acf.standard_hours[0].sunday_closed;
                            sunday_open = data.acf.standard_hours[0].sunday_open;
                            sunday_close = data.acf.standard_hours[0].sunday_close;

                            dateString = (moment(startDate, 'M/DD/YYYY').format('M') !== moment(endDate, 'M/DD/YYYY').format('M') ? moment(startDate, 'M/DD/YYYY').format('MMM D') + ' - ' + moment(endDate, 'M/DD/YYYY').format('MMM D') : moment(startDate, 'M/DD/YYYY').format('MMM D') + ' - ' + moment(endDate, 'M/DD/YYYY').format('D'));

                        }

                    });
                }
                else {

                    hours_label = 'Holiday Hours';
                    startDate = moment(weekChecker).startOf('isoWeek');
                    endDate = moment(weekChecker).endOf('isoWeek');
                    special_instructions = data.acf.standard_hours[0].special_instructions;
                    monday_closed = data.acf.standard_hours[0].monday_closed;
                    monday_open = data.acf.standard_hours[0].monday_open;
                    monday_close = data.acf.standard_hours[0].monday_close;
                    tuesday_closed = data.acf.standard_hours[0].tuesday_closed;
                    tuesday_open = data.acf.standard_hours[0].tuesday_open;
                    tuesday_close = data.acf.standard_hours[0].tuesday_close;
                    wednesday_closed = data.acf.standard_hours[0].wednesday_closed;
                    wednesday_open = data.acf.standard_hours[0].wednesday_open;
                    wednesday_close = data.acf.standard_hours[0].wednesday_close;
                    thursday_closed = data.acf.standard_hours[0].thursday_closed;
                    thursday_open = data.acf.standard_hours[0].thursday_open;
                    thursday_close = data.acf.standard_hours[0].thursday_close;
                    friday_closed = data.acf.standard_hours[0].friday_closed;
                    friday_open = data.acf.standard_hours[0].friday_open;
                    friday_close = data.acf.standard_hours[0].friday_close;
                    saturday_closed = data.acf.standard_hours[0].saturday_closed;
                    saturday_open = data.acf.standard_hours[0].saturday_open;
                    saturday_close = data.acf.standard_hours[0].saturday_close;
                    sunday_closed = data.acf.standard_hours[0].sunday_closed;
                    sunday_open = data.acf.standard_hours[0].sunday_open;
                    sunday_close = data.acf.standard_hours[0].sunday_close;

                    dateString = (moment(startDate, 'M/DD/YYYY').format('M') !== moment(endDate, 'M/DD/YYYY').format('M') ? moment(startDate, 'M/DD/YYYY').format('MMM D') + ' - ' + moment(endDate, 'M/DD/YYYY').format('MMM D') : moment(startDate, 'M/DD/YYYY').format('MMM D') + ' - ' + moment(endDate, 'M/DD/YYYY').format('D'));

                }

                hoursArray.push(
                    <div>
                        <div className="hours-set">
                            <p className="date-string">{"< Week of " + dateString + " >"}</p>
                            {special_instructions &&
                            <p>{special_instructions}</p>
                            }

                            <div className="hours-col">
                                <p>
                                    Monday, {moment(startDate, 'M/DD/YYYY').format('MMM. D')}: <br className="visible-xs" />
                                    <span>{monday_closed ? 'Closed' : monday_open + ' - ' + monday_close}</span>
                                </p>
                                <p>
                                    Tuesday, {moment(startDate, 'M/DD/YYYY').add('days', 1).format('MMM. D')}: <br className="visible-xs" />
                                    {tuesday_closed ? 'Closed' : tuesday_open + ' - ' + tuesday_close}
                                </p>
                                <p>
                                    Wednesday, {moment(startDate, 'M/DD/YYYY').add('days', 2).format('MMM. D')}: <br className="visible-xs" />
                                    {wednesday_closed ? 'Closed' : wednesday_open + ' - ' + wednesday_close}
                                </p>
                                <p>
                                    Thursday, {moment(startDate, 'M/DD/YYYY').add('days', 3).format('MMM. D')}: <br className="visible-xs" />
                                    {thursday_closed ? 'Closed' : thursday_open + ' - ' + thursday_close}
                                </p>
                                <p>
                                    Friday, { moment(startDate, 'M/DD/YYYY').add('days', 4).format('MMM. D')}: <br className="visible-xs" />
                                    {friday_closed ? 'Closed' : friday_open + ' - ' + friday_close}
                                </p>
                                <p>
                                    Saturday, {moment(startDate, 'M/DD/YYYY').add('days', 5).format('MMM. D')}: <br className="visible-xs" />
                                    {saturday_closed ? 'Closed' : saturday_open + ' - ' + saturday_close}
                                </p>
                                <p>
                                    Sunday, {moment(startDate, 'M/DD/YYYY').add('days', 6).format('MMM. D')}: <br className="visible-xs" />
                                    {sunday_closed ? 'Closed' : sunday_open + ' - ' + sunday_close}
                                </p>
                            </div>
                        </div>
                    </div>
                );

                weekChecker = moment(weekChecker).add(1, 'week').format('M/DD/YYYY');
                counter++;
            }
            this.setState({
                data: true,
                hours: hoursArray,
            });
        }.bind(this));
    }


    render(){
        if (this.state.data) {

            let slider_settings = {
                infinite: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                slickGoTo: 0,
                arrows: true,
                centerMode: true,
                responsive: [
                    {
                        breakpoint: 720,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            centerMode: true,
                        }
                    },
                ]
            };

            return (
                <div className="holiday-hours">
                    <h2>{this.props.siteData.name}<br/>Holiday Hours</h2>
                    <Slider
                        ref={c => this.slider = c}
                        {...slider_settings}
                    >
                        {this.state.hours}
                    </Slider>
                </div>
            )
        }
        return <Loader/>;
    }
}

export default HolidayHours;