// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import MonthFilter from '../components/MonthFilter';
import DropdownFilter from '../components/DropdownFilter';
import Masonry from 'react-masonry-component';
import Loader from '../components/Loader';

let masonryOptions = {
    transitionDuration: 200,
    horizontalOrder: true,
};

class SalesList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            sales: '',
            relatedStores: '',
            saleCount: 0,
        };
    }

    componentWillMount(){
        let saleCount = 0;

        let relatedStores = [];
        let relatedStoresFiltered = [];

        let sales = this.props.salesData.map((sale, i) => {

            let excerpt;
            if (sale.acf.post_copy) {
                var regex = /(<([^>]+)>)/ig;
                excerpt = entities.decode(sale.acf.post_copy).replace(regex, "").substr(0, 200);
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ");
            }
            else {
                excerpt = false;
            }

            let nodate = false;

            if(sale.acf.start_date == '' && sale.acf.end_date == ''){
                nodate = true;
            }

            let dateRangeCheck = (sale.acf.start_date == sale.acf.end_date);
            let startWeekday = (sale.acf.start_date ? moment(sale.acf.start_date).format('dddd') : '');
            let endWeekday = (sale.acf.end_date ? moment(sale.acf.end_date).format('dddd') : '');
            let singleStartMonth = (sale.acf.start_date ? moment(sale.acf.start_date).format('MMM. DD') : '');
            let rangeStartDate = (sale.acf.start_date ? moment(sale.acf.start_date).format('MM/DD') : '');
            let rangeEndDate = (sale.acf.end_date ? moment(sale.acf.end_date).format('MM/DD') : '');

            if(moment().diff(sale.acf.end_date, 'days') <= 0 || nodate ){
                saleCount++;
                if(sale.acf.related_store){
                    relatedStores.push(entities.decode(sale.acf.related_store.post_title));
                }
                return(
                    <div className="sale filter-item" data-startMonth={moment(sale.acf.start_date).format('M')} data-endMonth={moment(sale.acf.end_date).format('M')} data-store={entities.decode(sale.acf.related_store.post_title)} key={i}>
                        {sale.acf.featured_image &&
                            <img src={entities.decode(sale.acf.featured_image)} alt={entities.decode(sale.title.rendered)} />
                        }
                        {!nodate &&
                        <div className="date-container background-color-setter">
                            {dateRangeCheck ? (
                                <div className="date">
                                    <h4>{startWeekday}</h4>
                                    <h4>{singleStartMonth}</h4>
                                </div>
                            ) : (
                                <div className="date date-range clearfix">
                                    <div className="start">
                                        <h4>{startWeekday}</h4>
                                        <h4>{rangeStartDate}</h4>
                                    </div>
                                    <div className="range-hyphen">
                                        <h4>-</h4>
                                    </div>
                                    <div className="end">
                                        <h4>{endWeekday}</h4>
                                        <h4>{rangeEndDate}</h4>
                                    </div>
                                </div>
                            )}
                        </div>
                        }
                        <div className="copy-container font-color-setter background-color-setter-lightest">
                            <h4><Link to={"/sales/"+sale.slug} key={sale.id} >{entities.decode(sale.title.rendered)}</Link></h4>
                            {sale.acf.related_store &&
                            <Link className="store-link" key={sale.acf.related_store.ID} to={'/stores/'+sale.acf.related_store.post_name} storeID={sale.acf.related_store.post_name}>
                                {entities.decode(sale.acf.related_store.post_title)}
                            </Link>
                            }
                            {excerpt &&
                            <p>{excerpt} <Link to={"/sales/"+sale.slug} key={sale.id} >[...]</Link></p>
                            }
                        </div>
                    </div>
                );
            }
        });

        relatedStoresFiltered = relatedStores.filter( function( item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
        });

        this.setState({
            data: true,
            sales: sales,
            relatedStores: relatedStoresFiltered,
            saleCount: saleCount,
        });
    }

    setMonthFilter(e){
        if($(e.currentTarget).hasClass('active')){
            $(e.currentTarget).removeClass('active');
            $('.filter-item').removeClass('hidden');
        }
        else{
            $('.month-filter.active').removeClass('active');
            $(e.currentTarget).addClass('active');
            let filterMonth = $(e.currentTarget).data('month');
            $('.filter-item').addClass('hidden');
            $('.filter-item').each(function(){
                if($(this).data('startmonth') == filterMonth || $(this).data('endmonth') == filterMonth){
                    $(this).removeClass('hidden');
                }
            });
        }
        this.masonry.layout();
    }

    dropdownFilter(){
        $('.month-filter.active').removeClass('active');
        $('.filter-item').addClass('hidden');
        let filterValue = $('#stores-filter').val();
        if(filterValue == 'all'){
            $('.filter-item').removeClass('hidden');
        }
        else{
            $('.filter-item').each(function(){
                if($(this).data('store') == filterValue){
                    $(this).removeClass('hidden');
                }
            });
        }
        this.masonry.layout();
    }

    render(){
        if(this.state.data){
            if(this.state.saleCount > 0){
                return(
                    <div className="sales-data">
                        <MonthFilter filter={this.setMonthFilter.bind(this)} />
                        <DropdownFilter
                            filterType="stores"
                            filterItems={this.state.relatedStores}
                            filter={this.dropdownFilter.bind(this)}
                            label="Retailer"
                        />
                        <Masonry
                            className={"sales"}
                            options={masonryOptions}
                            ref={c => this.masonry = c}
                        >
                            {this.state.sales}
                        </Masonry>
                    </div>
                );
            }
            else{
                return(
                    <div className="sales-data">
                        <Grid>
                            <Row>
                                <Col xs={12}>
                                    <h2 style={{margin: '50px 0'}}>There are currently no sales available</h2>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                );

            }

        }
        return <Loader />;
    }
}


export default SalesList;
