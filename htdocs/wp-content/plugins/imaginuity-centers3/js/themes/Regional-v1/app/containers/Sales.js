// Packages
import React, {PropTypes, Component} from 'react';
import { Link} from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import Hours from '../components/Hours';
import FeaturedSale from '../components/FeaturedSale';
import SalesList from '../components/SalesList';
import GoogleMapStatic from '../components/GoogleMapStatic';
import Signup from '../components/Signup';
import Loader from '../components/Loader';
import SalesSubmission from '../components/SalesSubmission';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const SalesData = SiteURL + '/wp-json/wp/v2/sales?per_page=100';

class Sales extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            error: false,
            siteData: '',
            homeData: '',
            enableSignup: '',
            optionsData: '',
            pageData: '',
            heroImage: '',
            salesData: '',
        };
    }

    componentWillMount(){
        const component = this;

        axios.all([
            axios.get(SalesData),
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=sales-offers'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function(salesData, site, page, home, options){

                let salesQueries = [];
                let data = [];

                if(salesData.headers['x-wp-totalpages'] > 1){
                    let paginationCount = salesData.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        salesQueries.push(axios.get(SalesData + '&page=' + x));
                        x++;
                    }
                    axios.all(salesQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.setSalesData(salesData, site, home, options, page);
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                        })
                }
                else{
                    data = salesData.data;
                    component.setSalesData(salesData, site, home, options, page);
                }

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    setSalesData(sales, site, home, options, page){
        this.setState({
            data: true,
            siteData: site.data,
            homeData: home.data[0],
            enableSignup: home.data[0].acf.enable_mail_signup,
            optionsData: options.data,
            pageData: page.data[0],
            heroImage: page.data[0].acf.hero_image,
            salesData: sales.data,
        });
    }

    render(){
        if(this.state.data){
            return(
                <div className="template-sales" data-page="sales">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 : '') + ' ' + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    {this.state.pageData.acf.enable_featured_sale &&
                    <FeaturedSale saleData={this.state.pageData} />
                    }

                    <SalesList salesData={this.state.salesData} pageData={this.state.pageData} />

                    {this.state.optionsData.acf.enable_sales_submissions &&
                    <div className="submission-button">
                        <p className="text-uppercase font-color-setter">Retailers:</p>
                        <Link to={'/sale-submission/'}
                              className="btn border-color-setter font-color-setter text-uppercase">Post a Sale</Link>
                    </div>
                    }

                    <GoogleMapStatic optionsData={this.state.optionsData} homeData={this.state.homeData} />

                    {this.state.enableSignup &&
                    <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    <FacebookPixel pageData={this.state.pageData} />
                </div>
            );
        }
        else if(this.state.error){
            return(
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2>An error occurred retrieving the Sales.</h2>
                            <p>Please refresh the page and try again. If this error continues, please <Link to={'/contact-us'}>contact us</Link> and report the issue.</p>
                            <br/>
                        </Col>
                    </Row>
                </Grid>
            )
        }
        return <Loader />;
    }
}


export default Sales;
