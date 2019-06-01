// Packages
import React, { PropTypes, Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import moment from 'moment';


// Endpoints

class HoursWeekly extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
        }
    }

    componentWillMount(){

        let range;

        if(this.props.storeData.acf.custom_hours){
            if(this.props.storeData.acf.alternate_hours){
                let activeHours = false;
                this.props.storeData.acf.alternate_hours.map((hours) => {
                    range = moment.range(hours.start_date, hours.end_date);
                    if(range.contains(moment())){
                        this.buildHours(hours);
                        activeHours = true;
                    }
                })
                if(!activeHours){
                    this.buildHours(this.props.storeData.acf.standard_hours[0]);
                }
            }
            else{
                this.buildHours(this.props.storeData.acf.standard_hours[0]);
            }
        }
        else{
            if(this.props.optionsData.acf.alternate_hours){
                let activeHours = false;
                this.props.optionsData.acf.alternate_hours.map((hours) => {
                    range = moment.range(hours.start_date, hours.end_date);
                    if(range.contains(moment())){
                        this.buildHours(hours);
                        activeHours = true;
                    }
                })
                if(!activeHours){
                    this.buildHours(this.props.optionsData.acf.standard_hours[0]);
                }
            }
            else{
                this.buildHours(this.props.optionsData.acf.standard_hours[0]);
            }
        }
    }

    buildHours(hours){

        let mondayString = (hours.monday_closed ? 'Closed' : this.formatHours(hours.monday_open) + ' - ' + this.formatHours(hours.monday_close));
        let tuesdayString = (hours.tuesday_closed ? 'Closed' : this.formatHours(hours.tuesday_open) + ' - ' + this.formatHours(hours.tuesday_close));
        let wednesdayString = (hours.wednesday_closed ? 'Closed' : this.formatHours(hours.wednesday_open) + ' - ' + this.formatHours(hours.wednesday_close));
        let thursdayString = (hours.thursday_closed ? 'Closed' : this.formatHours(hours.thursday_open) + ' - ' + this.formatHours(hours.thursday_close));
        let fridayString = (hours.friday_closed ? 'Closed' : this.formatHours(hours.friday_open) + ' - ' + this.formatHours(hours.friday_close));
        let saturdayString = (hours.saturday_closed ? 'Closed' : this.formatHours(hours.saturday_open) + ' - ' + this.formatHours(hours.saturday_close));
        let sundayString = (hours.sunday_closed ? 'Closed' : this.formatHours(hours.sunday_open) + ' - ' + this.formatHours(hours.sunday_close));

        let startDayOfWeek = 'Monday';
        let daysOfWeek = 'Monday';
        let hourOfDay = mondayString;
        let hasMatchingDays = false;

        let daysDisplay = checkDays(mondayString, tuesdayString, 'Tuesday');
        daysDisplay += checkDays(tuesdayString, wednesdayString, 'Wednesday');
        daysDisplay += checkDays(wednesdayString, thursdayString, 'Thursday');
        daysDisplay += checkDays(thursdayString, fridayString, 'Friday');
        daysDisplay += checkDays(fridayString, saturdayString, 'Saturday');
        daysDisplay += checkDays(saturdayString, sundayString, 'Sunday');
        daysDisplay += checkDays(sundayString, 0, 'Monday');

        function checkDays(day1, day2, dayTitle){

            if(day1 === day2){
                daysOfWeek = startDayOfWeek + ' - ' + dayTitle;
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
                return (dayTitle !== 'Monday' ? daysOfWeek + " | " : daysOfWeek);
            }
        }

        this.setState({
            data: true,
            hoursString: daysDisplay,
        })
    }

    formatHours(hours){
        return moment(hours, 'h:mm a').format('h') + (moment(hours, 'h:mm a').format('mm') !== '00' ? moment(hours, 'h:mm a').format('mm') : '') + moment(hours, 'h:mm a').format('a');
    }

    render(){
        if(this.state.data){
            return(
                <p>
                    {this.state.hoursString}
                </p>
            );
        }
        return null;

    }
}

export default HoursWeekly;