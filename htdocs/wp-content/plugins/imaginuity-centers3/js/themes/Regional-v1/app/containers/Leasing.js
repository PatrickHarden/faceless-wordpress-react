// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button, Modal, Carousel, Accordion, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import GravityFrom from '../components/GravityForm';
import Loader from '../components/Loader';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages/';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class Leasing extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            optionsData: '',
            pageData: '',
            spaces: '',
            tripleCTAs: '',
            showModal: false,
        }
    }

    componentWillMount(){
        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(PropertyOptions),
                axios.get(Pages + '?slug=home'),
                axios.get(Pages + '?slug=leasing'),
            ])
            .then(axios.spread(function (site, options, home, page) {

                let spaces;

                if(page.data[0].acf.spaces_for_lease){
                    spaces = page.data[0].acf.spaces_for_lease.map(function(data, i){
                        return(
                            <Panel header={"Lot #" + data.location_number} eventKey={i} className="border-color-setter font-color-setter">
                                <dl className="dl-horizontal">
                                    <dt>Lot #</dt>
                                    <dd>{data.location_number}</dd>
                                    <dt><abbr title="Square Feet">Sq. ft.</abbr></dt>
                                    <dd>{data.square_footage}</dd>
                                    <dt>Floorplan</dt>
                                    <dd><a href={data.floorplan_url} target="_blank">{data.floorplan_url}</a></dd>
                                    <dt>Video Tour</dt>
                                    <dd><a href={data.video_tour_url} target="_blank">{data.video_tour_url}</a></dd>
                                </dl>
                                {data.images && (
                                    <Carousel id={'carousel-' + data.location_number} className="location-carousel">
                                        {data.images.map(function(data, index){
                                            return <Carousel.Item key={index}><img src={data.image} alt={"featured image " + index + " for location " + data.location_number} /></Carousel.Item>
                                        })}
                                    </Carousel>
                                )}
                            </Panel>
                        );
                    });
                }

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    pageData: page.data[0],
                    spaces: spaces,
                    tripleCTAs: page.data[0].acf.triple_ctas ? component.buildTripleCTA(page.data[0].acf.triple_ctas) : false,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    close(){
        this.setState({ showModal: false });
    }

    open(){
        this.setState({ showModal: true });
    }

    buildTripleCTA(ctaData){
        let a = new RegExp('/' + window.location.host + '/');
        let CTAs = ctaData.map((cta, i) => {
            return(
                <Col xs={12} sm={10} smOffset={1} md={4} mdOffset={0} className="cta" key={i}>
                    {cta.cta_url ? (
                        <a href={cta.cta_url} target={!a.test(cta.cta_url ? "_blank" : false)} >
                            <img src={cta.image.url} alt={cta.image.alt ? cta.image.alt : cta.image.title}/>
                        </a>
                    ) : (
                        <img src={cta.image.url} alt={cta.image.alt ? cta.image.alt : cta.image.title}/>
                    )}
                </Col>
            );
        });
        return CTAs;
    }

    externalLinkChecker(link){
        let a = new RegExp('/' + window.location.host + '/');
        if(!a.test(link)) {
            return true;
        }
    }

    render(){
        if(this.state.data) {
            return (
                <div className="template-leasing">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '')  + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    <div className="font-color-setter leasing-container">
                        {this.state.pageData.acf.enable_triple_cta &&
                        <div className="triple-cta">
                            {this.state.tripleCTAs}
                        </div>
                        }
                        <Grid>
                            <Row>
                                <Col xs={12} md={this.state.spaces ? 6 : 12}>
                                    <h3>{this.state.pageData.acf.leasing_space_title}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.pageData.acf.leasing_space_copy}} className="text-left leasing-copy"></div>
                                </Col>
                                {this.state.spaces &&
                                <Col xs={12} md={6} className="spaces">
                                    <Accordion>
                                        {this.state.spaces}
                                    </Accordion>
                                </Col>
                                }
                            </Row>
                            {this.state.pageData.acf.advantages_to_mall_leasing_link &&
                            <Row className="advantages background-color-setter-lightest border-color-setter">
                                <Col xs={12} className="col">
                                    <h2>Advantages to mall leasing</h2>
                                    <p>
                                        You want great traffic, sales, spaces, and options? Look no further!
                                        <a className="font-color-setter" href={this.state.pageData.acf.advantages_to_mall_leasing_link ? this.state.pageData.acf.advantages_to_mall_leasing_link : "/advantages-to-mall-leasing"}> Click for our stats.</a></p>
                                </Col>
                            </Row>
                            }
                            <Row className="specialty-leasing">
                                <Col xs={12} sm={this.state.pageData.acf.specialty_leasing_image ? 6 : 12}>
                                    <h3>{this.state.pageData.acf.specialty_leasing_title}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.pageData.acf.specialty_leasing_copy}}></div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    {this.state.pageData.acf.specialty_leasing_url ?
                                        (<a href={this.state.pageData.acf.specialty_leasing_url} target={this.externalLinkChecker(this.state.pageData.acf.specialty_leasing_url) ? '_blank' : ''} >
                                            {this.state.pageData.acf.specialty_leasing_image &&
                                            <img src={this.state.pageData.acf.specialty_leasing_image} alt="specialty leasing"
                                                 className="center-block img-responsive"/>
                                            }
                                        </a>) : (
                                        this.state.pageData.acf.specialty_leasing_image &&
                                        <img src={this.state.pageData.acf.specialty_leasing_image} alt="specialty leasing"
                                             className="center-block img-responsive"/>
                                    )}
                                </Col>
                            </Row>
                            {this.state.pageData.acf.leasing_contact_link &&
                            <Row className="leasing-contact border-color-setter background-color-setter-lightest">
                                <Col xs={12} className="col">
                                    <h3><a className="font-color-setter" href={this.state.pageData.acf.leasing_contact_link ? this.state.pageData.acf.leasing_contact_link : ''}>Click here to reach our leasing office</a></h3>
                                </Col>
                            </Row>
                            }
                            {this.state.pageData.acf.gravity_form ? <GravityForm gformID={this.state.pageData.acf.gravity_form}/> : null}
                        </Grid>
                    </div>
                    <FacebookPixel pageData={this.state.pageData} />
                </div>
            )
        }
        return <Loader />;
    }
}

export default Leasing;