// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import GravityForm from '../components/GravityForm';
import EventCTA from '../components/EventCTA';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class ContactUs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
        };
    }

    componentWillMount() {
        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=contact-us'),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function (site, page, options) {


                component.setState({
                    data: true,
                    siteData: site.data,
                    pageData: page.data[0],
                    optionsData: options.data,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }


    render() {
        if (this.state.data) {
            console.log(this.state.pageData);
            return (
                <div className="template-contact-us">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {
                                'name': 'description',
                                'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)
                            },
                        ]}
                    />
                    <InteriorHeader
                        title={this.state.pageData.acf.title ? this.state.pageData.acf.title : this.state.pageData.title.rendered}
                        titleCopy={this.state.pageData.acf.title_copy}
                        color={this.state.pageData.acf.title_section_color}
                        aboveBelow={this.state.pageData.acf.above_below}
                        imageMobile={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_desktop : false}
                    />
                    <div className="top-container">
                        <img className="branches two" src={Images + 'branches2.png'} alt="branches2"/>
                        <div className="container">
                            {this.state.pageData.acf.top_copy &&
                            <p className="top-copy">
                                {this.state.pageData.acf.top_copy}
                            </p>
                            }
                            {this.state.pageData.acf.gravity_form &&
                            <GravityForm gformID={this.state.pageData.acf.gravity_form.id}/>
                            }
                        </div>
                        <img className="texture" src={Images + 'texture-grey.png'} alt="grey texture"/>
                    </div>
                    <div className="directions circle-gradient-red">
                        <div className="container">
                            <Row>
                                <Col md={6} className="image-container">
                                    {this.state.pageData.acf.directions_image &&
                                    <img src={this.state.pageData.acf.directions_image.url}
                                         alt={this.state.pageData.acf.directions_image.alt ? this.state.pageData.acf.directions_image.alt : "Directions"}/>
                                    }
                                </Col>
                                <Col md={6} className="content-wrapper">
                                    <div className="inner-wrapper">
                                        <div className="heading-wrapper">
                                            {this.state.pageData.acf.directions_title &&
                                            <h3>{this.state.pageData.acf.directions_title}</h3>
                                            }
                                        </div>
                                        <div className="copy-wrapper">
                                            {this.state.pageData.acf.directions_copy &&
                                            <span className="copy"
                                                  dangerouslySetInnerHTML={{__html: this.state.pageData.acf.directions_copy}}></span>
                                            }
                                        </div>
                                        <div className="button-wrapper">
                                            {this.state.pageData.acf.directory_button_1 &&
                                            <Link className="plaza-button"
                                                  to={this.state.pageData.acf.directory_button_1.target === '_blank' ? this.state.pageData.acf.directory_button_1.url : this.state.pageData.acf.directory_button_1.url.replace(SiteURL, "")}
                                                  target={this.state.pageData.acf.directory_button_1.target}>{this.state.pageData.acf.directory_button_1.title}</Link>
                                            }
                                            {this.state.pageData.acf.directory_button_2 &&
                                            <Link className="plaza-button"
                                                  to={this.state.pageData.acf.directory_button_2.target === '_blank' ? this.state.pageData.acf.directory_button_2.url : this.state.pageData.acf.directory_button_2.url.replace(SiteURL, "")}
                                                  target={this.state.pageData.acf.directory_button_2.target}>{this.state.pageData.acf.directory_button_2.title}</Link>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="get-in-touch">
                        <div className="container">
                            <div className="heading-wrapper">
                                <h2>{this.state.pageData.acf.get_in_touch_title ? this.state.pageData.acf.get_in_touch_title : 'Get In Touch'}</h2>
                            </div>
                            <Row>
                                <Col sm={6} md={3} className="cta-wrapper">
                                    {this.state.pageData.acf.cta_1_title &&
                                    <div className="cta">
                                        <h4>{this.state.pageData.acf.cta_1_title}</h4>
                                        <span className="copy"
                                              dangerouslySetInnerHTML={{__html: this.state.pageData.acf.cta_1_copy}}></span>
                                    </div>
                                    }
                                </Col>
                                <Col sm={6} md={3} className="cta-wrapper">
                                    {this.state.pageData.acf.cta_2_title &&
                                    <div className="cta">
                                        <h4>{this.state.pageData.acf.cta_2_title}</h4>
                                        <span className="copy"
                                              dangerouslySetInnerHTML={{__html: this.state.pageData.acf.cta_2_copy}}></span>
                                    </div>
                                    }
                                </Col>
                                <Col sm={6} md={3} className="cta-wrapper">
                                    {this.state.pageData.acf.cta_3_title &&
                                    <div className="cta">
                                        <h4>{this.state.pageData.acf.cta_3_title}</h4>
                                        <span className="copy"
                                              dangerouslySetInnerHTML={{__html: this.state.pageData.acf.cta_3_copy}}></span>
                                    </div>
                                    }
                                </Col>
                                <Col sm={6} md={3} className="cta-wrapper">

                                    {this.state.pageData.acf.cta_4_title &&
                                    <div className="cta">
                                        <h4>{this.state.pageData.acf.cta_4_title}</h4>
                                        <span className="copy"
                                              dangerouslySetInnerHTML={{__html: this.state.pageData.acf.cta_4_copy}}></span>
                                    </div>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <EventCTA/>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default ContactUs;
