// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from './Loader';
import MallSchema from '../components/schema/MallScheme';
import Helmet from 'react-helmet';
import Slider from 'react-slick';
import LocationHours from './LocationHours';
import Signup from './Signup';
import FeaturedEvents from './FeaturedEventsHome';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const StoresData = SiteURL + '/wp-json/wp/v2/stores?per_page=100';
const StoreCategories = SiteURL + '/wp-json/wp/v2/imag_taxonomy_store_category?per_page=100';

class HomeData extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            error: false,
            optionsData: '',
            homeData: '',
            siteName: '',
            siteAddress: '',
            metaDescription: '',
            enableSlider: false,
            slides: false,
            slideCount: 0,
            hours: [],
            address1: '',
            address2: '',
            address3: '',
            phone: '',
            storeCategories: '',
            storeCategoryIDs: '',
            stores: '',
            storeCount: 0,
            enableSignup: false,
            signupTitle: '',
            signupSubtitle: '',
            signupButton: '',
            signupLink: '',
            facebook: '',
            twitter: '',
            instagram: '',
            enableCTAs: false,
            tripleCTAs: '',
            enableCoupons: false,
            couponTitle: '',
            couponSubtitle: '',
            couponButtonText: '',
            couponButtonURL: '',
            couponBackgroundImage: '',
            enableFeaturedEvents: false,
            featuredEvents: '',
        }
    }

    componentWillMount(){

        const component = this;
        let storeData = [];

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
            axios.get(StoresData),
            axios.get(StoreCategories),

        ])
            .then(axios.spread(function (site, home, options, stores, storeCategories, sales) {
                let storeQueries = [];
                if(stores.headers['x-wp-totalpages'] > 1){
                    console.log('multipage');
                    let paginationCount = stores.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        storeQueries.push(axios.get(StoresData + '&page=' + x));
                        x++;
                    }
                    axios.all(storeQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                storeData = storeData.concat(responsePage.data);
                            })

                            component.setState({
                                data: true,
                                siteName: site.data.name,
                                homeData: home.data[0],
                                siteAddress: options.data.acf.city + ', ' + options.data.acf.state,
                                metaDescription: options.data.acf.meta_description,
                                enableSlider: home.data[0].acf.enable_home_slider,
                                address1: options.data.acf.address_1,
                                address2: options.data.acf.address_2,
                                address3: options.data.acf.city + ', ' + options.data.acf.state + ' ' + options.data.acf.zip,
                                phone: options.data.acf.phone,
                                slides: component.buildSlides(home.data[0].acf.image_slider),
                                slideCount: home.data[0].acf.image_slider.length,
                                optionsData: options.data,
                                storeCategories: component.buildStoreCategories(storeCategories.data),
                                storeCategoryIDs: component.getStoreCategoryIDs(storeCategories.data),
                                catFilterVal: 'all',
                                stores: component.buildStores(storeData, sales.data),
                                enableSignup: home.data[0].acf.enable_mail_signup,
                                signupTitle: home.data[0].acf.signup_title ? home.data[0].acf.signup_title : 'Get Connected. Stay Connected',
                                signupSubtitle: home.data[0].acf.signup_subtitle ? home.data[0].acf.signup_subtitle : 'Join our mailing list and receive the latest news, sales and special events',
                                signupButton: home.data[0].acf.signup_button_text ? home.data[0].acf.signup_button_text : 'Sign Me Up',
                                signupLink: home.data[0].acf.signup_button_link,
                                signupBackgroundImage: home.data[0].acf.signup_background_image ? "url(" + home.data[0].acf.signup_background_image.url + ")" : '',
                                facebook: options.data.acf.facebook_url ? options.data.acf.facebook_url : false,
                                twitter: options.data.acf.twitter_url ? options.data.acf.twitter_url : false,
                                instagram: options.data.acf.instagram_url ? options.data.acf.instagram_url : false,
                                enableCTAs: home.data[0].acf.enable_triple_cta ? home.data[0].acf.enable_triple_cta : false,
                                tripleCTAs: component.buildTripleCTA(home.data[0].acf.triple_ctas),
                                enableCoupons: home.data[0].acf.enable_coupons ? home.data[0].acf.enable_coupons : false,
                                couponTitle: home.data[0].acf.coupon_title ? home.data[0].acf.coupon_title : 'A Little Can Go A Long Way.',
                                couponSubtitle: home.data[0].acf.coupon_text ? home.data[0].acf.coupon_text : 'The latest store coupons and savings are one click away.',
                                couponButtonText: home.data[0].acf.button_text ? home.data[0].acf.button_text : 'View Coupons',
                                couponButtonURL: home.data[0].acf.button_url ? home.data[0].acf.button_url : '/coupons',
                                couponBackgroundImage: home.data[0].acf.coupons_background_image ? home.data[0].acf.coupons_background_image.url : require('../../lib/img/home-coupons.jpg'),
                                enableFeaturedEvents: home.data[0].acf.enable_featured_events,
                                featuredEvents: home.data[0].acf.enable_featured_events ? component.buildFeaturedEvents(home.data[0].acf.event_selector, home.data[0].acf.enable_featured_events) : '',
                            });
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                            component.setStat({
                                error: true,
                            })
                        })
                }
                else{
                    storeData = stores.data;

                    component.setState({
                        data: true,
                        siteName: site.data.name,
                        homeData: home.data[0],
                        siteAddress: options.data.acf.city + ', ' + options.data.acf.state,
                        metaDescription: options.data.acf.meta_description,
                        enableSlider: home.data[0].acf.enable_home_slider,
                        address1: options.data.acf.address_1,
                        address2: options.data.acf.address_2,
                        address3: options.data.acf.city + ', ' + options.data.acf.state + ' ' + options.data.acf.zip,
                        phone: options.data.acf.phone,
                        slides: component.buildSlides(home.data[0].acf.image_slider),
                        slideCount: home.data[0].acf.image_slider.length,
                        optionsData: options.data,
                        storeCategories: component.buildStoreCategories(storeCategories.data),
                        storeCategoryIDs: component.getStoreCategoryIDs(storeCategories.data),
                        catFilterVal: 'all',
                        stores: component.buildStores(storeData),
                        enableSignup: home.data[0].acf.enable_mail_signup,
                        signupTitle: home.data[0].acf.signup_title ? home.data[0].acf.signup_title : 'Get Connected. Stay Connected',
                        signupSubtitle: home.data[0].acf.signup_subtitle ? home.data[0].acf.signup_subtitle : 'Join our mailing list and receive the latest news, sales and special events',
                        signupButton: home.data[0].acf.signup_button_text ? home.data[0].acf.signup_button_text : 'Sign Me Up',
                        signupLink: home.data[0].acf.signup_button_link,
                        signupBackgroundImage: home.data[0].acf.signup_background_image ? "url(" + home.data[0].acf.signup_background_image.url + ")" : '',
                        facebook: options.data.acf.facebook_url ? options.data.acf.facebook_url : false,
                        twitter: options.data.acf.twitter_url ? options.data.acf.twitter_url : false,
                        instagram: options.data.acf.instagram_url ? options.data.acf.instagram_url : false,
                        enableCTAs: home.data[0].acf.enable_triple_cta ? home.data[0].acf.enable_triple_cta : false,
                        tripleCTAs: component.buildTripleCTA(home.data[0].acf.triple_ctas),
                        enableCoupons: home.data[0].acf.enable_coupons ? home.data[0].acf.enable_coupons : false,
                        couponTitle: home.data[0].acf.coupon_title ? home.data[0].acf.coupon_title : 'A Little Can Go A Long Way.',
                        couponSubtitle: home.data[0].acf.coupon_text ? home.data[0].acf.coupon_text : 'The latest store coupons and savings are one click away.',
                        couponButtonText: home.data[0].acf.button_text ? home.data[0].acf.button_text : 'View Coupons',
                        couponButtonURL: home.data[0].acf.button_url ? home.data[0].acf.button_url : '/coupons',
                        couponBackgroundImage: home.data[0].acf.coupons_background_image ? home.data[0].acf.coupons_background_image.url : require('../../lib/img/home-coupons.jpg'),
                        enableFeaturedEvents: home.data[0].acf.enable_featured_events,
                        featuredEvents: home.data[0].acf.enable_featured_events ? component.buildFeaturedEvents(home.data[0].acf.event_selector, home.data[0].acf.enable_featured_events) : '',
                    });
                }
            }))
            .catch((err) => {
                console.log(err);
                component.setStat({
                    error: true,
                })
            })
    }

    externalLinkChecker = (link) => {
        let a = new RegExp('/' + window.location.host + '/');
        if(!a.test(link)) {
            return '_blank'
        }
    }

    buildSlides(slideData) {
        let slides = slideData.map((slide, i) => {
            return(
                <div className={"slide" + ' ' + slide.image_background_type + ' ' + slide.title_alignment} key={i}>
                    {slide.slide_link ? (
                        <Link to={slide.slide_link + "/"} target={this.externalLinkChecker(slide.slide_link)}>
                            {slide.title ? <h2>{slide.title}</h2> : ''}
                            <img src={slide.image.url} alt={slide.image.alt} />
                        </Link>
                    ) : (
                        <div>
                            {slide.title ? <h2>{slide.title}</h2> : ''}
                            <img src={slide.image.url} alt={slide.image.alt} />
                        </div>
                    )}

                </div>
            );
        });
        return slides;
    }
    
    buildHours(hoursData){

        let today;
        let range;
        let hours_label;
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
        let mondayString;
        let tuesdayString;
        let wednesdayString;
        let thursdayString;
        let fridayString;
        let saturdayString;
        let sundayString;

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
                    hours_label = this.alternate_hours_label;
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

        dateString = (moment(startDate).format('MMM') == moment(endDate).format('MMM') ? moment(startDate).format('MMM D') + ' - ' + moment(endDate).format('D') : moment(startDate).format('MMM D') + ' - ' + moment(endDate).format('MMM D') );
        mondayString = 'Mon ' + (monday_closed ? 'Closed' : monday_open + ' - ' + monday_close);
        tuesdayString = 'Tue ' + (tuesday_closed ? 'Closed' : tuesday_open + ' - ' + tuesday_close);
        wednesdayString = 'Wed ' + (wednesday_closed ? 'Closed' : wednesday_open + ' - ' + wednesday_close);
        thursdayString = 'Thu ' + (thursday_closed ? 'Closed' : thursday_open + ' - ' + thursday_close);
        fridayString = 'Fri ' + (friday_closed ? 'Closed' : friday_open + ' - ' + friday_close);
        saturdayString = 'Sat ' + (saturday_closed ? 'Closed' : saturday_open + ' - ' + saturday_close);
        sundayString = 'Sun ' + (sunday_closed ? 'Closed' : sunday_open + ' - ' + sunday_close);

        return({
            hoursLabel: hours_label,
            specialInstructions: special_instructions,
            date: dateString,
            monday: mondayString,
            tuesday: tuesdayString,
            wednesday: wednesdayString,
            thursday: thursdayString,
            friday: fridayString,
            saturday: saturdayString,
            sunday: sundayString,
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

    buildStores(storeData){
        let sortedStores = storeData.sort(function(a, b){
            let itemA = entities.decode(a.title.rendered.toUpperCase());
            let itemB = entities.decode(b.title.rendered.toUpperCase());
            return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
        });
        let stores = sortedStores.map((store, i) =>  {
            return(
                <Col xs={12} sm={4} className="store" data-category={store.imag_taxonomy_store_category ? '[' + store.imag_taxonomy_store_category + ']' : 0} key={i}>
                    <h4><Link to={'/stores/' + store.slug + '/'} >{entities.decode(store.title.rendered)}</Link></h4>
                    <p>{store.acf.phone_number ? store.acf.phone_number : '-'}</p>
                </Col>
            );
        });
        return stores;
    }

    countStores(stores){
        let count = 0;
        stores.map(() => {
            count++;
        });
        return count;
    }

    buildTripleCTA(ctaData){
        let CTAs = ctaData.map((cta, i) => {
            return(
                <Col xs={12} sm={4} className="cta" key={i}>
                    {cta.title_url ? (
                        <Link to={cta.title_url + "/"} >
                            <img src={cta.image.url} alt={cta.image.alt ? cta.image.alt : cta.image.title}/>
                        </Link>
                    ) : (
                        <img src={cta.image.url} alt={cta.image.alt ? cta.image.alt : cta.image.title}/>
                    )}

                    <div className="copy font-color-setter-2">
                        {cta.title_url ? (
                            <Link to={cta.title_url + "/"} className="font-color-setter-2"><h4 className="font-color-setter-2">{entities.decode(cta.title)}</h4></Link>
                        ) : (
                            <h4 className="font-color-setter-2">{entities.decode(cta.title)}</h4>
                        )}
                        {cta.text &&
                            <div className="font-color-setter-2" dangerouslySetInnerHTML={{ __html: cta.text}} />
                        }
                    </div>
                </Col>
            );
        });
        return CTAs;
    }

    buildFeaturedEvents(eventData){
        let events = eventData.map((event, i) => {
            return event.ID;
        });
        return events;
    }

    categoryFilter(e){
        e.preventDefault();

        let filterVal = e.target.value;

        if (filterVal != 'all') {
            $('.store').hide().addClass('filtered');

            $('.store').each(function(i){
                let storeCategories = $(this).data('category');
                for (let k in storeCategories) {
                    if (!storeCategories.hasOwnProperty(k)) continue;
                    if (storeCategories[k] == filterVal) {
                        $(this).fadeIn('slow').removeClass('filtered');
                    }
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

    toggleStoreContainer(){
        if($('.stores').hasClass('open')){
            $('.store-toggle p').html('VIEW MORE STORES <span>&#9660;</span>');
        }
        else{
            $('.store-toggle p').html('VIEW LESS STORES <span>&#9650;</span>');
        }
        $('.stores').toggleClass('open');
    }

    render(){
        if(this.state.data){

            const printableDirectory = (
                <Tooltip id="tooltip">Printable Directory</Tooltip>
            );

            let storeMod = this.state.storeCount%3;

            const settings = {
                dots: false,
                autoplay: this.state.slides.length > 1,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: this.state.slides.length > 1,
                infinite: true,
                speed: 800,
                slidesToShow: 1,
                slidesToScroll: 1,
                nextArrow: <div><a class="carousel-control right" role="button" href="#"><img src={require("../../lib/img/home-slider-right-arrow.png")} alt="next slide" /><span className="sr-only">Next</span></a></div>,
                prevArrow: <div><a class="carousel-control left" role="button" href="#"><img src={require("../../lib/img/home-slider-left-arrow.png")} alt="previous slide" /><span className="sr-only">Previous</span></a></div>
            };

            return(
                <div className="template-home">
                    <MallSchema siteName={this.state.siteName} propertyOptions={this.state.optionsData}/>
                    <Helmet
                        title={this.state.siteName + ' | ' + this.state.siteAddress}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />
                    {this.state.enableSlider &&
                        <div className="home-header">
                            <Slider
                                className={"home-carousel slide-count-" + this.state.slides.length}
                                ref={c => this.slider = c }
                                {...settings}
                            >
                                {this.state.slides}
                            </Slider>
                            <LocationHours optionsData={this.state.optionsData} />
                        </div>
                    }

                    <div className={"stores" + (storeMod === 1 ? ' mod-1' : '') + (storeMod === 2 ? ' mod-2' : '') + (storeMod === 0 ? ' mod-3' : '')}>
                        <Grid>
                            <Row>
                                <Col xs={12} className="filter-container">
                                    <div className="filter-label">
                                        {this.state.optionsData.acf.printable_directory &&
                                        <div className="icon-container">
                                            <OverlayTrigger placement="top" overlay={printableDirectory}>
                                                <a href={this.state.optionsData.acf.printable_directory} className="print" title="printable directory" target="_blank">
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
                        <div className="store-toggle">
                            <p className="font-color-setter" onClick={this.toggleStoreContainer.bind(this)}>
                                VIEW MORE STORES <span>&#9660;</span>
                            </p>
                        </div>
                    </div>
                    {this.state.enableSignup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    {this.state.enableCTAs &&
                        <div className="triple-cta">
                            <Row>
                                {this.state.tripleCTAs}
                            </Row>
                        </div>
                    }
                    {this.state.enableCoupons &&
                        <div className="coupons" style={{backgroundImage: "url(" + this.state.couponBackgroundImage + ")"}}>
                            <Grid>
                                <Row>
                                    <Col xs={12}>
                                        <h3>{this.state.couponTitle}</h3>
                                        <p>{this.state.couponSubtitle}</p>
                                        <Button href={this.state.couponButtonURL}>{this.state.couponButtonText}</Button>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    }
                    {this.state.enableFeaturedEvents &&
                        <FeaturedEvents eventIDs={this.state.featuredEvents} />
                    }
                </div>
            )
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

export default HomeData;