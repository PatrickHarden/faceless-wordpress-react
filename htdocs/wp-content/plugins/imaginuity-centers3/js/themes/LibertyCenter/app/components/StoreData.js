// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button, Modal, ResponsiveEmbed} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import InteriorHeader from './InteriorHeader';
import HoursWeekly from './HoursWeekly';
import Loader from './Loader';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let Site = SiteURL + '/wp-json/ic3/v1/this_site';
let Stores = SiteURL + '/wp-json/wp/v2/stores';
let Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
let SingleGlobalStore = SiteURL + '/wp-json/ic3/v1/global_store/';


class StoreData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            storeData: '',
            optionsData: '',
        }
    }

    componentWillMount() {

        let component = this;

        axios.all([
            axios.get(Site),
            axios.get(Stores + '?slug=' + this.props.storeSlug),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function (siteData, storeData, optionsData) {

                component.buildStore(storeData, storeData.data[0].acf.global_store_selector ? storeData.data[0].acf.global_store_selector.selected_posts[0].ID : false, siteData, optionsData)

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    buildStore(storeData, globalStoreID, siteData, optionsData) {

        let component = this;

        if (globalStoreID) {
            axios.get(SingleGlobalStore + globalStoreID)
                .then((globalStoreData) => {

                    let storeCopy = storeData.data[0].acf.store_copy ? storeData.data[0].acf.store_copy : globalStoreData.data.store_copy;

                    storeCopy = storeCopy.replace('%MALL%', siteData.data.site);
                    storeCopy = storeCopy.replace('%CITY%', siteData.data.city);
                    storeCopy = storeCopy.replace('%STATE%', siteData.data.state);

                    component.setState({
                        data: true,
                        siteData: siteData.data,
                        storeData: storeData.data[0],
                        optionsData: optionsData.data,
                        logo: storeData.data[0].acf.logo ? storeData.data[0].acf.logo : globalStoreData.data.logo_color,
                        featuredVideo: storeData.data[0].acf.featured_video ? storeData.data[0].acf.featured_video : globalStoreData.data.featured_video,
                        facebook: storeData.data[0].acf.facebook ? storeData.data[0].acf.facebook : globalStoreData.data.facebook,
                        instagram: storeData.data[0].acf.instagram ? storeData.data[0].acf.instagram : globalStoreData.data.instagram,
                        twitter: storeData.data[0].acf.twitter ? storeData.data[0].acf.twitter : globalStoreData.data.twitter,
                        storeCopy: storeCopy,
                        website: storeData.data[0].acf.website ? storeData.data[0].acf.website : globalStoreData.data.website,
                    })
                })
                .catch((err) => {
                    console.log(err);
                    component.setState({
                        error: true,
                    })
                })
        }
        else {

            let storeCopy = storeData.data[0].acf.store_copy;

            storeCopy = storeCopy.replace('%MALL%', siteData.data.site);
            storeCopy = storeCopy.replace('%CITY%', siteData.data.city);
            storeCopy = storeCopy.replace('%STATE%', siteData.data.state);

            component.setState({
                data: true,
                siteData: siteData.data,
                storeData: storeData.data[0],
                optionsData: optionsData.data,
                logo: storeData.data[0].acf.logo,
                featuredVideo: storeData.data[0].acf.featured_video,
                facebook: storeData.data[0].acf.facebook,
                instagram: storeData.data[0].acf.instagram,
                twitter: storeData.data[0].acf.twitter,
                storeCopy: storeCopy,
                website: storeData.data[0].acf.website,
            })
        }
    }

    render() {
        if (this.state.data) {
            return (
                <div className={"store " + this.state.storeData.acf.store_type}>
                    <InteriorHeader
                        imageMobile={this.state.storeData.acf.hero_image_mobile ? this.state.storeData.acf.hero_image_mobile : false}
                        imageDesktop={this.state.storeData.acf.hero_image_desktop ? this.state.storeData.acf.hero_image_desktop : false}
                    />
                    <div className="container">
                        <div className="top-info">
                            <Row>
                                <Col xs={12} className="store-name">
                                    <h1>{entities.decode(this.state.storeData.title.rendered)}</h1>
                                </Col>
                                {this.state.logo &&
                                <Col xs={12} sm={3} lg={5} className="logo">
                                    <img
                                        src={this.state.logo}
                                        alt={entities.decode(this.state.storeData.title.rendered) + ' logo'}
                                    />
                                </Col>
                                }
                                <Col xs={12} sm={5} lg={4} className="info">
                                    {this.state.storeData.acf.phone_number &&
                                    <a className="phone"
                                       href={'tel:' + this.state.storeData.acf.phone_number}>{this.state.storeData.acf.phone_number}</a>
                                    }
                                    {this.state.storeData.acf.street_address &&
                                    <Link
                                        className="view-map"
                                        href={"//maps.google.com/?q=" + this.state.storeData.acf.street_address}
                                        target="_blank"
                                    >
                                        {this.state.storeData.acf.street_address}
                                    </Link>
                                    }
                                    {this.state.storeData.acf.nearby &&
                                    <div className="nearby">
                                        <div className="mini-heading">Nearby</div>
                                        {this.state.storeData.acf.nearby}
                                    </div>
                                    }
                                    {this.state.storeData.acf.convenient_parking &&
                                    <div className="parking">
                                        <div className="mini-heading">Convenient Parking:</div>
                                        {this.state.storeData.acf.convenient_parking}
                                    </div>
                                    }
                                </Col>
                                <Col xs={12} sm={4} lg={3} className="hours">
                                    <div className="mini-heading">Hours:</div>
                                    <HoursWeekly storeData={this.state.storeData} optionsData={this.state.optionsData}/>
                                    {this.state.storeData.acf.website &&
                                    <p className="website">
                                        <a
                                            href={this.state.website}
                                            target="_blank"
                                        >
                                            {this.state.website.replace('http://', '')}
                                        </a>
                                    </p>
                                    }
                                    <div className="social">
                                        {this.state.facebook &&
                                        <a className="social-icon" href={this.state.facebook}
                                           target="_blank">
                                            <img src={Images + '/icon-faceboook-grey.png'} alt="facebook"/>
                                        </a>
                                        }
                                        {this.state.instagram &&
                                        <a className="social-icon" href={this.state.instagram}
                                           target="_blank">
                                            <img src={Images + '/icon-insta-grey.png'} alt="instagram"/>
                                        </a>
                                        }
                                        {this.state.twitter &&
                                        <a className="social-icon" href={this.state.twitter}
                                           target="_blank">
                                            <img src={Images + '/icon-twitter-grey.png'} alt="twitter"/>
                                        </a>
                                        }
                                    </div>
                                </Col>
                                {/*{this.state.storeData.acf.store_type === 'restaurant' &&*/}
                                {/*<a className="view-menu" href={this.state.storeData.acf.restaurant_menu} target="_blank">View Menu</a>*/}
                                {/*}*/}
                            </Row>
                        </div>
                        <Row className="main-content">
                            {this.state.optionsData.acf.sidebar_map &&
                            <Col xs={12} className="visible-xs">
                                <div className="mobile-map">
                                    <img src={this.state.optionsData.acf.sidebar_map.url}
                                         alt={entities.decode(this.state.storeData.title.rendered) + ' map'}/>
                                    <Link to="/interactive-map">
                                        <img className="map-icon" src={Images + 'icon-map-brown.png'} alt="map pin"/>
                                        <span>View Liberty Center Map &#xbb;</span>
                                    </Link>
                                </div>
                            </Col>
                            }
                            <Col xs={12} sm={7} lg={9}>
                                {this.state.storeData.acf.subheading &&
                                <div className="subheading">{this.state.storeData.acf.subheading}</div>
                                }
                                {this.state.storeCopy &&
                                <span className="store-copy"
                                      dangerouslySetInnerHTML={{__html: this.state.storeCopy}}></span>
                                }
                            </Col>
                            {this.state.optionsData.acf.sidebar_map &&
                            <Col sm={5} lg={3} className="hidden-xs">
                                <div className="desktop-map">
                                    <img src={this.state.optionsData.acf.sidebar_map.url}
                                         alt={entities.decode(this.state.storeData.title.rendered) + ' map'}/>
                                    <Link to="/interactive-map">
                                        <img className="map-icon" src={Images + 'icon-map-brown.png'} alt="map pin"/>
                                        <span>View Liberty Center Map &#xbb;</span>
                                    </Link>
                                </div>
                            </Col>
                            }
                            <Col xs={12} lg={6} className="video-container">
                                {this.state.featuredVideo &&
                                <div className="featured-video">
                                    <ResponsiveEmbed a16by9>
                                        <iframe title="Featured Video" type="video"
                                                src={'https://www.youtube.com/embed/' + this.state.featuredVideo}></iframe>
                                    </ResponsiveEmbed>
                                </div>
                                }
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
        else if (this.state.error) {
            return (
                <div className="store">
                    <h2>An error occurred retrieving the Store data.</h2>
                    <p>Please refresh the page and try again. If this error continues, please <Link to={'/contact-us'}>contact
                        us</Link> and report the issue.</p>
                    <br/>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default StoreData;