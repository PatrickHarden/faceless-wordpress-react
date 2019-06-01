// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
let moment = require('moment');

// Components
import SocialScene from '../components/SocialScene';
import StoreFeaturedVideo from '../components/StoreFeaturedVideo';
import Hours from '../components/HoursStores.js';
import Map from '../components/MapplicMap';
import Loader from '../components/Loader.js';

// Endpoints
let SiteURL = 'http://' + document.location.hostname;
let BlogInfo = SiteURL + '/wp-json/ic3/v1/this_site';
let Stores = SiteURL + '/wp-json/wp/v2/stores';
let PropertyOptions = SiteURL + '/wp-json/acf/v2/options/?option_id=property_options';
let Jobs = SiteURL + '/wp-json/wp/v2/jobs?per_page=100';
let Sales = SiteURL + '/wp-json/wp/v2/sales?per_page=100';
let SingleGlobalStore = SiteURL + '/wp-json/ic3/v1/global_store/';


class StoreData extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteName: '',
            city: '',
            state: '',
            storeID: '',
            storeSlug: this.props.storeSlug,
            storeName: this.props.storeName,
            storeLogo: '',
            URL: '',
            image: '',
            copy: '',
            phoneNumber: '',
            location: '',
            printableDirectory: '',
            entrance: '',
            entranceIcon: false,
            restaurantMenu: '',
            facebook: '',
            twitter: '',
            pinterest: '',
            instagram: '',
            videoID: '',
            jobs: '',
            sales: '',
            client: false,
            showSalesModal: false,
            showJobsModal: false,
            showModal: false,
        }
    }

    componentWillMount() {
        let jobs;
        let sales;
        let logo;
        let featuredImage;
        let copy;
        let website;
        let video;
        let FB;
        let TW;
        let PN;
        let IG;
        let siteName = '';
        let city = '';
        let state = '';

        axios.get(BlogInfo)
            .then((response) => {
                siteName = response.data.site;
                city = response.data.city;
                state = response.data.state;

                this.setState({
                    siteName: siteName,
                    city: city,
                    state: state
                });

                $.get(Stores + '?slug=' + this.state.storeSlug, function (data) {
                    data = data[0];
                    var storeID = data.id;

                    axios.get(Jobs)
                        .then(function (response) {
                            var jobData = response.data;
                            var hasJobs = [];
                            jobs = jobData.map(function (job) {
                                var jobStoreID = job.acf.related_store.ID;
                                var jobTitle = job.title.rendered;
                                var jobSlug = job.slug;
                                if (jobStoreID === storeID) {
                                    hasJobs.push(
                                        <h3>
                                            <Link key={jobStoreID} onClick="jQuery('.modal').modal('hide')" to={'/jobs/'+jobSlug}>{entities.decode(jobTitle)}</Link>
                                        </h3>
                                    );
                                }
                            });
                            this.setState({
                                jobs: hasJobs
                            });
                        }.bind(this))
                        .catch(function (err) {
                            console.log(err);
                        });
                    axios.get(Sales)
                        .then((response) => {
                            var saleData = response.data;
                            var hasSales = [];
                            sales = saleData.map(function (sale) {

                                let nodate = false;

                                if(sale.acf.start_date == '' && sale.acf.end_date == ''){
                                    nodate = true;
                                }

                                if(typeof sale.acf.related_store !== 'undefined' && moment().isSameOrBefore(sale.acf.end_date) || nodate){
                                    var saleStoreID = sale.acf.related_store.ID;
                                    var saleTitle = sale.title.rendered;
                                    var saleSlug = sale.slug;
                                    let excerpt;
                                    if (sale.acf.post_copy) {
                                        var regex = /(<([^>]+)>)/ig;
                                        excerpt = entities.decode(sale.acf.post_copy).replace(regex, "").substr(0, 100);
                                        excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ") + "[...]");
                                    }
                                    else {
                                        excerpt = false;
                                    }
                                    if (saleStoreID === storeID) {
                                        hasSales.push(
                                            <div>
                                                <h3>
                                                    <Link key={saleStoreID} onClick="jQuery('.modal').modal('hide')" to={'/sales/'+saleSlug}>{entities.decode(saleTitle)}</Link>
                                                </h3>
                                                <p>{excerpt}</p>
                                            </div>
                                        );
                                    }
                                }
                            });

                            //checks for a global store. If found, apply global settings; local settings take precedent
                            if(data.acf.global_store_selector){
                                axios.get(SingleGlobalStore + data.acf.global_store_selector.selected_posts[0].ID)
                                    .then((store) => {
                                        logo = (store.data.logo_color && data.acf.logo_color ? data.acf.logo_color : store.data.logo_color);
                                        var featuredImage = store.data.featured_image;
                                        if(typeof(featuredImage) == 'object'){
                                            featuredImage = (store.data.featured_image.url && data.acf.featured_image ? data.acf.featured_image : store.data.featured_image.url);
                                        }
                                        else{
                                            featuredImage = (store.data.featured_image && data.acf.featured_image ? data.acf.featured_image : store.data.featured_image);
                                        }
                                        copy = (store.data.store_copy && data.acf.store_copy ? data.acf.store_copy : store.data.store_copy);
                                        website = (store.data.website && data.acf.website ? data.acf.website : store.data.website);
                                        video = (store.data.featured_video && data.acf.featured_video ? data.acf.featured_video : store.data.featured_video);
                                        FB = (store.data.facebook && data.acf.facebook ? data.acf.facebook : store.data.facebook);
                                        TW = (store.data.twitter && data.acf.twitter ? data.acf.twitter : store.data.twitter);
                                        PN = (store.data.pinterest && data.acf.pinterest ? data.acf.pinterest : store.data.pinterest);
                                        IG = (store.data.instagram && data.acf.instagram ? data.acf.instagram : store.data.instagram);

                                        copy = copy.replace('%MALL%', this.state.siteName);
                                        copy = copy.replace('%CITY%', this.state.city);
                                        copy = copy.replace('%STATE%', this.state.state);

                                        this.setState({
                                            data: true,
                                            storeID: data.id,
                                            storeLogo: logo,
                                            URL: website,
                                            image: featuredImage,
                                            copy: copy,
                                            phoneNumber: data.acf.phone_number,
                                            location: data.acf.location,
                                            entrance: data.acf.best_entrance,
                                            restaurantMenu: data.acf.restaurant_menu,
                                            facebook: FB,
                                            twitter: TW,
                                            pinterest: PN,
                                            instagram: IG,
                                            videoID: video,
                                            sales: hasSales,
                                        });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            }
                            else{
                                this.setState({
                                    data: true,
                                    storeID: data.id,
                                    storeLogo: data.acf.logo_color,
                                    URL: data.acf.website,
                                    image: (typeof(data.acf.featured_image) == 'object' ? data.acf.featured_image.url : data.acf.featured_image),
                                    copy: data.acf.store_copy,
                                    phoneNumber: data.acf.phone_number,
                                    location: data.acf.location,
                                    entrance: data.acf.best_entrance,
                                    restaurantMenu: data.acf.restaurant_menu,
                                    facebook: data.acf.facebook,
                                    twitter: data.acf.twitter,
                                    pinterest: data.acf.pinterest,
                                    instagram: data.acf.instagram,
                                    videoID: data.acf.featured_video,
                                    sales: hasSales
                                });
                            }
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }.bind(this));
            })
            .catch((err) => {
                console.log('Error retrieving "this_site" data endpoint.');
                console.log(err);
            });

        $.get(PropertyOptions, function(data){
            this.setState({
                printableDirectory: data.acf.printable_directory,
                entranceIcon: (data.acf.best_entrance_icon ? data.acf.best_entrance_icon : false),
                client: (data.acf.client_group !== '' ? data.acf.client_group.selected_posts[0].post_title : false)
            });
        }.bind(this));
    }

    openSales(){
        this.setState({ showSalesModal: true });
    }

    closeSales(){
        this.setState({ showSalesModal: false });
    }

    openJobs(){
        this.setState({ showJobsModal: true });
    }

    closeJobs(){
        this.setState({ showJobsModal: false });
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    externalLinkChecker(){
        $('a').each(function(){
            var a = new RegExp('/' + window.location.host + '/');
            if(!a.test(this.href)) {
                $(this).attr('target', '_blank');
            }
        });
    }

    render(){
        if(this.state.data){

            return (
                <section className="store-details" >
                    <header className="heading">
                        <Grid>
                            <Row>
                                <Col xs={12} sm={8} smOffset={2} className="page-header">
                                    {this.state.storeLogo ? (
                                        <span>
                                            <img src={this.state.storeLogo} alt={this.state.storeName + " logo"}/>
                                            <h2 className="sr-only sr-only-focusable">{this.state.storeName}</h2>
                                        </span>
                                    ) : (
                                        <h2>{this.state.storeName}</h2>
                                    )}
                                </Col>
                            </Row>
                        </Grid>
                    </header>
                    <Grid>
                        <Row>
                            <Col xs={8} xsOffset={2}>
                                {(this.state.URL) ?
                                    <p><a href={this.state.URL} target="_blank">{this.state.URL.replace('http://', '').replace('https://', '').replace('www.', '')}</a></p> : null}
                                {(this.state.image) ?
                                    <img src={this.state.image} className="img-responsive center-block featured-image" alt="Featured Image"/> : null}
                                <div className="content" dangerouslySetInnerHTML={{ __html: this.state.copy}}></div>
                            </Col>
                        </Row>

                        <Row className="double-cta">
                            <Col xs={12} sm={6} className="col background-color-setter-lighter border-color-setter-lighter" onClick={this.openJobs.bind(this)}>
                                <h2>Jobs</h2>
                            </Col>

                            <Col xs={12} sm={6} className="col background-color-setter-lighter border-color-setter-lighter" onClick={this.openSales.bind(this)}>
                                <h2>Sales & Offers</h2>
                            </Col>
                        </Row>


                        <Modal show={this.state.showSalesModal} onHide={this.closeSales.bind(this)}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {this.state.storeName} - Sales & Offers
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.sales.length > 0 ? this.state.sales.map(function(item) {
                                    return item;
                                }) : "No sales and offers found."}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.closeSales.bind(this)}>Close</Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={this.state.showJobsModal} onHide={this.closeJobs.bind(this)}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {this.state.storeName} - Jobs
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.jobs.length > 0 ? this.state.jobs.map(function(item) {
                                    return item;
                                }) : "No jobs found."}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.closeJobs.bind(this)}>Close</Button>
                            </Modal.Footer>
                        </Modal>


                        <div className="modal fade" id="jobs-modal" tabIndex="-1" role="dialog" aria-labelledby="Jobs">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span></button>
                                        <h4 className="modal-title" id="jobsTitle">{this.state.storeName} - Jobs</h4>
                                    </div>
                                    <div className="modal-body">
                                        {this.state.jobs.length > 0 ? this.state.jobs.map(function(item) {
                                            return item;
                                        }) : "No jobs found."}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Row className="store-info">
                            {this.state.restaurantMenu ? ( // if there is a restaurant menu, print 4 columns, else print 3 columns
                                <div>
                                    <Col xs={12} sm={4}>
                                        {this.state.phoneNumber ? (
                                            <div>
                                                <a href={'tel:' + this.state.phoneNumber} className="font-color-setter">
                                                    <svg id="phone-icon">
                                                        <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                                        <path className="cls-2 background-color-setter"
                                                              d="M63.18,74.78a108.56,108.56,0,0,0,27.91,27.65c3-3,5.88-5.74,8.6-8.6,2.34-2.46,4.83-2.79,7.52-.82,3.62,2.66,7.26,5.3,10.7,8.18,3.93,3.29,4.28,6.5,1.57,11-4.32,7.17-13.46,11.29-21.62,7.9a107.09,107.09,0,0,1-23.62-13.38c-11.74-8.92-21.38-20-27.59-33.64-3.07-6.73-4.49-13.82-.29-20.53A26.72,26.72,0,0,1,54,45c3.21-2.17,6.76-1.64,9.35,1.58,3,3.76,6.24,7.44,8.63,11.58.94,1.63.61,4.89-.46,6.59C69.36,68.25,66.28,71.17,63.18,74.78Z"/>
                                                    </svg>
                                                    <p className="font-color-setter">{this.state.phoneNumber}</p>
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="font-color-setter">
                                                <svg id="phone-icon">
                                                    <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                                    <path className="cls-2 background-color-setter"
                                                          d="M63.18,74.78a108.56,108.56,0,0,0,27.91,27.65c3-3,5.88-5.74,8.6-8.6,2.34-2.46,4.83-2.79,7.52-.82,3.62,2.66,7.26,5.3,10.7,8.18,3.93,3.29,4.28,6.5,1.57,11-4.32,7.17-13.46,11.29-21.62,7.9a107.09,107.09,0,0,1-23.62-13.38c-11.74-8.92-21.38-20-27.59-33.64-3.07-6.73-4.49-13.82-.29-20.53A26.72,26.72,0,0,1,54,45c3.21-2.17,6.76-1.64,9.35,1.58,3,3.76,6.24,7.44,8.63,11.58.94,1.63.61,4.89-.46,6.59C69.36,68.25,66.28,71.17,63.18,74.78Z"/>
                                                </svg>
                                                <p className="font-color-setter">No phone number available</p>
                                            </div>
                                        )
                                        }
                                    </Col>
                                    <Col xs={12} sm={4}>
                                        {this.state.printableDirectory ?
                                            (
                                                <a href={this.state.printableDirectory} target="_blank">
                                                    <svg id="location-icon">
                                                        <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                                        <path className="cls-2 border-color-setter background-color-setter"
                                                              d="M82.7,127.31c-11.58-17.7-23.21-33.95-29.06-53.21-4.57-15.06,5.55-31.42,21-35.41a30.18,30.18,0,0,1,36.75,20.8,27.88,27.88,0,0,1-1.63,19.43c-2.84,6.35-5.65,12.75-9.09,18.78C95.2,107.33,89.19,116.69,82.7,127.31Zm14-59.74A13.83,13.83,0,0,0,82.53,53.44c-8.32,0-14.38,6.18-14.25,14.56a14.22,14.22,0,0,0,28.44-.43Z"/>
                                                    </svg>
                                                    <p className="font-color-setter">Location {this.state.location ? this.state.location : 'No Location Specified'}</p>
                                                </a>
                                            ) : (
                                            <span>
                                                <svg id="location-icon">
                                                    <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                                    <path className="cls-2 border-color-setter background-color-setter"
                                                          d="M82.7,127.31c-11.58-17.7-23.21-33.95-29.06-53.21-4.57-15.06,5.55-31.42,21-35.41a30.18,30.18,0,0,1,36.75,20.8,27.88,27.88,0,0,1-1.63,19.43c-2.84,6.35-5.65,12.75-9.09,18.78C95.2,107.33,89.19,116.69,82.7,127.31Zm14-59.74A13.83,13.83,0,0,0,82.53,53.44c-8.32,0-14.38,6.18-14.25,14.56a14.22,14.22,0,0,0,28.44-.43Z"/>
                                                </svg>
                                                <p className="font-color-setter">{this.state.location ? this.state.location : 'No Location Specified'}</p>
                                            </span>
                                        )
                                        }
                                    </Col>
                                    <Col xs={12} sm={4}>
                                        <svg id="menu-icon">
                                            <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                            <path className="cls-2 background-color-setter"
                                                  d="M88.78,88.83l5.35-5.54a1.69,1.69,0,0,1,1.74-.41,13.1,13.1,0,0,0,4.41.72c6.07,0,13.23-3.53,19.15-9.45,9.31-9.31,12-21.82,5.89-27.88A12,12,0,0,0,116.6,43c-6.25,0-13.41,3.43-19.15,9.17-7.55,7.55-11.06,17-8.72,23.56a1.66,1.66,0,0,1-.41,1.74L82.61,83l-5.15-4.89a3.48,3.48,0,0,1-.91-3.59,14.4,14.4,0,0,0-3.76-14.44L50.44,37.71A1,1,0,0,0,49,39.14L71.36,61.48a12.37,12.37,0,0,1,3.27,12.39,5.51,5.51,0,0,0,1.44,5.67l5.09,4.83-2.65,2.55-4.79-5a5.51,5.51,0,0,0-5.67-1.44,12.37,12.37,0,0,1-12.39-3.27L33.32,54.83a1,1,0,0,0-1.42,1.42L54.24,78.6a14.4,14.4,0,0,0,14.44,3.76,3.48,3.48,0,0,1,3.59.91l4.8,5.05L47.14,117.19a5.14,5.14,0,0,0,3.54,8.87h.07a5.1,5.1,0,0,0,3.66-1.6L83.12,94.7l28.26,29.76a5.1,5.1,0,0,0,3.66,1.6h.07a5.14,5.14,0,0,0,3.54-8.87ZM53,123.07a3.11,3.11,0,0,1-2.23,1h0a3.13,3.13,0,0,1-2.15-5.4L89.71,78.92A3.67,3.67,0,0,0,90.62,75c-2.08-5.82,1.24-14.45,8.25-21.46,5.37-5.37,12-8.58,17.73-8.58a10,10,0,0,1,7.3,2.69c5.28,5.28,2.63,16.51-5.89,25-5.55,5.55-12.17,8.86-17.72,8.86A11.1,11.1,0,0,1,96.55,81a3.63,3.63,0,0,0-1.22-.21,3.7,3.7,0,0,0-2.65,1.12Zm64.37.06a3.13,3.13,0,0,1-4.48-.06L84.52,93.25l2.86-3,29.88,28.37a3.13,3.13,0,0,1,.06,4.48Z"/>
                                            <path className="cls-2 background-color-setter"
                                                  d="M65,66.4A1,1,0,1,0,66.44,65L44.81,43.35a1,1,0,1,0-1.42,1.42Z"/>
                                            <path className="cls-2 background-color-setter"
                                                  d="M59.16,72.25a1,1,0,1,0,1.42-1.42L39,49.2a1,1,0,0,0-1.42,1.42Z"/>
                                        </svg>
                                        <p><a className="font-color-setter" href={this.state.restaurantMenu} target="_blank">Restaurant Menu</a></p>
                                    </Col>
                                </div>
                            ) : (
                                <div>
                                    <Col xs={12} sm={4} smOffset={2}>
                                        {this.state.phoneNumber ? (
                                            <div>
                                                <a className="font-color-setter" href={'tel:' + this.state.phoneNumber}>
                                                    <svg id="phone-icon">
                                                        <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                                        <path className="cls-2 background-color-setter"
                                                              d="M63.18,74.78a108.56,108.56,0,0,0,27.91,27.65c3-3,5.88-5.74,8.6-8.6,2.34-2.46,4.83-2.79,7.52-.82,3.62,2.66,7.26,5.3,10.7,8.18,3.93,3.29,4.28,6.5,1.57,11-4.32,7.17-13.46,11.29-21.62,7.9a107.09,107.09,0,0,1-23.62-13.38c-11.74-8.92-21.38-20-27.59-33.64-3.07-6.73-4.49-13.82-.29-20.53A26.72,26.72,0,0,1,54,45c3.21-2.17,6.76-1.64,9.35,1.58,3,3.76,6.24,7.44,8.63,11.58.94,1.63.61,4.89-.46,6.59C69.36,68.25,66.28,71.17,63.18,74.78Z"/>
                                                    </svg>
                                                    <p className="font-color-setter">{this.state.phoneNumber}</p>
                                                </a>
                                            </div>
                                        ) : (
                                            <p>
                                                <svg id="phone-icon">
                                                    <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                                    <path className="cls-2 background-color-setter"
                                                          d="M63.18,74.78a108.56,108.56,0,0,0,27.91,27.65c3-3,5.88-5.74,8.6-8.6,2.34-2.46,4.83-2.79,7.52-.82,3.62,2.66,7.26,5.3,10.7,8.18,3.93,3.29,4.28,6.5,1.57,11-4.32,7.17-13.46,11.29-21.62,7.9a107.09,107.09,0,0,1-23.62-13.38c-11.74-8.92-21.38-20-27.59-33.64-3.07-6.73-4.49-13.82-.29-20.53A26.72,26.72,0,0,1,54,45c3.21-2.17,6.76-1.64,9.35,1.58,3,3.76,6.24,7.44,8.63,11.58.94,1.63.61,4.89-.46,6.59C69.36,68.25,66.28,71.17,63.18,74.78Z"/>
                                                </svg>
                                                <p className="font-color-setter">No phone number available</p>
                                            </p>
                                        )
                                        }
                                    </Col>
                                    <Col xs={12} sm={4}>
                                        {this.state.printableDirectory ?
                                            (<a href={this.state.printableDirectory} target="_blank">
                                                    <svg id="location-icon">
                                                        <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                                        <path className="cls-2 border-color-setter background-color-setter"
                                                              d="M82.7,127.31c-11.58-17.7-23.21-33.95-29.06-53.21-4.57-15.06,5.55-31.42,21-35.41a30.18,30.18,0,0,1,36.75,20.8,27.88,27.88,0,0,1-1.63,19.43c-2.84,6.35-5.65,12.75-9.09,18.78C95.2,107.33,89.19,116.69,82.7,127.31Zm14-59.74A13.83,13.83,0,0,0,82.53,53.44c-8.32,0-14.38,6.18-14.25,14.56a14.22,14.22,0,0,0,28.44-.43Z"/>
                                                    </svg>
                                                    <p className="font-color-setter">{this.state.location ? this.state.location : 'No Location Specified'}</p>
                                                </a>
                                            ) : (<span>
                                                    <svg id="location-icon">
                                                        <circle className="cls-1 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                                        <path className="cls-2 border-color-setter background-color-setter"
                                                              d="M82.7,127.31c-11.58-17.7-23.21-33.95-29.06-53.21-4.57-15.06,5.55-31.42,21-35.41a30.18,30.18,0,0,1,36.75,20.8,27.88,27.88,0,0,1-1.63,19.43c-2.84,6.35-5.65,12.75-9.09,18.78C95.2,107.33,89.19,116.69,82.7,127.31Zm14-59.74A13.83,13.83,0,0,0,82.53,53.44c-8.32,0-14.38,6.18-14.25,14.56a14.22,14.22,0,0,0,28.44-.43Z"/>
                                                    </svg>
                                                    <p className="font-color-setter">{this.state.location ? this.state.location : 'No Location Specified'}</p>
                                                </span>
                                        )
                                        }
                                    </Col>
                                    <div className="hours-container">
                                        <Hours optionsData={this.props.storeData.acf.custom_hours ? this.props.storeData : this.props.optionsData} isStore={true} flags={this.props.storeData.acf.flags} />
                                    </div>
                                    {this.props.optionsData.acf.enable_interactive_map &&
                                        <div>
                                        {this.props.storeData.acf.enable_interactive_map &&
                                            <Map landmarkID={this.props.storeData.acf.map_landmark_id} />
                                        }
                                        </div>
                                    }
                                    <SocialScene fb={this.state.facebook} tw={this.state.twitter} ig={this.state.instagram} pn={this.state.pinterest} />
                                    <StoreFeaturedVideo videoID={this.state.videoID} />
                                </div>
                            )}
                        </Row>
                    </Grid>
                </section>
            );
        }
        return <Loader />;
    }
}


export default StoreData;