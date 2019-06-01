// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import $ from 'jquery';

const moment = extendMoment(Moment);

class Hours extends Component{
    constructor(props){
        super(props);

        this.state = {
            hours: this.buildHours(this.props.optionsData),
            customHoursMessage: (this.props.optionsData.acf.enable_hours_may_vary ? this.props.optionsData.acf.custom_hours_message : false),
        }
    }

    buildHours(hoursData){

        let today;
        let range;
        let hours_label;
        let startDate = hoursData.acf.standard_hours[0].start_date;
        let endDate = hoursData.acf.standard_hours[0].end_date;
        let special_instructions = hoursData.acf.standard_hours[0].special_instructions;
        let monday_closed = hoursData.acf.standard_hours[0].monday_closed;
        let monday_open = hoursData.acf.standard_hours[0].monday_open;
        let monday_close = hoursData.acf.standard_hours[0].monday_close;
        let tuesday_closed = hoursData.acf.standard_hours[0].tuesday_closed;
        let tuesday_open = hoursData.acf.standard_hours[0].tuesday_open;
        let tuesday_close = hoursData.acf.standard_hours[0].tuesday_close;
        let wednesday_closed = hoursData.acf.standard_hours[0].wednesday_closed;
        let wednesday_open = hoursData.acf.standard_hours[0].wednesday_open;
        let wednesday_close = hoursData.acf.standard_hours[0].wednesday_close;
        let thursday_closed = hoursData.acf.standard_hours[0].thursday_closed;
        let thursday_open = hoursData.acf.standard_hours[0].thursday_open;
        let thursday_close = hoursData.acf.standard_hours[0].thursday_close;
        let friday_closed = hoursData.acf.standard_hours[0].friday_closed;
        let friday_open = hoursData.acf.standard_hours[0].friday_open;
        let friday_close = hoursData.acf.standard_hours[0].friday_close;
        let saturday_closed = hoursData.acf.standard_hours[0].saturday_closed;
        let saturday_open = hoursData.acf.standard_hours[0].saturday_open;
        let saturday_close = hoursData.acf.standard_hours[0].saturday_close;
        let sunday_closed = hoursData.acf.standard_hours[0].sunday_closed;
        let sunday_open = hoursData.acf.standard_hours[0].sunday_open;
        let sunday_close = hoursData.acf.standard_hours[0].sunday_close;

        let dateString;
        let mondayString;
        let tuesdayString;
        let wednesdayString;
        let thursdayString;
        let fridayString;
        let saturdayString;
        let sundayString;

        // test for active alternative hours
        if(hoursData.acf.alternate_hours){
            $.each(hoursData.acf.alternate_hours, function(){
                moment.createFromInputFallback = function(config) {
                    // unreliable string magic, or
                    config._d = new Date(config._i);
                };
                today = moment();
                startDate = this.start_date;
                endDate = this.end_date;
                range = moment.range(startDate, endDate);

                if(range.contains(today)){
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
                }
            });
        }

        if(typeof startDate === 'undefined'){
            dateString = moment().format('MMMM') + " " +  moment().startOf('isoWeek').format('Do') + ' - ' + moment().endOf('isoWeek').format('Do');
        }
        else{
            dateString = (moment(startDate).format('MMMM') === moment(endDate).format('MMMM') ? moment(startDate).format('MMMM D') + ' - ' + moment(endDate).format('D') : moment(startDate).format('MMMM D') + ' - ' + moment(endDate).format('MMMM D') );
        }
        mondayString = (monday_closed ? 'Closed' : monday_open + ' - ' + monday_close);
        tuesdayString = (tuesday_closed ? 'Closed' : tuesday_open + ' - ' + tuesday_close);
        wednesdayString = (wednesday_closed ? 'Closed' : wednesday_open + ' - ' + wednesday_close);
        thursdayString = (thursday_closed ? 'Closed' : thursday_open + ' - ' + thursday_close);
        fridayString = (friday_closed ? 'Closed' : friday_open + ' - ' + friday_close);
        saturdayString = (saturday_closed ? 'Closed' : saturday_open + ' - ' + saturday_close);
        sundayString = (sunday_closed ? 'Closed' : sunday_open + ' - ' + sunday_close);

        let startDayOfWeek = 'Monday';
        let daysOfWeek = 'Monday';
        let hourOfDay = mondayString;
        let hasMatchingDays = false;

        function checkDays(day1, day2, dayTitle){
            if(day1 === day2){
                daysOfWeek = startDayOfWeek + ' - '+ dayTitle;
                hasMatchingDays = true;
                return '';
            }else{
                if(hasMatchingDays){
                    hasMatchingDays = false;
                    daysOfWeek = daysOfWeek + ' - ' + day1;
                }else{
                    daysOfWeek = startDayOfWeek + ' - ' + day1;
                }

                startDayOfWeek = dayTitle;
                hourOfDay = day2;
                return '<br/>' + daysOfWeek;
            }
        }

        let daysDisplay = checkDays(mondayString, tuesdayString, 'Tuesday');
        daysDisplay += checkDays(tuesdayString, wednesdayString, 'Wednesday');
        daysDisplay += checkDays(wednesdayString, thursdayString, 'Thursday');
        daysDisplay += checkDays(thursdayString, fridayString, 'Friday');
        daysDisplay += checkDays(fridayString, saturdayString, 'Saturday');
        daysDisplay += checkDays(saturdayString, sundayString, 'Sunday');
        daysDisplay += checkDays(sundayString, 0, 'Monday');


        return({
            hoursLabel: hours_label,
            specialInstructions: special_instructions,
            date: dateString,
            daysDisplay: daysDisplay,
            monday: mondayString,
            tuesday: tuesdayString,
            wednesday: wednesdayString,
            thursday: thursdayString,
            friday: fridayString,
            saturday: saturdayString,
            sunday: sundayString,
        });
    }

    render(){
        return(
            <div>
                {this.state.customHoursMessage ? (
                    <p>
                        {this.state.customHoursMessage}
                    </p>
                ) : (
                    <div>
                        <h3 className="hours-title">Hours</h3>
                        {this.state.hours.specialInstructions ? <p dangerouslySetInnerHTML={{ __html: this.state.hours.specialInstructions}}></p> : ''}
                        <p dangerouslySetInnerHTML={{ __html: this.state.hours.daysDisplay.slice(5)}}></p>
                    </div>
                )}
            </div>
        );
    }
}

export default Hours;