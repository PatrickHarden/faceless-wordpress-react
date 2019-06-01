// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class MonthFilter extends Component{
    constructor(props) {
        super(props);

        let component = this;

        //create month filters
        let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let monthsRow = months.map(function (month_id) {
            let month = moment().month(month_id);
            return (
                <li
                    className="month-filter"
                    key={month_id}
                    data-month={month.format("M")}
                    onClick={component.props.filter}
                >
                    {month.format("MMM")}
                </li>
            );
        });

        let monthsMobile = [moment().subtract(1, 'M').format('M'), moment().format('M'), moment().add(1, 'M').format('M'), moment().add(2, 'M').format('M')];

        let monthsRowMobile = monthsMobile.map(function (month_id) {
            let month = moment().month(month_id);
            return (
                <li
                    className="month-filter"
                    key={month_id}
                    data-month={month.format("M")}
                    onClick={component.props.filter}
                >
                    {month.format("MMM")}
                </li>
            );
        });

        this.state = {
            data: true,
            months: monthsRow,
            monthsMobile: monthsRowMobile,
        };

    }


    render(){

        if(this.state.data){
            return(
                <Row className="month-filter-container background-color-setter-lightest font-color-setter">
                    <ul className="months-row">
                        <span className="visible-xs visible-sm">{this.state.monthsMobile}</span>
                        <span className="hidden-xs hidden-sm">{this.state.months}</span>
                    </ul>
                </Row>
            );
        }
        return null;
    }
}


export default MonthFilter;
