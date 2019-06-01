// Packages
import React, { PropTypes, Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import moment from 'moment';


// Endpoints

class HoursToday extends Component {
    constructor(props) {
        super(props);

        this.formatHours = this.formatHours.bind(this);

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
                        this.formatHours(hours);
                        activeHours = true
                    }
                })
                if(!activeHours){
                    this.formatHours(this.props.storeData.acf.standard_hours[0]);
                }
            }
            else{
                this.formatHours(this.props.storeData.acf.standard_hours[0]);
            }
        }
        else{
            if(this.props.optionsData.acf.alternate_hours){
                let activeHours = false;
                this.props.optionsData.acf.alternate_hours.map((hours) => {
                    range = moment.range(hours.start_date, hours.end_date);
                    if(range.contains(moment())){
                        this.formatHours(hours);
                        activeHours = true;
                    }
                })
                if(!activeHours){
                    this.formatHours(this.props.optionsData.acf.standard_hours[0]);
                }
            }
            else{
                this.formatHours(this.props.optionsData.acf.standard_hours[0]);
            }
        }
    }

    formatHours(hours){

        let dayOfWeek = moment().format('dddd').toLowerCase();
        let closed = hours[dayOfWeek + '_closed'];
        let openTime = hours[dayOfWeek + '_open'];
        let closeTime = hours[dayOfWeek + '_close'];
        let hoursRange = closed ? false : moment.range(openTime, closeTime);
        let isClosed = hoursRange.contains(moment()) && hoursRange;

        this.setState({
            data: true,
            isClosed: isClosed,
            closeTime: moment(closeTime, 'h:mm a').format('h') + (moment(closeTime, 'h:mm a').format('mm') !== '00' ? ':' + moment(closeTime, 'h:mm a').format('mm') : '') + moment(closeTime, 'h:mm a').format('a'),
        });
    }

    render(){
        if(this.state.data){
            return(
                <p>
                    <b>Currently {this.state.isClosed ? 'Closed' : 'Open'}</b> - Closes at {this.state.closeTime}
                </p>
            );
        }
        return null;

    }
}

export default HoursToday;