// Packages
import React, { PropTypes, Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import moment from 'moment';


// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class HoursToday extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            hours: '',
        }
    }

    componentWillMount(){

        let component = this;

        axios.all([
                axios.get(PropertyOptions),
            ])
            .then(axios.spread(function (options) {

                component.setState({
                    data: true,
                    hours: component.buildHours(options),
                    optionsData: options.data,
                })

            }))
            .catch((err) => {
                console.log(err);
            });

    }

    buildHours(hoursData){

        let today;
        let range;
        let startDate = hoursData.data.acf.standard_hours[0].start_date;
        let endDate = hoursData.data.acf.standard_hours[0].end_date;
        let special_instructions = hoursData.data.acf.standard_hours[0].special_instructions;
        let monday_closed = hoursData.data.acf.standard_hours[0].monday_closed;
        let monday_open = hoursData.data.acf.standard_hours[0].monday_open;
        let monday_close = hoursData.data.acf.standard_hours[0].monday_close;
        let tuesday_closed = hoursData.data.acf.standard_hours[0].tuesday_closed;
        let tuesday_open = hoursData.data.acf.standard_hours[0].tuesday_open;
        let tuesday_close = hoursData.data.acf.standard_hours[0].tuesday_close;
        let wednesday_closed = hoursData.data.acf.standard_hours[0].wednesday_closed;
        let wednesday_open = hoursData.data.acf.standard_hours[0].wednesday_open;
        let wednesday_close = hoursData.data.acf.standard_hours[0].wednesday_close;
        let thursday_closed = hoursData.data.acf.standard_hours[0].thursday_closed;
        let thursday_open = hoursData.data.acf.standard_hours[0].thursday_open;
        let thursday_close = hoursData.data.acf.standard_hours[0].thursday_close;
        let friday_closed = hoursData.data.acf.standard_hours[0].friday_closed;
        let friday_open = hoursData.data.acf.standard_hours[0].friday_open;
        let friday_close = hoursData.data.acf.standard_hours[0].friday_close;
        let saturday_closed = hoursData.data.acf.standard_hours[0].saturday_closed;
        let saturday_open = hoursData.data.acf.standard_hours[0].saturday_open;
        let saturday_close = hoursData.data.acf.standard_hours[0].saturday_close;
        let sunday_closed = hoursData.data.acf.standard_hours[0].sunday_closed;
        let sunday_open = hoursData.data.acf.standard_hours[0].sunday_open;
        let sunday_close = hoursData.data.acf.standard_hours[0].sunday_close;

        let dateString;

        // test for active alternative hours
        if(hoursData.data.acf.alternate_hours){
            $.each(hoursData.data.acf.alternate_hours, function(){
                moment.createFromInputFallback = function(config) {
                    // unreliable string magic, or
                    config._d = new Date(config._i);
                };
                today = moment();
                startDate = this.start_date;
                endDate = this.end_date;
                range = moment.range(startDate, endDate);

                if(range.contains(today)){
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

        let todayClosed;
        let todayStart;
        let todayEnd;

        switch(moment().format('d')){
            case '0':
                todayClosed = sunday_closed;
                todayStart = sunday_open;
                todayEnd = sunday_close;
                break;
            case '1':
                todayClosed = monday_closed;
                todayStart = monday_open;
                todayEnd = monday_close;
                break;
            case '2':
                todayClosed = tuesday_closed;
                todayStart = tuesday_open;
                todayEnd = tuesday_close;
                break;
            case '3':
                todayClosed = wednesday_closed;
                todayStart = wednesday_open;
                todayEnd = wednesday_close;
                break;
            case '4':
                todayClosed = thursday_closed;
                todayStart = thursday_open;
                todayEnd = thursday_close;
                break;
            case '5':
                todayClosed = friday_closed;
                todayStart = friday_open;
                todayEnd = friday_close;
                break;
            case '6':
                todayClosed = saturday_closed;
                todayStart = saturday_open;
                todayEnd = saturday_close;
                break;
        }

        dateString = (hoursData.data.acf.todays_hours_label ? hoursData.data.acf.todays_hours_label : 'Today\'s Hours') + ' / ' + (todayClosed ? 'Closed' : todayStart + ' - ' + todayEnd);

        return(
            dateString
        );
    }

    render(){
        if(this.state.data){
            return(
                <div className="hours-today">
                    <p>{this.state.optionsData.acf.enable_hours_may_vary ? this.state.optionsData.acf.custom_hours_message : this.state.hours}</p>
                </div>
            );
        }
        return null;
    }
}

export default HoursToday;