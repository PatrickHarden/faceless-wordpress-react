// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import Loader from '../components/Loader';
import InteriorHeader from '../components/InteriorHeader';
import PageLayout from '../components/PageLayout';
import GravityForm from '../components/GravityForm';
import CTAThird from '../components/CTAThird';
import CTABackground from '../components/CTABackground';
import CTASolid from '../components/CTASolid';
import Slider from 'react-slick';
import MainContent from '../components/MainContent';
import SubHeaderContent from '../components/SubHeaderContent';
import FacebookPixel from '../components/FacebookPixel';


// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class Renovation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            enableSlider: false,
            optionsData: '',
            pageData: '',
            slides: false,
            slideCount: 0,
            imageSlides: false,
            imageSlideCount: 0,
            enableCTAs: false,
            enableMainContent: false,
            enableSubHeaderContent: false,
            tripleCTAs: '',
        };
    }

    componentWillMount(){
        const component = this;
        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(Pages + '?slug=renovation'),
                axios.get(PropertyOptions),
            ])
            .then(axios.spread(function (site, home, pageData, options){

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: pageData.data[0],
                    optionsData: options.data,
                    pageData: pageData.data[0],
                    slides: pageData.data[0].acf.image_slider ? component.buildSlides(pageData.data[0].acf.image_slider, 'hero') : '',
                    slideCount: pageData.data[0].acf.image_slider ? pageData.data[0].acf.image_slider.length : 0,
                    imageSlides: pageData.data[0].acf.image_slider_list ? component.buildSlides(pageData.data[0].acf.image_slider_list, 'list') : '',
                    imageSlideCount: pageData.data[0].acf.image_slider_list ? pageData.data[0].acf.image_slider_list.length : 0,
                    enableCTAs: pageData.data[0].acf.three_cta_section_enable_component ? pageData.data[0].acf.three_cta_section_enable_component : false,
                    tripleCTAs: component.buildTripleCTA(pageData.data[0].acf.cta_three_section),
                    enableMainContent: pageData.data[0].acf.main_content_enable_component ? pageData.data[0].acf.main_content_enable_component : false,
                    enableSubHeaderContent: pageData.data[0].acf.header_subtitle_enable_component ? pageData.data[0].acf.header_subtitle_enable_component : false,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    buildSlides(slideData, slideType) {
        let slides = slideData.map((slide, i) => {
            if(slideType == 'hero'){
                return(
                    <div className={"slide" + ' ' + slide.image_background_type} key={i}>
                        {slide.title ? <h2 style={{'color': slide.image_background_type == 'dark' ? 'white' : '#333333' }}>{slide.title}</h2> : ''}
                        <img src={slide.image.url} alt={slide.image.alt ? slide.image.alt : 'renovation page slide ' + i} />
                    </div>
                );
            }else{
                return (
                    <div className="slide" key={i}>
                        <img src={slide.image_slider_list_slide.url} alt={slide.image_slider_list_slide.alt ? slide.image_slider_list_slide.alt : 'renovation page slide ' + i} />
                    </div>
                );
            }
        });
        return slides;
    }

    buildTripleCTA(ctaData){
        let CTAs = ctaData.map((cta, i) => {
            let buttonLink = (cta.three_cta_section_link_type == 'Internal')? cta.three_cta_section_internal_link : cta.three_cta_section_external_link;
            return(
                <Col xs={12} sm={10} smOffset={1} md={4} mdOffset={0} className="cta" key={i}>
                    <div>
                        <div className="copy">
                            <h3>{entities.decode(cta.three_cta_section_title)}</h3>
                            {cta.three_cta_section_content &&
                            <span dangerouslySetInnerHTML={{ __html: entities.decode(cta.three_cta_section_content)}} />
                            }
                        </div>
                        {cta.three_cta_section_button_text &&
                        <Button className="border-color-setter font-color-setter" href={buttonLink}>{cta.three_cta_section_button_text ? cta.three_cta_section_button_text : ''}</Button>
                        }
                    </div>
                </Col>
            );
        });
        return CTAs;
    }

    render() {
        if(this.state.data){
            const settings = {
                dots: this.state.slideCount > 1,
                autoplay: this.state.slideCount > 1,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: this.state.slideCount > 1,
                infinite: true,
                speed: 800,
                slidesToShow: 1,
                slidesToScroll: 1,
                nextArrow: <div><a class="carousel-control right" role="button" href="#"><img src={require("../../lib/img/home-slider-right-arrow.png")} alt="next slide" /><span className="sr-only">Next</span></a></div>,
                prevArrow: <div><a class="carousel-control left" role="button" href="#"><img src={require("../../lib/img/home-slider-left-arrow.png")} alt="previous slide" /><span className="sr-only">Previous</span></a></div>,
            };

            const settingsImageSlides = {
                dots: false,
                autoplay: this.state.imageSlideCount > 1,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: this.state.imageSlideCount > 1,
                infinite: true,
                speed: 800,
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true,
                nextArrow: <div><a class="carousel-control right" role="button" href="#"><img src={require("../../lib/img/home-slider-right-arrow.png")} alt="next slide" /><span className="sr-only">Next</span></a></div>,
                prevArrow: <div><a class="carousel-control left" role="button" href="#"><img src={require("../../lib/img/home-slider-left-arrow.png")} alt="previous slide" /><span className="sr-only">Previous</span></a></div>,
                responsive: [
                            {
                              breakpoint: 1024,
                              settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                infinite: true,
                                dots: true
                              }
                            },
                            {
                              breakpoint: 720,
                              settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                              }
                            },
                            {
                              breakpoint: 480,
                              settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                              }
                            },
                            {
                                breakpoint: 400,
                                settings: "unslick"
                            }
                            
                          ]
            };
            return (
                
                <div className="template-renovation" data-page="renovation">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': this.state.optionsData.acf.meta_description},
                        ]}
                    />

                    {this.state.slideCount &&
                    <div>
                        <Slider
                            className={"renovation-carousel slide-count-" + this.state.slideCount}
                            ref={c => this.slider = c }
                            {...settings}
                        >
                            {this.state.slides}
                        </Slider>
                    </div>
                    }

                    <img src={this.state.homeData.acf.navigation_thumbnail.url} alt={this.state.homeData.acf.navigation_thumbnail.alt ? this.state.homeData.acf.navigation_thumbnail.alt : "navigation thumbnail"} className="nav-thumbnail hidden-xs hidden-sm"/>

                    {this.state.enableSubHeaderContent &&
                        <SubHeaderContent headerData={this.state.pageData} />
                    }

                    {this.state.enableMainContent &&
                        <MainContent mainData={this.state.pageData} />
                    }

                    {this.state.enableCTAs &&
                    <div className="triple-cta">
                        <Row>
                            {this.state.tripleCTAs}
                        </Row>
                    </div>
                    }

                    {this.state.pageData.acf.image_slider_enable_component && 
                    <div className="renovation-slider-container">
                        <Slider
                            className={"renovation-carousel-slider slide-count-" + this.state.imageSlideCount}
                            ref={d => this.imageSlider = d }
                            {...settingsImageSlides}
                        >
                            {this.state.imageSlides}
                        </Slider>
                    </div>
                    }
                    
                    <PageLayout pageData={this.state.pageData} />
                    {this.state.pageData.acf.cta_enable_component &&
                        <CTABackground ctaData={this.state.pageData} optionsData={this.state.pageData} />
                    }

                    {this.state.pageData.acf.cta2_enable_component &&
                        <CTASolid ctaData={this.state.pageData} optionsData={this.state.pageData} />
                    }

                    {this.state.pageData.acf.cta3_enable_component &&
                        <CTAThird ctaData={this.state.pageData} optionsData={this.state.pageData} />
                    }
                    <FacebookPixel pageData={this.state.pageData} />
                </div>
            );
        }
        return <Loader />;
    }
}

export default Renovation;
