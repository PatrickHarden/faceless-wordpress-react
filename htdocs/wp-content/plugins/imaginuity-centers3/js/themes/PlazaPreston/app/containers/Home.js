// Packages
import React, {Component} from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import {ReactBootstrap, Grid, Row, Col} from 'react-bootstrap';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import FeaturedRetailers from '../components/FeaturedRetailers';
import TintSocialFeed from '../components/TintSocialFeed';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

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
                component.setState({
                    data: true,
                    homeData: _home.data[0],
                    optionsData: _options.data,
                    siteData: _site.data,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if (this.state.data) {
            let homeData = this.state.homeData.acf;
            console.log(homeData);
            return (
                <div data-page="template-home" className="template-home">
                    <Helmet
                        title={this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_2 + (this.state.optionsData.acf.address_2 ? ' ' + this.state.optionsData.acf.address_2 + ', ' : ', ') + this.state.optionsData.acf.city + ' ' + this.state.optionsData.acf.state}
                        meta={[
                            {
                                'name': 'description',
                                'content': (homeData.use_custom_meta_description ? homeData.meta_description : this.state.metaDescription)
                            },
                        ]}
                    />

                    <div className="home-hero">
                        {homeData.hero_image_mobile &&
                        <img className="mobile-bg visible-xs" src={homeData.hero_image_mobile.url}
                             alt={homeData.hero_image_mobile.alt ? homeData.hero_image_mobile.alt : 'home hero mobile'}/>
                        }
                        {homeData.hero_image_desktop &&
                        <img className="desktop-bg hidden-xs" src={homeData.hero_image_desktop.url}
                             alt={homeData.hero_image_desktop.alt ? homeData.hero_image_desktop.alt : 'home hero desktop'}/>
                        }
                        <div className="container">
                            <div className="copy-container">
                                {homeData.hero_copy_texture &&
                                <img src={homeData.hero_copy_texture.url}
                                     alt={homeData.hero_copy_texture.alt ? homeData.hero_copy_texture.alt : 'home hero mobile'}/>
                                }
                                <div className="titles">
                                    {homeData.title_1_left &&
                                    <h2>{homeData.title_1_left ? homeData.title_1_left : ''}
                                        <b>{homeData.title_1_right ? homeData.title_1_right : ''}</b></h2>
                                    }
                                    {homeData.title_2_left &&
                                    <h2>{homeData.title_2_left ? homeData.title_2_left : ''}
                                        <b>{homeData.title_2_right ? homeData.title_2_right : ''}</b></h2>
                                    }
                                    {homeData.title_3_left &&
                                    <h2>{homeData.title_3_left ? homeData.title_3_left : ''}
                                        <b>{homeData.title_3_right ? homeData.title_3_right : ''}</b></h2>
                                    }
                                </div>
                                {homeData.hero_copy &&
                                <div className="copy">
                                    <p dangerouslySetInnerHTML={{__html: homeData.hero_copy}}></p>
                                </div>
                                }
                                <div className="buttons">
                                    {homeData.button_1 &&
                                    <Link className="plaza-button"
                                          to={homeData.button_1.target === '_blank' ? homeData.button_1.url : homeData.button_1.url.replace(SiteURL, "")}
                                          target={homeData.button_1.target}>{homeData.button_1.title}</Link>
                                    }
                                    {homeData.button_2 &&
                                    <Link className="plaza-button"
                                          to={homeData.button_2.target === '_blank' ? homeData.button_2.url : homeData.button_2.url.replace(SiteURL, "")}
                                          target={homeData.button_2.target}>{homeData.button_2.title}</Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lookbook">
                        {/*<img className="branches one" src={Images + 'branches1.png'} alt="branches"/>*/}
                        <img className="sculpture hidden-xs" src={Images + 'yellow-sculpture.png'}
                             alt="yellow metal sculpture"/>
                        <div className="container">
                            <Col xs={12} sm={7} className="inner-wrapper">
                                <h2 className="heading">{homeData.lookbook_title ? homeData.lookbook_title : 'Destination Dallas'}</h2>
                                {homeData.lookbook_season &&
                                <h2 className="season">{homeData.lookbook_season}</h2>
                                }
                                {homeData.lookbook_copy &&
                                <div className="copy">
                                    <p dangerouslySetInnerHTML={{__html: homeData.lookbook_copy}}></p>
                                </div>
                                }
                                {homeData.lookbook_button &&
                                <Link className="plaza-button black hidden-xs"
                                      to={homeData.lookbook_button.target === '_blank' ? homeData.lookbook_button.url : homeData.lookbook_button.url.replace(SiteURL, "")}
                                      target={homeData.lookbook_button.target}>{homeData.lookbook_button.title}</Link>
                                }
                            </Col>
                            <Col xs={12} sm={5} className="sculpture-wrap">
                                {homeData.lookbook_featured_image &&
                                <img className="lookbook-feature" src={homeData.lookbook_featured_image.url}
                                     alt={homeData.lookbook_featured_image.alt ? homeData.lookbook_featured_image.alt : 'lookbook featured image'}/>
                                }
                            </Col>
                            <Col xs={12} className="inner-wrapper visible-xs">
                                {homeData.lookbook_button &&
                                <Link className="plaza-button black"
                                      to={homeData.lookbook_button.target === '_blank' ? homeData.lookbook_button.url : homeData.lookbook_button.url.replace(SiteURL, "")}
                                      target={homeData.lookbook_button.target}>{homeData.lookbook_button.title}</Link>
                                }
                            </Col>
                        </div>
                    </div>

                    <FeaturedRetailers
                        retailerTitle ={homeData.featured_retailer_title}
                        retailers={homeData.featured_retailer_picker}
                        retailerLink={homeData.featured_retailer_link}
                    />

                    <div className="blog-cta circle-gradient-red">
                        <div className="container">
                            {homeData.blog_title &&
                            <h2>{homeData.blog_title}</h2>
                            }
                            {homeData.blog_copy &&
                            <p dangerouslySetInnerHTML={{__html: homeData.blog_copy}}></p>
                            }
                            <div className="button-container">
                                {homeData.blog_button &&
                                <Link className="plaza-button"
                                      to={homeData.blog_button.target === '_blank' ? homeData.blog_button.url : homeData.blog_button.url.replace(SiteURL, "")}
                                      target={homeData.blog_button.target}>{homeData.blog_button.title}</Link>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="social-feed">
                        {/*<img className="branches two" src={Images + 'branches2.png'} alt="branches2"/>*/}
                        <div className="container">
                            <img className="at-symbol" src={Images + '@.png'} alt="@"/>
                            <img className="plaza" src={Images + 'PLAZAATPRESTON.png'} alt="plaza at preston center"/>
                        </div>
                        <TintSocialFeed />
                        <div className="container button-container">
                            <Link className="plaza-button black instagram" to={this.state.optionsData.acf.instagram_url}
                                  target={'_blank'}>Follow us on Instagram</Link>
                            <Link className="plaza-button black twitter" to={this.state.optionsData.acf.twitter_url}
                                  target={'_blank'}>Follow us on Twitter</Link>
                        </div>
                    </div>
                </div>
            );
        }
        return <Loader/>;
    }
}

export default Home;
