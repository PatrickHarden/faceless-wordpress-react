// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import Loader from '../components/Loader';
import InteriorHeader from '../components/InteriorHeader';
import Map from '../components/MapplicMap';
import PageLayout from '../components/PageLayout';
import Signup from '../components/Signup';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class InteractiveMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            optionsData: '',
            pageData: '',
        };
    }

    componentWillMount(){
        const component = this;
        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(Pages + '?slug=interactive-map'),
                axios.get(PropertyOptions),
            ])
            .then(axios.spread(function (site, home, pageData, options) {

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    pageData: pageData.data[0],
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if(this.state.data){
            return (
                <div className="template-interactive-map" data-page="interactive-map">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />
                    <InteriorHeader pageData={this.state.pageData} />
                    <PageLayout pageData={this.state.pageData} />
                    <Map />
                    {this.state.homeData.acf.enable_mail_signup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }

                </div>
            );
        }
        return <Loader />;
    }
}

export default InteractiveMap;
