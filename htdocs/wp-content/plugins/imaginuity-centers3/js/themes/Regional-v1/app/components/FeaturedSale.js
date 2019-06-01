// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import moment from 'moment';

// Components

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Sales = SiteURL + '/wp-json/wp/v2/sales/';

class FeaturedSale extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            sale: this.props.saleData,
            featuredSale: '',
        }
    }

    componentWillMount() {

        const component = this;

        console.log(this.props.saleData.acf.featured_sale_type);

        if (this.props.saleData.acf.featured_sale_type === 'sale') {
            axios.all([
                axios.get(Sales + this.props.saleData.acf.featured_sale.ID),
            ])
                .then(axios.spread(function (sale) {

                    component.setState({
                        data: true,
                        featuredSale: sale.data,
                    });
                }))
                .catch((err) => {
                    console.log(err);
                })
        }
        else if (this.props.saleData.acf.featured_sale_type === 'page') {
            component.setState({
                data: true,
            });
        }


    }

    render() {

        if (this.state.data) {
            if (this.props.saleData.acf.featured_sale_type === 'sale') {
                let sale = this.state.featuredSale;

                let excerpt;
                if (sale.acf.post_copy) {
                    let regex = /(<([^>]+)>)/ig;
                    excerpt = entities.decode(sale.acf.post_copy).replace(regex, "").substr(0, 200);
                    excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
                }
                else {
                    excerpt = false;
                }

                let dateRangeCheck = (sale.acf.start_date === sale.acf.end_date);

                let startWeekday = (sale.acf.start_date ? moment(sale.acf.start_date).format('dddd') : '');
                let endWeekday = (sale.acf.end_date ? moment(sale.acf.end_date).format('dddd') : '');
                let singleStartMonth = (sale.acf.start_date ? moment(sale.acf.start_date).format('MMM. DD') : '');
                let rangeStartDate = (sale.acf.start_date ? moment(sale.acf.start_date).format('MM/DD') : '');
                let rangeEndDate = (sale.acf.end_date ? moment(sale.acf.end_date).format('MM/DD') : '');

                return (
                    <div className="featured-sale-single background-color-setter">
                        <div className="img-container">
                            <img src={this.state.sale.acf.featured_sale_image.url}
                                 alt={(this.state.sale.acf.featured_sale_image.alt ? this.state.sale.acf.featured_sale_image.alt : 'featured image')}/>
                        </div>
                        <div className="copy-container">
                            <div className="title-container">
                                {this.state.featuredSale.acf.related_store &&
                                <h4>
                                    <Link to={"/stores/" + this.state.featuredSale.acf.related_store.post_name + "/"}
                                          key={this.state.featuredSale.acf.related_store.ID}>
                                        {entities.decode(this.state.featuredSale.acf.related_store.post_title)}
                                    </Link>
                                </h4>
                                }
                                <h2><Link to={"/sales/" + this.state.featuredSale.slug + "/"}
                                          key={this.state.featuredSale.id}>{entities.decode(this.state.sale.acf.featured_sale.post_title)}</Link>
                                </h2>
                            </div>
                            <div className="date-container">
                                {dateRangeCheck ? (
                                    <div className="date">
                                        {startWeekday ? <h4>{startWeekday}</h4> : ''}
                                        {singleStartMonth ? <h4>{singleStartMonth}</h4> : ''}
                                    </div>
                                ) : (
                                    <div className="date date-range clearfix">
                                        <div className="start">
                                            {startWeekday ? <h4>{startWeekday}</h4> : ''}
                                            {rangeStartDate ? <h4>{rangeStartDate}</h4> : ''}
                                        </div>
                                        <div className="range-hyphen">
                                            <h4>-</h4>
                                        </div>
                                        <div className="end">
                                            {endWeekday ? <h4>{endWeekday}</h4> : ''}
                                            {rangeEndDate ? <h4>{rangeEndDate}</h4> : ''}
                                        </div>
                                    </div>
                                )}
                                <br/>
                            </div>
                            <p>{excerpt}<Link to={"/sales/" + this.state.featuredSale.slug}
                                              alt="navigate to interior page for the featured sale">Read More</Link></p>
                        </div>
                        <span className="clearfix"/>
                    </div>
                )
            }
            else if (this.props.saleData.acf.featured_sale_type === 'page') {
                return (
                    <div className="featured-sale-single background-color-setter">
                        <div className="img-container">
                            <Link to={this.props.saleData.acf.page_link}>
                                <img src={this.state.sale.acf.featured_sale_image.url}
                                     alt={(this.state.sale.acf.featured_sale_image.alt ? this.state.sale.acf.featured_sale_image.alt : 'featured image')}/>
                            </Link>
                        </div>
                        <div className="copy-container">
                            <div className="title-container">
                                <h2><Link to={this.props.saleData.acf.page_link}>Deal of the Day</Link></h2>
                            </div>
                            <p>{this.props.saleData.acf.page_copy}</p>
                        </div>
                        <div className="button-container">
                            <Link to={this.props.saleData.acf.page_link} className="btn background-color-setter">Click
                                for Details</Link>
                        </div>
                        <span className="clearfix"/>
                    </div>
                )
            }
            return null;
        }
        return null;
    }
}

export default FeaturedSale;