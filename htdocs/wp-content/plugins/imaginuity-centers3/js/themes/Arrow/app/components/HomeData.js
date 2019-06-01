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
import MallSchema from '../components/schema/MallScheme';
import Slider from 'react-slick';
import DirectionsCTA from './DirectionsCTA';
import DirectoryCTA from './DirectoryCTA';
import FeaturedEvents from './FeaturedEventSlider';
import SocialMediaGallery from './SocialMediaGallery';
import TintSocialFeed from './TintSocialFeed';
import Signup from './Signup';
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

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
                    enableFeaturedEvents: home.data[0].acf.enable_featured_events,
                    featuredEvents: component.buildFeaturedEvents(home.data[0].acf.event_selector, home.data[0].acf.enable_featured_events),
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount(){
        this.slideSettingsChecker();
    }

    buildSlides(slideData) {
        let slides = slideData.map((slide, i) => {
            let slideLink;
            if(slide.slide_link === 'Internal' || slide.slide_link === 'External'){
                slideLink = (slide.slide_link === 'Internal' ? slide.slide_internal_link : slide.slide_external_link);
            }
            return(
                <div className={"slide" + ' ' + slide.image_background_type + ' ' + slide.title_alignment} data-background-type={slide.image_background_type} data-alignment={slide.title_alignment} key={i}>
                    {slide.title ? <h2 className="hidden-xs hidden-sm">{slide.title}</h2> : ''}
                    {slide.slide_link === 'Internal' || slide.slide_link === 'External' ? (
                        <Link to={slideLink} target={slide.slide_link === 'External' ? '_blank' : ''}>
                            <img src={slide.image_large.url} alt={slide.image_large.alt ? slide.image_large.alt : 'home page slide ' + i} className="hidden-xs"/>
                            <img src={slide.image_small.url} alt={slide.image_small.alt ? slide.image_small.alt : 'home page slide ' + i} className="visible-xs" />
                        </Link>
                    ) : (
                        <div>
                            <img src={slide.image_large.url} alt={slide.image_large.alt ? slide.image_large.alt : 'home page slide ' + i} className="hidden-xs hidden-sm"/>
                            <img src={slide.image_small.url} alt={slide.image_small.alt ? slide.image_small.alt : 'home page slide ' + i} className="visible-xs visible-sm" />
                        </div>
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
                dotsClass: 'slick-dots border-color-setter ' + this.state.slideBG,
                autoplay: this.state.slideCount > 1,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: this.state.slideCount > 1,
                infinite: true,
                speed: 800,
                slidesToShow: 1,
                slidesToScroll: 1,
            };

            return(
                <div className="template-home">
                    <Helmet
                        title={this.state.siteName + ' | ' + this.state.siteAddress}
                        meta={[
                            {'name': 'description', 'content': (this.state.homeData.acf.use_custom_meta_description ? this.state.homeData.acf.meta_description : this.state.metaDescription)},
                        ]}
                    />
                    <MallSchema siteName={this.state.siteName} propertyOptions={this.state.optionsData}/>
                    <div className="slider-container">
                        <Slider
                            className={"home-carousel slide-count-" + this.state.slideCount}
                            ref={c => this.slider = c }
                            {...settings}
                        >
                            {this.state.slides}
                        </Slider>
                        <span className="white-box">

                        </span>
                    </div>

                    {this.state.homeData.acf.enable_directions_cta &&
                        <DirectionsCTA homeData={this.state.homeData} />
                    }

                    {this.state.homeData.acf.enable_directory_cta &&
                        <DirectoryCTA homeData={this.state.homeData} />
                    }

                    {this.state.enableFeaturedEvents &&
                        <FeaturedEvents eventIDs={this.state.featuredEvents} />
                    }

                    {this.state.homeData.acf.enable_social_media_gallery &&
                        <SocialMediaGallery homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }

                    {this.state.optionsData.acf.enable_tint_feed &&
                        <TintSocialFeed optionsData={this.state.optionsData} />
                    }

                    {this.state.enableSignup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }

                </div>
            )
        }
        return <Loader />;
    }
}

export default HomeData;