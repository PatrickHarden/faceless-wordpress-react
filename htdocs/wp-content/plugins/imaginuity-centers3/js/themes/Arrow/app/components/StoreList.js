// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
let moment = require('moment');
let momentRange = require('moment-range/dist/moment-range.js');
moment = momentRange.extendMoment(moment);

// Components
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const StoresData = SiteURL + '/wp-json/wp/v2/stores?per_page=100';
const StoreCategories = SiteURL + '/wp-json/wp/v2/imag_taxonomy_store_category?per_page=100';
const Sales = SiteURL + '/wp-json/wp/v2/sales?per_page=100';
const Pages = SiteURL + '/wp-json/wp/v2/pages';

// Constants
const _special = '#SPECIAL#';

class Stores extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            error: false,
            stores: '',
            events: false,
            pageData: ''
        }
    }

    componentWillMount(){
        let component = this;
        let data = [];

        axios.all([
            axios.get(StoresData),
            axios.get(Sales),
            axios.get(Pages + '?slug=directory'),
            axios.get(StoreCategories),
        ])
            .then(axios.spread(function(storeData, sales, pageData, storeCategories){
                let storeQueries = [];
                if(storeData.headers['x-wp-totalpages'] > 1){
                    let paginationCount = storeData.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        storeQueries.push(axios.get(StoresData + '&page=' + x));
                        x++;
                    }
                    axios.all(storeQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.handleDataResponse(data, sales, pageData, storeCategories);
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                            component.setState({
                                error: true,
                            })
                        })
                }
                else{
                    component.handleDataResponse(storeData.data, sales, pageData, storeCategories);
                }
            }))
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });
    }
    
    handleDataResponse(storeData, sales, pageData, storeCategories){
        this.setState({
            pageData: pageData.data[0],
            storeCategories: this.buildStoreCategories(storeCategories.data),
            storeCategoryIDs: this.getStoreCategoryIDs(storeCategories.data),
            stores: this.buildStores(storeData, this.props.optionsData),
            data: true,
        });
    }

    buildStoreCategories(storeCategories){
        let categories = storeCategories.map((category) => {
            return(<option key={category.id} value={category.id}>{entities.decode(category.name)}</option>)
        });
        return categories;
    }

    getStoreCategoryIDs(storeCategories){
        let catIDs = storeCategories.map((category) => {
            return(category.id);
        });
        return catIDs;
    }

    buildStores(storeData, optionsData){
        let component = this;
        let sortedStores = storeData.sort(function(a, b){
            let itemA = entities.decode(a.title.rendered.toUpperCase());
            let itemB = entities.decode(b.title.rendered.toUpperCase());
            return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
        });
        let stores = sortedStores.map((store, i) =>  {
            let hoursString;
            let customHours = store.acf.custom_hours;
            let alternateHours = store.acf.alternate_hours;
            let today = moment().format('dddd').toLowerCase();

            // Does this store use custom hours?
            if(customHours){
                // Is this store currently using alternate hours?
                if(alternateHours){
                    // Loop through each set of alternate hours
                    $.each(store.acf.alternate_hours, function(){
                        moment.createFromInputFallback = function(config) {
                            // unreliable string magic, or
                            config._d = new Date(config._i);
                        };
                        let rangeToday = moment();
                        let startDate = this.start_date;
                        let endDate = this.end_date;
                        let range = moment.range(startDate, endDate);
                        // determine if today falls within the date range. This only allows for 1 range to be active (last one will apply)
                        if(range.contains(rangeToday)){
                            // Is the 'closed' box checked
                            if(store.acf.alternate_hours[0][today + '_closed']){
                                // if closed is checked, set the hours string to 'Closed'
                                hoursString = 'Closed';
                            }
                            else{
                                if(store.acf.alternate_hours[0][today + '_open'] !== '' && store.acf.alternate_hours[0][today + '_close'] !== ''){
                                    // if the closed box is not checked, set the hours string to the open/close times
                                    hoursString = store.acf.alternate_hours[0][today + '_open'] + ' - ' + store.acf.alternate_hours[0][today + '_close'];
                                }
                            }
                        }
                        else{ // if the range of the alternate hours does not contain today, use the standard hours
                            if(store.acf.standard_hours[0][today + '_closed']){
                                // if closed is checked, set the hours string to 'Closed'
                                hoursString = 'Closed';
                            }
                            else{
                                if(store.acf.standard_hours[0][today + '_open'] !== '' && store.acf.standard_hours[0][today + '_close'] !== ''){
                                    // if the closed box is not checked, set the hours string to the open/close times
                                    hoursString = store.acf.standard_hours[0][today + '_open'] + ' - ' + store.acf.standard_hours[0][today + '_close'];
                                }
                                else if(store.acf.standard_hours[0][today + '_open'] === '' && store.acf.standard_hours[0][today + '_close'] === '' && store.acf.standard_hours[0].special_instructions !== ''){
                                    hoursString = _special;
                                }
                                else{
                                    hoursString = 'Contact Retailer for hours'
                                }
                            }
                        }
                    });
                }
                // if the store is NOT using alternate hours, check the standar hours
                else{
                    if(store.acf.standard_hours[0][today + '_closed']){
                        // if closed is checked, set the hours string to 'Closed'
                        hoursString = 'Closed';
                    }
                    else{
                        if(store.acf.standard_hours[0][today + '_open'] !== '' && store.acf.standard_hours[0][today + '_close'] !== ''){
                            // if the closed box is not checked, set the hours string to the open/close times
                            hoursString = store.acf.standard_hours[0][today + '_open'] + ' - ' + store.acf.standard_hours[0][today + '_close'];
                        }
                        else if(store.acf.standard_hours[0][today + '_open'] === '' && store.acf.standard_hours[0][today + '_close'] === '' && store.acf.standard_hours[0].special_instructions !== ''){
                            hoursString = _special;
                        }
                        else{
                            hoursString = 'Contact Retailer for hours'
                        }
                    }
                }
            }
            else{
                if(hoursString = optionsData.acf.standard_hours[0][today + '_closed']){
                    hoursString = "Closed";
                }else{
                    hoursString = optionsData.acf.standard_hours[0][today + '_open'] + " - " + optionsData.acf.standard_hours[0][today + '_close'];
                }
            }

            if(hoursString === _special){
                hoursString = store.acf.standard_hours[0].special_instructions;
            } else {
                hoursString = "Today's Hours: " + hoursString;
            }

            if(store.acf.flags && (store.acf.flags.indexOf('Coming Soon') > -1)){
                hoursString = "Coming Soon";
            }

            return(
                <Col xs={12} md={6} lg={4} className="store" data-category={store.imag_taxonomy_store_category ? '[' + store.imag_taxonomy_store_category + ']' : 0} key={i}>
                    <h4><Link to={'/stores/' + store.slug + '/'} >{entities.decode(store.title.rendered)}</Link></h4>
                    <div className="info">
                        <p>{hoursString}</p>
                        <p className="contact font-color-setter visible-sm visible-xs">
                            <a href={"https://maps.google.com?saddr=Current+Location&daddr=" + "+" + this.props.optionsData.acf.address_1 + "+" + this.props.optionsData.acf.address_2 + "+" + this.props.optionsData.acf.city + "+" + this.props.optionsData.acf.state + "+" + entities.decode(store.title.rendered)} target="_blank">Get Directions</a>
                            <span>{store.acf.phone_number ? <a title="phone number" href={"tel:" + store.acf.phone_number}>{store.acf.phone_number}</a> : ''}</span>
                        </p>
                        <p className="contact font-color-setter hidden-sm hidden-xs">
                            {store.acf.phone_number ? <a title="phone number" href={"tel:" + store.acf.phone_number}>{store.acf.phone_number}</a> : <span className="sr-only">no phone number</span> }
                        </p>
                    </div>
                    <div className="plus" onClick={component.toggleStore.bind(component)} ></div>
                </Col>
            );
        });
        return stores
    }

    categoryFilter(e){
        e.preventDefault();

        let filterVal = e.target.value === 'all' ? 'all' : parseInt(e.target.value);

        if (filterVal !== 'all') {
            $('.store').hide().addClass('filtered');

            $('.store').each(function(i){
                let storeCategories = $(this).data('category');

                if(storeCategories.indexOf(filterVal) > -1){
                    $(this).fadeIn('slow').removeClass('filtered');
                }
            });
        } else {
            $('.store').hide().fadeIn('slow').removeClass('filtered');
        }

        let filterCount = 0;
        $('.store:not(.filtered)').each(function(){
            filterCount ++;
        });
        if(filterCount == 0){
            $('.no-results').removeClass('hidden');
        }
        else{
            if(!$('.no-results').hasClass('hidden')) {
                $('.no-results').addClass('hidden')
            }
        }
        this.setState({ catFilterVal: filterVal });
    }

    toggleStore(e){
        $(e.currentTarget).toggleClass('open');
        $(e.currentTarget).siblings('.info').toggleClass('open');
    }

    render(){
        if(this.state.data){

            const printableDirectory = (
                <Tooltip id="tooltip">Printable Directory</Tooltip>
            );

            const interactiveMap = (
                <Tooltip id="tooltip">Interactive Map</Tooltip>
            );

            return (
                <Grid className="stores">
                    <Row>
                        <Col xs={12} className="filter-container">
                            <div className="filter-label">
                                {this.props.optionsData.acf.printable_directory &&
                                <div className="icon-container">
                                    <OverlayTrigger placement="top" overlay={printableDirectory}>
                                        <a href={this.props.optionsData.acf.printable_directory} className="print" title="printable directory" target="_blank">
                                            <span className="sr-only">Printable Directory</span>
                                            <svg alt="printable directory map">
                                                <title>Printable Directory</title>
                                                <path className="cls-1 border-color-setter" d="M37.32,25h2"/>
                                                <path className="cls-1 border-color-setter" d="M34.05,25h2"/>
                                                <path className="cls-1 border-color-setter" d="M30.78,25h2"/>
                                                <path className="cls-1 border-color-setter" d="M40,40.78h3.43A2.56,2.56,0,0,0,46,38.23h0V20.29a2.56,2.56,0,0,0-2.56-2.56H39.67m-21.87,0H14.12a2.56,2.56,0,0,0-2.56,2.56h0V38.23a2.56,2.56,0,0,0,2.56,2.56h3.54"/>
                                                <path className="cls-1 border-color-setter" d="M17.69,30V47.75H39.87V30Z"/>
                                                <path className="cls-1 border-color-setter" d="M17.69,9.56V20.77H39.87V9.56Z"/>
                                                <line className="cls-1 border-color-setter" x1="21.89" y1="34.67" x2="34.97" y2="34.67"/>
                                                <line className="cls-1 border-color-setter" x1="21.89" y1="38.76" x2="34.97" y2="38.76"/>
                                                <line className="cls-1 border-color-setter" x1="21.89" y1="42.85" x2="30.06" y2="42.85"/>
                                            </svg>
                                        </a>
                                    </OverlayTrigger>

                                </div>
                                }
                                {this.props.optionsData.acf.enable_interactive_map &&
                                <div className="icon-container">
                                    <OverlayTrigger placement="top" overlay={interactiveMap}>
                                        <a href={'/interactive-map'} className="map" title="interactive map">
                                            <span className="sr-only">Interactive Map</span>
                                            <svg alt="interactive map icon">
                                                <title>Interactive Map</title>
                                                <path className="cls-1 border-color-setter" d="M31.28,5.6a5.16,5.16,0,0,0-5.16,5.16c0,2.84,4.87,10.8,5.16,10.8s5.16-8,5.16-10.8A5.16,5.16,0,0,0,31.28,5.6Zm0,7.17a2,2,0,1,1,2-2,2,2,0,0,1-2,2Z"/>
                                                <path className="cls-1 border-color-setter" d="M29.61,37.25A38.92,38.92,0,0,0,30,29.33c-.08-1.11-.69-2-1.64-2a1.3,1.3,0,0,0-.92.38h0a2,2,0,0,0-3-1.67,2,2,0,0,0-3.08-1.4V20a1.73,1.73,0,0,0-3.45,0V31.79a13.75,13.75,0,0,0-1.15-1.5c-.86-.86-2.36-1.5-3.3-1-.75.45-.32,1.33.25,2.34.9,1.6,1.43,4.47,2.51,6A6.13,6.13,0,0,0,17.9,39.3a7.89,7.89,0,0,0,.57,1,.63.63,0,0,0,0,.13v4.29a.8.8,0,0,0,.5.75,17,17,0,0,0,9.46,0,.64.64,0,0,0,.41-.71c-.23-1.35-.45-2.76-.68-4.22C28.74,40.22,29.16,39.18,29.61,37.25Z"/>
                                                <polyline className="cls-1 border-color-setter" points="28.41 40.58 39.18 38.62 39.18 13.22 35.57 13.88"/>
                                                <polyline className="cls-1 border-color-setter" points="27.49 15.02 17.62 13.22 6.83 15.19 6.83 40.58 17.62 38.62"/>
                                            </svg>
                                        </a>
                                    </OverlayTrigger>
                                </div>
                                }
                            </div>
                            <label className="category-filter">
                                <span>Filter by Store Type:</span>
                                <select value={this.state.catFilterVal} onChange={this.categoryFilter.bind(this)}>
                                    <option value="all">All</option>
                                    {this.state.storeCategories}
                                </select>
                            </label>
                        </Col>
                        {this.state.stores}
                        <Col xs={12} className="no-results hidden">
                            <h3 className="text-center"><i>No results available</i></h3>
                        </Col>
                    </Row>
                </Grid>
            );
        }
        else if(this.state.error){
            return(
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2>An error occurred retrieving the Stores.</h2>
                            <p>Please refresh the page and try again. If this error continues, please <Link to={'/contact-us/'}>contact us</Link> and report the issue.</p>
                            <br/>
                        </Col>
                    </Row>
                </Grid>
            )
        }
        return <Loader />;
    }
}

export default Stores;