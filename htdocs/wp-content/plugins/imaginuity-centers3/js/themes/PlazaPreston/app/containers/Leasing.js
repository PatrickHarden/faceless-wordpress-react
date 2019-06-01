// Packages
import React, {PropTypes, Component} from 'react';
import {ReactBootstrap, ResponsiveEmbed, Grid, Row, Col, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import $ from 'jquery';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import FeaturedRetailers from '../components/FeaturedRetailers';
import EventCTA from '../components/EventCTA';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages/';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class Leasing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            optionsData: '',
            pageData: '',
            spaces: '',
            agents: '',
        }
    }

    componentWillMount() {
        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(PropertyOptions),
            axios.get(Pages + '?slug=leasing'),
        ])
            .then(axios.spread(function (site, options, page) {

                console.log(page);

                let spaces;
                if (page.data[0].acf.available_spaces) {
                    spaces = page.data[0].acf.available_spaces.map((space, i) => {
                        return (
                            <Row className="space" key={i}>
                                <Col sm={6} className="image-wrapper">
                                    {space.image &&
                                    <img src={space.image.url} alt={space.image.alt ? space.image.alt : space.title}/>
                                    }
                                </Col>
                                <Col sm={6} class="content-wrapper">
                                    {space.title &&
                                    <h3>{space.title}</h3>
                                    }
                                    {space.copy &&
                                    <span className="copy" dangerouslySetInnerHTML={{__html: space.copy}}></span>
                                    }
                                    <div className="button-wrapper">
                                        {space.button &&
                                        <Link className="plaza-button black"
                                              to={space.button.target === '_blank' ? space.button.url : space.button.url.replace(SiteURL, "")}
                                              target={space.button.target}>{space.button.title}</Link>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        );
                    });
                }

                let agents = page.data[0].acf.leasing_agents.map((agent, i) => {
                    return (
                        <Col sm={6} className="agent" key={i}>
                            <Col md={6} className="image-wrapper">
                                {agent.image &&
                                <img src={agent.image.url} alt={agent.image.alt ? agent.image.alt : agent.title}/>
                                }
                            </Col>
                            <Col md={6} className="content-wrapper">
                                {agent.name &&
                                <h3>{agent.name}</h3>
                                }
                                {agent.details &&
                                <span className="details" dangerouslySetInnerHTML={{__html: agent.details}}></span>
                                }
                            </Col>
                        </Col>
                    );
                });

                component.setState({
                    data: true,
                    siteData: site.data,
                    optionsData: options.data,
                    pageData: page.data[0],
                    spaces: spaces,
                    agents: agents,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    //on click of image, hide & autoplay video
    playVideo = (e) => {
        $(e.target).parents('.video-container').addClass('show-video');
        var symbol = $(e.target).siblings('.embed-responsive').find('iframe')[0].src.indexOf("?") > -1 ? "&" : "?";
        $(e.target).siblings('.embed-responsive').find('iframe')[0].src += symbol + "autoplay=1";
    }

    render() {
        if (this.state.data) {
            return (
                <div className="template-leasing">
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
                    <div className="top-copy-wrapper">
                        <img className="branches one" src={Images + 'branches1.png'} alt="branches"/>
                        <div className="container">
                            {this.state.pageData.acf.top_copy &&
                            <p className="top-copy">{this.state.pageData.acf.top_copy}</p>
                            }
                        </div>
                    </div>
                    {this.state.spaces &&
                    <div className="spaces">
                        <div className="container">
                            <h2>Spaces Available</h2>
                            {this.state.spaces}
                        </div>
                    </div>
                    }
                    {this.state.agents &&
                    <div className="leasing-agents circle-gradient-red">
                        <div className="container">
                            <h2>Leasing Agents</h2>
                            <Row className='agent-container'>{this.state.agents}</Row>
                        </div>
                    </div>
                    }

                    <div className="leasing-cta">
                        <div className='container'>
                            <Row>
                                <Col sm={6} md={3} className="image-wrapper">
                                    {this.state.pageData.acf.cta_image &&
                                    <a href={this.state.pageData.acf.cta_link} target="_blank">
                                        <img src={this.state.pageData.acf.cta_image.url}
                                             alt={this.state.pageData.acf.cta_image.alt ? this.state.pageData.acf.cta_image.alt : 'leasing call to action'}/>
                                    </a>
                                    }
                                </Col>
                                <Col sm={6} md={9} className="content-wrapper">
                                    {this.state.pageData.acf.cta_copy &&
                                    <span className="details"
                                          dangerouslySetInnerHTML={{__html: this.state.pageData.acf.cta_copy}}></span>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="featured-store-container">
                        <FeaturedRetailers
                            retailerTitle={this.state.pageData.acf.featured_retailer_title}
                            retailers={this.state.pageData.acf.featured_retailers}
                            retailerLink={this.state.pageData.acf.featured_retailer_link}
                        />
                        <FeaturedRetailers
                            retailerTitle={this.state.pageData.acf.featured_restaurant_title}
                            retailers={this.state.pageData.acf.featured_restaurants}
                            retailerLink={this.state.pageData.acf.featured_restaurant_link}
                        />
                    </div>
                    <div className="youtube-embed">
                        <div className="heading-wrapper">
                            <div className="container">
                                <h2>{this.state.pageData.acf.video_title ? this.state.pageData.acf.video_title : 'Birds Eye View'}</h2>
                            </div>
                        </div>
                        <div onClick={this.playVideo} className="video-container container">
                            {this.state.pageData.acf.video_image_overlay &&
                            <img className="video-overlay" src={this.state.pageData.acf.video_image_overlay.url}
                                 alt={this.state.pageData.acf.video_image_overlay.alt}/>
                            }
                            {this.state.pageData.acf.video_url &&
                            <ResponsiveEmbed a16by9>
                                <iframe id="video-frame" src={this.state.pageData.acf.video_url}
                                        frameborder="0"></iframe>
                            </ResponsiveEmbed>
                            }
                            {this.state.pageData.acf.video_url &&
                            <img className="playbutton" src={Images + 'plaza-playbutton.png'} alt="playbutton"/>
                            }
                        </div>
                        {this.state.pageData.acf.video_content_area &&
                        <div className='content-wrapper'>
                            <div className='container'>
                                <span className="video-copy"
                                      dangerouslySetInnerHTML={{__html: this.state.pageData.acf.video_content_area}}></span>
                            </div>
                        </div>
                        }
                    </div>
                    <EventCTA/>
                </div>
            )
        }
        return <Loader/>;
    }
}

export default Leasing;