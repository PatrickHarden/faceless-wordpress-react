// Packages
import React, {Component} from 'react';
import {Link} from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import PageLayoutInformation from '../components/PageLayoutInformation';
import LocationHours from '../components/LocationHours';
import Signup from '../components/Signup';
import Loader from '../components/Loader';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class Information extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            optionsData: '',
            pageData: '',
            heroImage: '',
            navThumbnail: '',
            headerCopy: '',
            enableSignup: false
        };
    }

    componentWillMount(){
        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(Pages + '?slug=information'),
                axios.get(PropertyOptions),
            ])
            .then(axios.spread(function (site, home, informationPage, options) {

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    pageData: informationPage.data[0],
                    heroImage: informationPage.data[0].acf.hero_image,
                    navThumbnail: informationPage.data[0].acf.navigation_thumbnail,
                    headerCopy: informationPage.data[0].acf.header_copy,
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
                <div className="information" data-page="information">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    <PageLayoutInformation layout={this.state.pageData.acf.layout_type_top ? this.state.pageData.acf.layout_type_top[0] : false} />

                    {this.state.pageData.acf.enable_map_directions &&
                        <div className="map-directions">
                            <Grid>
                                <Row>
                                    <Col xs={12} className="font-color-setter">
                                        <h3>
                                            {this.state.pageData.acf.map_directions_title ? this.state.pageData.acf.map_directions_title : 'Find your way here'}
                                        </h3>
                                        {this.state.pageData.acf.map_directions_link_type === 'Internal' ? (
                                            <Link to={'/' + this.state.pageData.acf.map_directions_page.post_name} >
                                                <p>{this.state.pageData.acf.map_directions_link_text ? this.state.pageData.acf.map_directions_link_text : 'Map & Directions'}</p>
                                            </Link>
                                        ) : (
                                            <a href={this.state.pageData.acf.map_directions_page_external} target="_blank">
                                                <p>{this.state.pageData.acf.map_directions_link_text ? this.state.pageData.acf.map_directions_link_text : 'Map & Directions'}</p>
                                            </a>
                                        )}

                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    }

                    {this.state.pageData.acf.enable_location_hours &&
                        <LocationHours optionsData={this.state.optionsData} siteName={this.state.siteData.name} pageData={this.state.pageData} />
                    }

                    <PageLayoutInformation layout={this.state.pageData.acf.layout_type_bottom ? this.state.pageData.acf.layout_type_bottom[0] : false} />

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


export default Information;
