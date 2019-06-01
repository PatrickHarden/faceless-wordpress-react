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
import StoreData from '../components/StoreData.js';
import Loader from '../components/Loader';
import FooterLinks from '../components/FooterLinks';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Stores = SiteURL + '/wp-json/wp/v2/stores';

class StoreSingle extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            storeSlug: entities.decode(this.props.params.storeSlug),
            siteData: '',
            optionsData: '',
            storeData: '',
            metaDescription: '',
            titleDescription: '',
        };
    }

    componentWillMount(){

        let component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(PropertyOptions),
                axios.get(Stores + '?slug=' + this.state.storeSlug)
            ])
            .then(axios.spread(function (site, options, storeData) {

                let metaDescription;
                let store_data = storeData.data[0];
                let useCustomMeta = store_data.acf.use_custom_meta_description; //use description from the store settings page

                if(useCustomMeta){
                    metaDescription = store_data.acf.meta_description;
                }
                else if(options.data.acf.use_custom_store_meta_description){
                    metaDescription = options.data.acf.custom_store_meta_description;
                    metaDescription = metaDescription.replace('%STORE%', entities.decode(store_data.title.rendered));
                    metaDescription = metaDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    metaDescription = metaDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    metaDescription = metaDescription.replace('%CENTERNAME%', entities.decode(site.data.name));
                }
                else{
                    metaDescription = (options.data.acf.meta_description ? options.data.acf.meta_description : '');
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

                let titleDescription = entities.decode(store_data.title.rendered) + ' | ' + siteName + options.data.acf.address_1 + ' ' + address2 + options.data.acf.city + ', ' + options.data.acf.state;
                let useCustomTitle = options.data.acf.use_custom_store_meta_title;

                if(useCustomTitle){
                    titleDescription = options.data.acf.custom_store_meta_title;
                    titleDescription = titleDescription.replace('%STORE%', entities.decode(store_data.title.rendered));
                    titleDescription = titleDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    titleDescription = titleDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    titleDescription = titleDescription.replace('%CENTERNAME%', entities.decode(site.data.name));
                }

                component.setState({
                    data: true,
                    siteData: site.data,
                    optionsData: options.data,
                    storeData: storeData.data[0],
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
                    <StoreData storeSlug={this.state.storeSlug} storeName={entities.decode(this.state.storeData.title.rendered)} storeData={this.state.storeData} optionsData={this.state.optionsData} />
                    <FooterLinks optionsData={this.state.optionsData}/>
                </div>
            );
        }
        return <Loader />;
    }
}

export default StoreSingle;