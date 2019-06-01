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

    formatHours(hours){

        let dayOfWeek = moment().format('dddd').toLowerCase();
        let closed = hours[dayOfWeek + '_closed'];
        let openTime = hours[dayOfWeek + '_open'];
        let closeTime = hours[dayOfWeek + '_close'];

        this.setState({
            data: true,
            closed: closed,
            openTime: !closed ? moment(openTime, 'h:mm a').format('h') + (moment(openTime, 'h:mm a').format('mm') !== '00' ? ':' + moment(openTime, 'h:mm a').format('mm') : '') + moment(openTime, 'h:mm a').format('a') : false,
            closeTime: !closed ? moment(closeTime, 'h:mm a').format('h') + (moment(closeTime, 'h:mm a').format('mm') !== '00' ? ':' + moment(closeTime, 'h:mm a').format('mm') : '') + moment(closeTime, 'h:mm a').format('a') : false,

        });
    }

    render(){
        if(this.state.data){
            return(
                <span>
                    <b>Today's Hours:</b> {this.state.closed ? 'Closed' : this.state.openTime + ' - ' + this.state.closeTime}
                </span>
            );
        }
        return null;

    }
}

export default HoursToday;