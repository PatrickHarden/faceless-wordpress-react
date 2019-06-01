// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button, Modal} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
let moment = require('moment');

// Components
import HoursToday from './HoursToday';
import HoursWeekly from './HoursWeekly';
import Loader from './Loader';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let Site = SiteURL + '/wp-json/ic3/v1/this_site';
let Stores = SiteURL + '/wp-json/wp/v2/stores';
let Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img";
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';


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

                component.setState({
                    data: true,
                    siteData: siteData.data,
                    storeData: storeData.data[0],
                    optionsData: optionsData.data,
                });
            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    render() {
        if (this.state.data) {
            return (
                <div className={"store " + this.state.storeData.acf.store_type}>
                    <div className="container">
                        <div className="top-info">
                            <HoursToday storeData={this.state.storeData} optionsData={this.state.optionsData} />
                            {this.state.storeData.acf.phone_number &&
                            <a className="phone"
                               href={'tel:' + this.state.storeData.acf.phone_number}>{this.state.storeData.acf.phone_number}</a>
                            }
                            {this.state.storeData.acf.phone_number &&
                            <span className="divider">|</span>
                            }
                            {this.state.storeData.acf.address_1 &&
                            <a className="view-map" href={"/interactive-map/?location=" + this.state.storeData.acf.mapplic_id} target="_blank">View on Map</a>
                            }
                            {this.state.storeData.acf.store_type === 'restaurant' &&
                            <a className="view-menu" href={this.state.storeData.acf.restaurant_menu} target="_blank">View Menu</a>
                            }
                        </div>
                    </div>
                    {this.state.storeData.acf.enable_top_copy_section &&
                    <div className="top-copy">
                        {this.state.storeData.acf.background_image &&
                        <img className="background-image" src={this.state.storeData.acf.background_image.url}
                             alt={this.state.storeData.acf.background_image.alt ? this.state.storeData.acf.background_image.alt : 'store background image'}/>
                        }
                        <div className="container">
                            <div className="row">
                                <Col md={6} className="image-wrapper">
                                    {this.state.storeData.acf.foreground_image &&
                                    <img className="foreground-image"
                                         src={this.state.storeData.acf.foreground_image.url}
                                         alt={this.state.storeData.acf.foreground_image.alt ? this.state.storeData.acf.foreground_image.alt : 'store foreground image'}/>
                                    }
                                </Col>
                                <Col md={6} className="content-wrapper">
                                    <h2>{this.state.storeData.acf.top_title ? this.state.storeData.acf.top_title : 'The Store'}</h2>
                                    {this.state.storeData.acf.top_copy &&
                                    <span dangerouslySetInnerHTML={{__html: this.state.storeData.acf.top_copy}}></span>
                                    }
                                </Col>
                            </div>
                        </div>
                    </div>
                    }
                    {this.state.storeData.acf.enable_bottom_copy_section &&
                    <div className="bottom-copy">
                        <div className="container">
                            <div className="row">
                                <Col md={8} className="content-wrapper">
                                    <h2>{this.state.storeData.acf.bottom_title ? this.state.storeData.acf.bottom_title : 'The Story'}</h2>
                                    {this.state.storeData.acf.bottom_copy &&
                                    <span
                                        dangerouslySetInnerHTML={{__html: this.state.storeData.acf.bottom_copy}}></span>
                                    }
                                </Col>
                                <Col md={4} className="image-wrapper">
                                    {this.state.storeData.acf.image_bottom &&
                                    <img className="foreground-image" src={this.state.storeData.acf.image_bottom.url}
                                         alt={this.state.storeData.acf.image_bottom.alt ? this.state.storeData.acf.image_bottom.alt : 'store foreground image'}/>
                                    }
                                </Col>
                            </div>
                        </div>
                    </div>
                    }
                    <div className="bottom-info">
                        <div className="container">
                            <div className="row">
                                <Col sm={4} className="categories">
                                    <p>Clothes, Shoes, Fashion</p>
                                    {this.state.storeData.acf.phone_number &&
                                    <p className="phone"><a
                                        href={'tel:' + this.state.storeData.acf.phone_number}>{this.state.storeData.acf.phone_number}</a>
                                    </p>
                                    }
                                    {this.state.storeData.acf.website &&
                                    <p className="website">
                                        <a
                                            href={this.state.storeData.acf.website}
                                            target="_blank"
                                        >
                                            {this.state.storeData.acf.website.replace('http://','')}
                                        </a>
                                    </p>
                                    }
                                </Col>
                                <Col sm={4} className="hours">
                                    <HoursWeekly storeData={this.state.storeData} optionsData={this.state.optionsData} />
                                    {this.state.storeData.acf.address_1 &&
                                    <p className="google-maps">
                                        <a href={"//maps.google.com/?q=" + this.state.storeData.acf.address_1 + '+' + (this.state.storeData.acf.address_2 ? this.state.storeData.acf.address_2 : '')} target="_blank">
                                            {this.state.storeData.acf.address_1}
                                            {this.state.storeData.acf.address_2 &&
                                            <span><br/>{this.state.storeData.acf.address_2}</span>
                                            }
                                        </a>
                                    </p>
                                    }
                                </Col>
                                <Col sm={4} className="ride">
                                    {this.state.storeData.acf.uber_link &&
                                    <p className="uber"><a href={this.state.storeData.acf.uber_link} target="_blank">Ride with Uber</a></p>
                                    }
                                    {this.state.storeData.acf.lyft_link &&
                                    <p className="lyft"><a href={this.state.storeData.acf.lyft_link} target="_blank">Ride with Lyft</a></p>
                                    }
                                    <div className="social">
                                        {this.state.storeData.acf.facebook &&
                                        <a className="social-icon" href={this.state.storeData.acf.facebook} target="_blank">
                                            <img src={Images + '/facebook-white.png'} alt="facebook"/>
                                        </a>
                                        }
                                        {this.state.storeData.acf.instagram &&
                                        <a className="social-icon" href={this.state.storeData.acf.instagram} target="_blank">
                                            <img src={Images + '/instagram-white.png'} alt="instagram"/>
                                        </a>
                                        }
                                        {this.state.storeData.acf.twitter &&
                                        <a className="social-icon" href={this.state.storeData.acf.twitter} target="_blank">
                                            <img src={Images + '/twitter-white.png'} alt="twitter"/>
                                        </a>
                                        }
                                    </div>
                                </Col>
                            </div>
                        </div>
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