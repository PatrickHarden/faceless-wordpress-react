// Packages
import React, {Component} from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import {ReactBootstrap, Grid, Row, Col} from 'react-bootstrap';
import Slider from 'react-slick';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import ImageGrid from '../components/Module-ImageGrid';
import EventsHome from '../components/EventsHome';
import TintSocialFeed from '../components/TintSocialFeed';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            homeData: '',
            optionsData: '',
            siteData: '',
        }
    }

    componentWillMount() {

        let component = this;

        axios.all([
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
            axios.get(SiteURL + '/wp-json'),
        ])
            .then(axios.spread(function (_home, _options, _site) {

                let imageData = [];

                _home.data[0].acf.image_grid ?
                    imageData = {
                        image_group_1: _home.data[0].acf.image_group_1,
                        image_group_2: _home.data[0].acf.image_group_2,
                        image_group_3: _home.data[0].acf.image_group_3,
                        image_group_4: _home.data[0].acf.image_group_4,
                        image_group_5: _home.data[0].acf.image_group_5,
                        image_group_6: _home.data[0].acf.image_group_6,
                        image_group_7: _home.data[0].acf.image_group_7,
                        image_group_8: _home.data[0].acf.image_group_8
                    } : null;

                let showtimesButton;

                if (_home.data[0].acf.showtimes_button_link) {
                    showtimesButton =
                        <Link
                            to={_home.data[0].acf.showtimes_button_link.url + "/"}
                            target={_home.data[0].acf.showtimes_button_link.target}
                            className="button"
                        >
                            {_home.data[0].acf.showtimes_button_link}
                        </Link>;
                }

                let movies;

                if (_home.data[0].acf.movies) {
                    movies = _home.data[0].acf.movies.map((movie) => {
                        return (
                            <div className="movie">
                                <img src={movie.poster.url} alt={movie.title}/>
                            </div>
                        )
                    })
                }

                console.log('homeData', _home.data[0]);

                component.setState({
                    data: true,
                    homeData: _home.data[0],
                    optionsData: _options.data,
                    siteData: _site.data,
                    homeSlides: component.buildSlides(_home.data[0].acf.hero_slider),
                    imageGridData: imageData,
                    showtimeButton: showtimesButton,
                    movies: movies
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    buildSlides(slideData) {
        console.log('slideData', slideData);
        let slides = slideData.map((slide, i) => {
            return (
                <div className="slide">
                    <img src={slide.mobile_image.url}
                         alt={slide.mobile_image.alt ? slide.mobile_image.alt : 'mobile hero slide ' + i}
                         className="hero visible-xs"/>
                    <img src={slide.desktop_image.url}
                         alt={slide.desktop_image.alt ? slide.desktop_image.alt : 'desktop hero slide ' + i}
                         className="hero hidden-xs"/>
                </div>
            );
        });

        return slides;
    }

    render() {
        if (this.state.data) {

            const settings = {
                dots: true,
                autoplay: this.state.homeSlides.length > 1,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: this.state.homeSlides.length > 1,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 800,
            };

            return (
                <div data-page="template-home" className="template-home">
                    <Helmet
                        title={this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + (this.state.optionsData.acf.address_2 ? ' ' + this.state.optionsData.acf.address_2 + ', ' : ', ') + this.state.optionsData.acf.city + ' ' + this.state.optionsData.acf.state}
                        meta={[
                            {
                                'name': 'description',
                                'content': (this.state.homeData.acf.use_custom_meta_description ? this.state.homeData.acf.meta_description : this.state.metaDescription)
                            },
                        ]}
                    />

                    <div className="home-hero">
                        {this.state.homeSlides &&
                        <Slider
                            className={"home-hero-slider"}
                            ref={a => this.slider = a}
                            {...settings}
                        >
                            {this.state.homeSlides}
                        </Slider>
                        }
                        <img className="liberfly" src={Images + 'liberfly.png'} alt="flower"/>
                    </div>
                    <div className="home-criss-cross">criss cross</div>
                    <div className="events-container">
                        <h1>{this.state.homeData.acf.events_large_text ? this.state.homeData.acf.events_large_text : 'Life'}
                            <span>{this.state.homeData.acf.events_small_text ? this.state.homeData.acf.events_small_text : 'Centered'}</span>
                        </h1>
                        <EventsHome optionsData={this.state.optionsData} />
                        <Link to={'/events'} className='liberty-button brown'>VIEW MORE events</Link>
                    </div>

                    <div className="dining">
                        {this.state.homeData.acf.dining_mobile_image &&
                        <img className="visible-xs" src={this.state.homeData.acf.dining_mobile_image.url}
                             alt={this.state.homeData.acf.dining_mobile_image.alt ? this.state.homeData.acf.dining_mobile_image.alt : 'dining background mobile'}/>
                        }
                        {this.state.homeData.acf.dining_desktop_image &&
                        <img className="hidden-xs" src={this.state.homeData.acf.dining_desktop_image.url}
                             alt={this.state.homeData.acf.dining_desktop_image.alt ? this.state.homeData.acf.dining_desktop_image.alt : 'dining background desktop'}/>
                        }
                        <div className="content-wrapper">
                            <h2>{this.state.homeData.acf.dining_large_text ? this.state.homeData.acf.dining_large_text : 'Dining'}
                                <span>{this.state.homeData.acf.dining_small_text ? this.state.homeData.acf.dining_small_text : 'with us'}</span>
                            </h2>
                            <Link to={'/dining'} className="liberty-button white">
                                {this.state.homeData.acf.dining_button_text ? this.state.homeData.acf.dining_button_text : 'View Dining Options'}
                            </Link>
                        </div>
                    </div>

                    <div className="showtimes container">
                        <div className="inner-wrapper">
                            <h2>{this.state.homeData.acf.showtimes_large_text ? this.state.homeData.acf.showtimes_large_text : 'Shows'}
                                <span>{this.state.homeData.acf.showtimes_small_text ? this.state.homeData.acf.showtimes_small_text : 'and times'}</span>
                            </h2>
                            {this.state.homeData.acf.showtimes_button_link &&
                            <a
                                href={this.state.homeData.acf.showtimes_button_link.url}
                                target={this.state.homeData.acf.showtimes_button_link.target}
                                className="liberty-button brown"
                            >
                                {this.state.homeData.acf.showtimes_button_link.title ? entities.decode(this.state.homeData.acf.showtimes_button_link.title) : 'Showtimes and Tickets'}
                            </a>
                            }
                            <Row>
                                <Col xs={12} sm={8} lg={9} className="movies">
                                    {this.state.movies}
                                </Col>
                                <Col xs={12} sm={4} lg={3} className="theater-logo">
                                    <img src={this.state.homeData.acf.theater_logo.url} alt="theater logo"/>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    {this.state.homeData.acf.image_grid &&
                    <ImageGrid images={this.state.imageGridData}/>
                    }

                    <div className="social-feed container">
                        <Row>
                            <Col xs={12} sm={9} className="heading-wrapper">
                                <h2>@LIBERTYCENTER</h2>
                            </Col>
                            <Col xs={12} sm={3} className="social-wrapper">
                                <div className="social-links">
                                    {this.state.optionsData.acf.facebook_url &&
                                    <a href={this.state.optionsData.acf.facebook_url} target="_blank">
                                        <img src={Images + 'icon-facebook-turquoise.png'} alt="facebook"/>
                                    </a>
                                    }
                                    {this.state.optionsData.acf.twitter_url &&
                                    <a href={this.state.optionsData.acf.twitter_url} target="_blank">
                                        <img src={Images + 'icon-twitter-turquoise.png'} alt="twitter"/>
                                    </a>
                                    }
                                    {this.state.optionsData.acf.instagram_url &&
                                    <a href={this.state.optionsData.acf.instagram_url} target="_blank">
                                        <img src={Images + 'icon-insta-turquoise.png'} alt="instagram"/>
                                    </a>
                                    }
                                </div>
                            </Col>
                        </Row>
                        <TintSocialFeed optionsData={this.state.optionsData} />
                    </div>

                    {this.state.homeData.acf.bottom_copy &&
                    <div className="bottom-copy container">
                        <hr className="double-line hidden-xs"/>
                        <span dangerouslySetInnerHTML={{__html: this.state.homeData.acf.bottom_copy}}></span>
                    </div>
                    }

                </div>
            );
        }
        return <Loader/>;
    }
}

export default Home;
