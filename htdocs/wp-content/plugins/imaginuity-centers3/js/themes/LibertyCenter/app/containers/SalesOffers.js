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
import Sidebar from '../components/Sidebar';
import SalesList from '../components/SalesList';
import InteriorHeader from '../components/InteriorHeader';
import FooterLinks from '../components/FooterLinks';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const SalesData = SiteURL + '/wp-json/wp/v2/sales?per_page=100';
const EventCategories = SiteURL + '/wp-json/wp/v2/event_categories';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class Sales extends Component {
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
            axios.get(Pages + '?slug=sales-offers'),
            axios.get(PropertyOptions),
            axios.get(SalesData),
            axios.get(EventCategories),
        ])
            .then(axios.spread(function (site, page, options, sales) {

                console.log(sales.data[0]);

                component.setState({
                    data: true,
                    siteData: site.data,
                    optionsData: options.data,
                    pageData: page.data[0],
                    salesData: sales.data,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if (this.state.data) {
            return (
                <div className="template-sales" data-page="sales">
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
                        imageMobile={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_desktop : false}
                    />
                    <div className="container">
                        <div className="row">
                            <Sidebar pageData={this.state.pageData} optionsData={this.state.optionsData}/>
                            <SalesList salesData={this.state.salesData} pageData={this.state.pageData}/>
                        </div>
                    </div>
                    <FooterLinks optionsData={this.state.optionsData}/>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default Sales;
