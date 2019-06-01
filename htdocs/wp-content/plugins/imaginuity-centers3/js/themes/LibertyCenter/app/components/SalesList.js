// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import $ from 'jquery';

let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from './Loader';

class SalesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            sales: '',
            saleCount: 0,
        };
    }

    componentWillMount() {

        let saleCount = 0;

        let sales = [];

        console.log(this.props.salesData);

        console.log(this.props.pageData);

        this.props.salesData.map((sale) => {

            console.log('sale', sale);

            let weekDate;
            let monthDate;

            weekDate = (sale.acf.start_date === sale.acf.end_date) ? moment(sale.acf.start_date).format('dddd') : (moment(sale.acf.start_date).format('dddd') + ' - ' + moment(sale.acf.end_date).format('dddd'));

            if (sale.acf.start_date === sale.acf.end_date) {
                monthDate = moment(sale.acf.start_date).format('M/D/Y');
            }
            else if (moment(sale.acf.start_date) !== moment(sale.acf.end_date)) {
                monthDate = moment(sale.acf.start_date).format('M/D/Y') + ' - ' + moment(sale.acf.end_date).format('M/D/Y');
            }

            let saleObj =
                <Col
                    xs={12}
                    className="sale-wrapper"
                    startdate={moment(sale.acf.start_date, 'YYYYMMDD')}
                >
                    <div className="sale background-color-setter">
                        <div className="content-wrapper">
                            {monthDate !== 'Invalid date' &&
                            <div className="month-date">{monthDate}</div>
                            }
                            <h2 className="title">
                                {entities.decode(sale.title.rendered)}
                            </h2>
                            {sale.acf.related_store &&
                            <Link className="store-link" to={"/stores/" + sale.acf.related_store.post_name + "/"}>
                                {sale.acf.related_store.post_title}
                            </Link>
                            }
                            {sale.acf.post_copy &&
                            <div className="content" dangerouslySetInnerHTML={{__html: sale.acf.post_copy}}></div>
                            }
                        </div>
                    </div>
                </Col>

            // if the sale is active or upcoming, add to respective sale array
            if (moment().isSameOrBefore(sale.acf.end_date, 'days') || (weekDate === 'Invalid date' && monthDate === 'Invalid date')) {
                saleCount++;
                sales.push(saleObj);
            }

        });

        // Sort alphabetically with empties at the beginning
        sales = sales.sort(function (a, b) {
            if (a.props.startdate === "" || a.props.startdate === null) return 1;
            if (b.props.startdate === "" || b.props.startdate === null) return -1;
            if (a.props.startdate === b.props.startdate) return 0;
            return a.props.startdate < b.props.startdate ? -1 : 1;

        });


        this.setState({
            data: true,
            sales: sales,
            saleCount: saleCount,
        });
    }

    timeFormat = (_time) => {
        let time = _time.replace('am', 'a.m.');
        time = time.replace('pm', 'p.m.');
        return time;
    }

    render() {
        if (this.state.data) {
            console.log(this.state.sales);
            return (
                <Col className="sales" xs={12} sm={8} lg={9}>
                    <div className="subheading" dangerouslySetInnerHTML={{__html: this.props.pageData.content.rendered}}></div>
                    <Row>
                        {this.state.sales}
                    </Row>
                </Col>
            );
        }
        return <Loader/>;
    }
}


export default SalesList;