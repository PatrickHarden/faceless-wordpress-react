// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import Hours from '../components/Hours';
import StoreFilter from '../components/StoreFilter';
import Stores from '../components/StoreList';
import FeaturedEvent from '../components/FeaturedEvent';
import EventsList from '../components/EventsList';
import GoogleMapStatic from '../components/GoogleMapStatic';
import Signup from '../components/Signup';
import Loader from '../components/Loader';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const StoreCategories = SiteURL + '/wp-json/wp/v2/imag_taxonomy_store_category?per_page=100';

class Directory extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            enableSignup: '',
            optionsData: '',
            pageData: '',
            categoryData: '',
        };
    }

    componentWillMount(){
        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=directory'),
                axios.get(Pages + '?slug=home'),
                axios.get(PropertyOptions),
                axios.get(StoreCategories),
            ])
            .then(axios.spread(function (site, page, home, options, categories) {

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    enableSignup: home.data[0].acf.enable_mail_signup,
                    optionsData: options.data,
                    pageData: page.data[0],
                    heroImage: page.data[0].acf.hero_image,
                    categoryData: categories.data,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render(){
        if(this.state.data){
            return(
                <div className="template-directory" data-page="directory">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '')  + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    <span className="hidden-xs hidden-sm">
                        <Hours optionsData={this.state.optionsData} />
                    </span>

                    <StoreFilter optionsData={this.state.optionsData} categoryData={this.state.categoryData} />
                    <Stores />

                    <GoogleMapStatic optionsData={this.state.optionsData} homeData={this.state.homeData} />

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


export default Directory;
