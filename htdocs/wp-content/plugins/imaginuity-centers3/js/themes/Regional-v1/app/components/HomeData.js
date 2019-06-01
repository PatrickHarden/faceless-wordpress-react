// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import Slider from 'react-slick';
import Hours from './Hours';
import LocationIcon from 'react-icons/lib/md/place';
import FeaturedEvents from './FeaturedEventSlider';
import GoogleMapStatic from './GoogleMapStatic';
import Signup from './Signup';
import FeaturedVideo from './FeaturedVideo';
import FacebookPixel from './FacebookPixel';
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

let slideInterval;

class HomeData extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            siteName: '',
            siteAddress: '',
            metaDescription: '',
            slides: false,
            slideCount: 0,
            slideBG: '',
            slideAlign: '',
            address1: '',
            address2: '',
            address3: '',
            phone: '',
            homeData: '',
            optionsData: '',
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
            enableFeaturedVideo: false,
            enableFeaturedEvents: false,
            featuredEvents: '',
        }
    }

    componentWillMount(){

        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(PropertyOptions),
            ])
            .then(axios.spread(function (site, home, options) {

                component.setState({
                    data: true,
                    siteName: site.data.name,
                    siteAddress: options.data.acf.city + ', ' + options.data.acf.state,
                    metaDescription: options.data.acf.meta_description,
                    slideBG: home.data[0].acf.image_slider[0].image_background_type,
                    slideAlign: home.data[0].acf.image_slider[0].title_alignment,
                    address1: options.data.acf.address_1,
                    address2: options.data.acf.address_2,
                    address3: options.data.acf.city + ', ' + options.data.acf.state + ' ' + options.data.acf.zip,
                    phone: options.data.acf.phone,
                    slides: component.buildSlides(home.data[0].acf.image_slider),
                    slideCount: home.data[0].acf.image_slider.length,
                    homeData: home.data[0],
                    optionsData: options.data,
                    enableSignup: home.data[0].acf.enable_mail_signup,
                    facebook: options.data.acf.facebook_url ? options.data.acf.facebook_url : false,
                    twitter: options.data.acf.twitter_url ? options.data.acf.twitter_url : false,
                    instagram: options.data.acf.instagram_url ? options.data.acf.instagram_url : false,
                    enableCTAs: home.data[0].acf.enable_triple_cta ? home.data[0].acf.enable_triple_cta : false,
                    tripleCTAs: component.buildTripleCTA(home.data[0].acf.triple_ctas),
                    enableFeaturedVideo: home.data[0].acf.enable_featured_video,
                    enableFeaturedEvents: home.data[0].acf.enable_featured_events,
                    featuredEvents: (home.data[0].acf.event_selector ? component.buildFeaturedEvents(home.data[0].acf.event_selector, home.data[0].acf.enable_featured_events) : false),
                });

                // addresses a bug for react-slick. If there is more than 1 slide, autoplay at 5000ms
                if(component.state.slideCount > 1){
                    slideInterval =  setInterval(() => { component.slider.slickNext() }, 5000);
                }
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount(){
        this.slideSettingsChecker();
    }

    componentWillUnmount(){
        clearInterval(slideInterval);
    }

    buildSlides(slideData) {
        let slides = slideData.map((slide, i) => {
            let slideLink;
            if(slide.slide_link == 'Internal' || slide.slide_link == 'External'){
                slideLink = (slide.slide_link == 'Internal' ? slide.slide_internal_link : slide.slide_external_link);
            }
            return(
                <div className={"slide" + ' ' + slide.image_background_type + ' ' + slide.title_alignment} data-background-type={slide.image_background_type} data-alignment={slide.title_alignment} key={i}>
                    {slide.title ? <h2>{slide.title}</h2> : ''}
                    {slide.slide_link == 'Internal' || slide.slide_link == 'External' ? (
                        <Link to={slideLink} target={slide.slide_link == 'External' ? '_blank' : ''}>
                            <img src={slide.image.url} alt={slide.image.alt ? slide.image.alt : 'home page slide ' + i} />
                        </Link>
                    ) : (
                        <img src={slide.image.url} alt={slide.image.alt ? slide.image.alt : 'home page slide ' + i} />
                    )}
                </div>
            );
        });
        return slides;
    }

    dotTransition(){
        $('.slick-dots').fadeOut('fast');
    }

    slideSettingsChecker(){
        let backgroundType = $('.slick-active').data('background-type');
        let alignment = $('.slick-active').data('alignment');

        switch(alignment){
            case 'left':
                $('.slick-dots').addClass('left').removeClass('right');
                break;
            case 'right':
                $('.slick-dots').addClass('right').removeClass('left');
                break;
            default:
                break;
        }

        switch(backgroundType){
            case 'light':
                $('.slick-dots').addClass('light').removeClass('dark');
                break;
            case 'dark':
                $('.slick-dots').addClass('dark').removeClass('light');
                break;
            default:
                break;
        }

        $('.slick-dots').fadeIn(100);

    }
    


    buildTripleCTA(ctaData){
        let CTAs = ctaData.map((cta, i) => {
            let a = new RegExp('/' + window.location.host + '/');
            return(
                <Col xs={12} sm={10} smOffset={1} md={4} mdOffset={0} className="cta" key={i}>
                    {cta.title_url ? (
                    <div>
                        <a className="font-color-setter" href={cta.title_url}>
                            <img src={cta.image.url} alt={cta.image.alt ? cta.image.alt : cta.image.title}/>
                        </a>
                        <div className="copy font-color-setter">
                            <h3>
                                <a className="font-color-setter" href={cta.title_url}>
                                    {entities.decode(cta.title)}
                                </a>
                            </h3>
                            {cta.text &&
                            <span dangerouslySetInnerHTML={{ __html: entities.decode(cta.text)}} />
                            }
                        </div>
                    </div>
                    ) : (
                        <div>
                            <img src={cta.image.url} alt={cta.image.alt ? cta.image.alt : cta.image.title}/>
                            <div className="copy font-color-setter">
                                <h3>{entities.decode(cta.title)}</h3>
                                {cta.text &&
                                <span dangerouslySetInnerHTML={{ __html: entities.decode(cta.text)}} />
                                }
                            </div>
                        </div>
                    )}

                </Col>
            );
        });
        return CTAs;
    }

    buildFeaturedEvents(eventData, bool){
        if(bool){
            let events = eventData.map((event, i) => {
                return event.ID;
            });
            return events;
        }
        else{
            return false;
        }
    }


    render(){
        if(this.state.data){

            const settings = {
                dots: true,
                dotsClass: 'slick-dots border-color-setter ' + this.state.slideBG + ' ' + this.state.slideAlign,
                autoplay: false,
                // autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: this.state.slideCount > 1,
                infinite: true,
                speed: 800,
                slidesToShow: 1,
                slidesToScroll: 1,
                beforeChange: this.dotTransition,
                afterChange: this.slideSettingsChecker,
                responsive: [
                    {breakpoint: 640,
                        settings: {
                            dots: false,
                        },
                    },
                ]
            };

            return(
                <div className="template-home">
                    <Helmet
                        title={this.state.siteName + ' | ' + this.state.siteAddress}
                        meta={[
                            {'name': 'description', 'content': (this.state.homeData.acf.use_custom_meta_description ? this.state.homeData.acf.meta_description : this.state.metaDescription)},
                        ]}
                    />

                    <div>
                        <Slider
                            className={"home-carousel slide-count-" + this.state.slideCount}
                            ref={c => this.slider = c }
                            {...settings}
                        >
                            {this.state.slides}
                        </Slider>
                    </div>

                    <img src={this.state.homeData.acf.navigation_thumbnail.url} alt={this.state.homeData.acf.navigation_thumbnail.alt ? this.state.homeData.acf.navigation_thumbnail.alt : "navigation thumbnail"} className="nav-thumbnail hidden-xs hidden-sm"/>

                    <span className="hidden-xs hidden-sm">
                        <Hours optionsData={this.state.optionsData} />
                    </span>


                    <GoogleMapStatic optionsData={this.state.optionsData} homeData={this.state.homeData} />

                    {this.state.enableSignup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    {this.state.enableCTAs &&
                        <div className="triple-cta">
                            {this.state.tripleCTAs}
                        </div>
                    }
                    {this.state.enableFeaturedVideo &&
                        <FeaturedVideo homeData={this.state.homeData} />
                    }
                    {this.state.enableFeaturedEvents &&
                        <FeaturedEvents eventIDs={this.state.featuredEvents} />
                    }
                    <FacebookPixel pageData={this.state.homeData} />
                </div>
            )
        }
        return <Loader />;
    }
}

export default HomeData;