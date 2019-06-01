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
import StoreData from '../components/StoreData.js';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const Stores = SiteURL + '/wp-json/wp/v2/stores';

class StoreSingle extends Component{
    constructor(props){
        super(props);

        this.state = {
            storeSlug: entities.decode(this.props.params.storeSlug),
            siteData: '',
            homeData: '',
            enableSignup: '',
            optionsData: '',
            pageData: '',
            heroImage: '',
            storeName: '',
            storeData: '',
            metaDescription: '',
        };
    }

    componentWillMount(){

        var component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(PropertyOptions),
                axios.get(Stores + '?slug=' + this.state.storeSlug)
            ])
            .then(axios.spread(function (site, home, options, storeData) {

                let pageData = {
                    "title": {
                        "rendered": "Directory"
                    },
                    "acf": {
                        "hero_image": options.data.acf.store_hero_image,
                        "enable_header_copy": false,
                    }
                }

                let storeData_ = storeData.data[0];
                let metaDescription;
                let useCustomMeta = storeData_.acf.use_custom_meta_description;

                if (useCustomMeta) {
                    metaDescription = storeData_.acf.meta_description;
                }
                else if(options.data.acf.use_custom_store_meta_description){
                    metaDescription = options.data.acf.custom_store_meta_description;
                    metaDescription = metaDescription.replace('%STORE%', entities.decode(storeData_.title.rendered));
                    metaDescription = metaDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    metaDescription = metaDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    metaDescription = metaDescription.replace('%CENTERNAME%', entities.decode(site.data.name));
                }
                else{
                    metaDescription = options.data.acf.meta_description;
                }

                // title meta
                let address2 = '';
                let siteName = entities.decode(site.name);

                if(siteName !== ''){
                    siteName = entities.decode(site.name) + ' | ';
                }

                if(options.data.acf.address_2 !== null || options.data.acf.address_2 !== ''){
                   address2 = options.data.acf.address_2 + ' ';
                }

                let titleDescription = entities.decode(storeData_.title.rendered) + ' | ' + siteName + options.data.acf.address_1 + ' ' + address2 + options.data.acf.city + ', ' + options.data.acf.state;
                let useCustomTitle = options.data.acf.use_custom_store_meta_title;
                
                if(useCustomTitle){
                    titleDescription = options.data.acf.custom_store_meta_title;
                    titleDescription = titleDescription.replace('%STORE%', entities.decode(storeData_.title.rendered));
                    titleDescription = titleDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    titleDescription = titleDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    titleDescription = titleDescription.replace('%CENTERNAME%', entities.decode(site.data.name));
                }

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    enableSignup: home.data[0].acf.enable_mail_signup,
                    optionsData: options.data,
                    pageData: pageData,
                    storeData: storeData_,
                    metaDescription: metaDescription,
                    titleDescription: titleDescription,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render(){
        if(this.state.data){
            return(
                <div className="store-single">
                    <Helmet
                        title={this.state.titleDescription}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />
                    <InteriorHeader pageData={this.state.pageData} secondaryTitle={entities.decode(this.state.storeData.title.rendered)} />
                    <main>
                        <StoreData
                            storeSlug={this.state.storeSlug}
                            storeName={entities.decode(this.state.storeData.title.rendered)}
                            storeData={this.state.storeData}
                            optionsData={this.state.optionsData}
                            siteData={this.state.siteData}
                        />
                    </main>
                </div>
            );
        }
        return <Loader />;
    }
}

export default StoreSingle;