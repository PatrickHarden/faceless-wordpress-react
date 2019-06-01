// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import Hours from '../components/Hours';
import InteriorHeader from '../components/InteriorHeader';
import PageLayout from '../components/PageLayout';
import GoogleMapStatic from '../components/GoogleMapStatic';
import Signup from '../components/Signup';
import Loader from '../components/Loader';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class HoursDirections extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            optionsData: '',
            pageData: '',
            heroImage: '',
            enableSignup: false
        };
    }

    componentWillMount(){
        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(Pages + '?slug=hours-directions'),
                axios.get(PropertyOptions),
            ])
            .then(axios.spread(function (site, home, page, options) {

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    pageData: page.data[0],
                    heroImage: page.data[0].acf.hero_image,
                    enableSignup: home.data[0].acf.enable_mail_signup,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render(){
        if(this.state.data){
            return(
                <div className="template-hours-directions" data-page="hours-directions">

                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    <span className="hidden-xs hidden-sm">
                        <Hours optionsData={this.state.optionsData} />
                    </span>

                    <GoogleMapStatic optionsData={this.state.optionsData} homeData={this.state.homeData} />
                    
                    <Grid>
                        <Row>
                            <Col xs={12} className="font-color-setter text-center title-section">
                                <h2>Directions</h2>
                                <p>{this.state.optionsData.acf.address_1} / {this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' /': ''} {this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state + ' ' + this.state.optionsData.acf.zip}</p>
                                <p>{this.state.optionsData.acf.phone}</p>
                            </Col>
                        </Row>
                    </Grid>

                    <PageLayout pageData={this.state.pageData} />

                    {this.state.enableSignup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    <FacebookPixel pageData={this.state.pageData} />
                </div>
            );
        }
        return <Loader />;
    }
}


export default HoursDirections;
