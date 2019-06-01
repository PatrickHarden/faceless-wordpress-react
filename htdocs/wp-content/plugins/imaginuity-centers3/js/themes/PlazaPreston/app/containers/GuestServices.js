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
import EventCTA from '../components/EventCTA';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class GuestServices extends Component {
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
            axios.get(Pages + '?slug=guest-services'),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function (site, page, options) {

                let sections;

                if(page.data[0].acf.section_repeater) {

                    sections = page.data[0].acf.section_repeater.map((section) => {
                        return (
                            <Row className="amenity">
                                {section.section_title &&
                                <Col xs={12} className="heading-wrapper">
                                    <h2>{section.section_title}</h2>
                                </Col>
                                }
                                {section.cta_repeater &&
                                <Col xs={12} className="cta-container">

                                    {section.cta_repeater.map(function (cta) {
                                        return (
                                            <Row className="cta">
                                                <Col sm={6} md={4} className="image-wrapper">
                                                    {cta.image &&
                                                    <img src={cta.image.url}
                                                         alt={cta.image.alt ? cta.image.alt : cta.title}/>
                                                    }
                                                </Col>
                                                <Col sm={6} md={8} className="content-wrapper">
                                                    {cta.title &&
                                                    <h3>{cta.title}</h3>
                                                    }
                                                    {cta.copy &&
                                                    <span className="copy"
                                                          dangerouslySetInnerHTML={{__html: cta.copy}}></span>
                                                    }
                                                    {cta.button &&
                                                    <Link className="plaza-button black"
                                                          to={cta.button.target === '_blank' ? cta.button.url : cta.button.url.replace(SiteURL, "")}
                                                          target={cta.button.target}>
                                                        {cta.button.title}
                                                    </Link>
                                                    }
                                                </Col>
                                            </Row>
                                        )


                                    })}
                                </Col>
                                }
                            </Row>
                        );
                    })
                }
                else {
                    sections = false;
                }
                component.setState({
                    data: true,
                    siteData: site.data,
                    pageData: page.data[0],
                    optionsData: options.data,
                    sections: sections,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }


    render() {
        if (this.state.data) {
            return (
                <div className="template-guest-services">
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
                    <div className="top-content">
                        <img className="branches one" src={Images + 'branches1.png'} alt="branches"/>
                        {this.state.pageData.acf.background_image &&
                        <img className="background hidden-xs hidden-sm"
                             src={this.state.pageData.acf.background_image.url}
                             alt={this.state.pageData.acf.background_image.alt ? this.state.pageData.acf.background_image.alt : 'background'}/>
                        }
                        <div className="container">
                            <Row>
                                <Col md={5}>
                                    <div className="image-wrapper">
                                        {this.state.pageData.acf.foreground_image &&
                                        <img className="foreground" src={this.state.pageData.acf.foreground_image.url}
                                             alt={this.state.pageData.acf.foreground_image.alt ? this.state.pageData.acf.foreground_image.alt : 'foreground'}/>
                                        }
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <div className="content-wrapper">
                                        {this.state.pageData.acf.top_title &&
                                        <h2>{this.state.pageData.acf.top_title}</h2>
                                        }
                                        {this.state.pageData.acf.top_copy &&
                                        <p>{this.state.pageData.acf.top_copy}</p>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {this.state.sections &&
                    <div className="amenities">
                        <div className="container">
                            {this.state.sections}
                        </div>
                    </div>
                    }
                    <EventCTA/>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default GuestServices;
