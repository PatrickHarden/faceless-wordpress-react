// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import PageLayout from '../components/PageLayout';
import LocationHours from '../components/LocationHours';
import Signup from '../components/Signup';
import Loader from '../components/Loader';

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

                    <div className="background-color-setter">
                        <LocationHours optionsData={this.state.optionsData} siteName={this.state.siteData.name} homeData={this.state.homeData}  />
                    </div>

                    <PageLayout pageData={this.state.pageData} />
                    {this.state.enableSignup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                </div>
            );
        }
        return <Loader />;
    }
}


export default Information;
