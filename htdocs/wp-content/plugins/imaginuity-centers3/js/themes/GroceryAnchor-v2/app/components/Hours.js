// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import $ from 'jquery';

class Hours extends Component{
    constructor(props){
        super(props);

        this.state = {
            hours: this.buildHours(this.props.optionsData),
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
                    return false;
                }
                else{
                    startDate = false;
                }
            });
        }

        if(!startDate){
            if(moment().startOf('isoWeek').format('MMMM') === moment().endOf('isoWeek').format('MMMM')){
                dateString = moment().startOf('isoWeek').format('MMMM') + " " +  moment().startOf('isoWeek').format('Do') + ' - ' + moment().endOf('isoWeek').format('Do');
            }
            else{
                dateString = moment().startOf('isoWeek').format('MMMM') + " " +  moment().startOf('isoWeek').format('Do') + ' - ' + moment().endOf('isoWeek').format('MMMM') + " " + moment().endOf('isoWeek').format('Do')
            }
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

        let startDayOfWeek = 'Mon';
        let daysOfWeek = 'Mon';
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
                if(counter > 1){
                    counter ++;
                    return "<br/>"+daysOfWeek;
                }
                else{
                    counter ++;
                    return daysOfWeek;
                }
            }
        }

        function checkDays2(day1, day2, dayTitle){
            if(day1 === day2){
                daysOfWeek = startDayOfWeek + ' - '+ dayTitle;
                hasMatchingDays = true;
                return '';
            }else{
                if(hasMatchingDays){
                    hasMatchingDays = false;
                    daysOfWeek = daysOfWeek + ' ' + day1;
                }else{
                    daysOfWeek = startDayOfWeek + ' ' + day1;
                }

                startDayOfWeek = dayTitle;
                hourOfDay = day2;
                if(counter2 > 1){
                    counter2 ++;
                    return " / "+daysOfWeek;
                }
                else{
                    counter2 ++;
                    return daysOfWeek;
                }
            }
        }

        let counter = 1;
        let counter2 = 1;

        let daysDisplay = checkDays(mondayString, tuesdayString, 'Tue');
        daysDisplay += checkDays(tuesdayString, wednesdayString, 'Wed');
        daysDisplay += checkDays(wednesdayString, thursdayString, 'Thur');
        daysDisplay += checkDays(thursdayString, fridayString, 'Fri');
        daysDisplay += checkDays(fridayString, saturdayString, 'Sat');
        daysDisplay += checkDays(saturdayString, sundayString, 'Sun');
        daysDisplay += checkDays(sundayString, 0, 'Mon');

        let daysDisplay2 = checkDays2(mondayString, tuesdayString, 'Tue');
        daysDisplay2 += checkDays2(tuesdayString, wednesdayString, 'Wed');
        daysDisplay2 += checkDays2(wednesdayString, thursdayString, 'Thur');
        daysDisplay2 += checkDays2(thursdayString, fridayString, 'Fri');
        daysDisplay2 += checkDays2(fridayString, saturdayString, 'Sat');
        daysDisplay2 += checkDays2(saturdayString, sundayString, 'Sun');
        daysDisplay2 += checkDays2(sundayString, 0, 'Mon');

        return({
            hoursLabel: hours_label,
            specialInstructions: special_instructions,
            daysDisplay: daysDisplay,
            daysDisplay2: daysDisplay2,
            date: dateString,
            monday: mondayString,
            tuesday: tuesdayString,
            wednesday: wednesdayString,
            thursday: thursdayString,
            friday: fridayString,
            saturday: saturdayString,
            sunday: sundayString,
        });
        //<p>Monday <br /> {this.state.hours.monday}</p>
        //<p>Tuesday <br /> {this.state.hours.tuesday}</p>
        //<p>Wednesday <br /> {this.state.hours.wednesday}</p>
        //<p>Thursday <br /> {this.state.hours.thursday}</p>
        //<p>Friday <br /> {this.state.hours.friday}</p>
        //<p>Saturday <br /> {this.state.hours.saturday}</p>
        //<p>Sunday <br /> {this.state.hours.sunday}</p>
    }

    render(){
        return(
            <div>
                <Col xs={12} sm={6} className="hours visible-sm visible-xs">
                    <p>Hours</p>
                    {this.state.hours.specialInstructions ? <p>{this.state.hours.specialInstructions}</p> : ''}
                    {this.props.optionsData.acf.enable_hours_may_vary ? (
                        <p>{this.props.optionsData.acf.custom_hours_message}</p>
                    ) : (
                        <p><span dangerouslySetInnerHTML={{ __html: this.state.hours.daysDisplay}} /></p>
                    )}
                </Col>
                <Col md={6} className="hours hidden-sm hidden-xs">
                    <p>Hours</p>
                    {this.state.hours.specialInstructions ? <p>{this.state.hours.specialInstructions}</p> : ''}
                    {this.props.optionsData.acf.enable_hours_may_vary ? (
                    <p>{this.props.optionsData.acf.custom_hours_message}</p>
                    ) : (
                    <p><span dangerouslySetInnerHTML={{ __html: this.state.hours.date + ' / ' + this.state.hours.daysDisplay2}} /></p>
                    )}
                </Col>
            </div>

        );
    }
}

export default Hours;