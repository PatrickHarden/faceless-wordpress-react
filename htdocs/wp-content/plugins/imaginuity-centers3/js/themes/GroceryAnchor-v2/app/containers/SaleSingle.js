// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let moment = require('moment');
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import PageLayout from '../components/PageLayout';
import Signup from '../components/Signup';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const SalesData = SiteURL + '/wp-json/wp/v2/sales/';

class SalesSingle extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: false,
            sales: this.props.params.salesSlug,
            page: this.props.page,
            singleSalesData: false,
            title: '',
            siteData: '',
            homeData: '',
            salesData: '',
            optionsData: '',
            pageData: '',
            metaDescription: '',
        };
    }

    componentWillMount(){

        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(PropertyOptions),
                axios.get(Pages + '?slug=sales-offers'),
                axios.get(SalesData + '?slug=' + this.props.params.salesSlug),
            ])
            .then(axios.spread(function(site, home, options, salesPageData, pageData) {

                console.log(pageData.data[0]);

                let metaDescription;
                if(options.data.acf.use_custom_sale_meta_description){
                    metaDescription = options.data.acf.custom_sale_meta_description;
                    metaDescription = metaDescription.replace('%SALE%', entities.decode(pageData.data[0].title.rendered));
                    metaDescription = metaDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    metaDescription = metaDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    metaDescription = metaDescription.replace('%CENTERNAME%', entities.decode(site.data.name));
                }
                else{
                    metaDescription = options.data.acf.meta_description;
                }

                let content;
                if(pageData.data[0].acf.post_copy){
                    content = (pageData.data[0].acf.post_copy ? entities.decode(pageData.data[0].acf.post_copy) : '');
                }
                else{
                    content = '';
                }

                let relatedStore = (typeof pageData.data[0].acf.related_store ? pageData.data[0].acf.related_store.ID : false);
                let startDate = (pageData.data[0].acf.start_date ? moment(pageData.data[0].acf.start_date).format('M/D/YY') : 'TBD');
                let endDate = (pageData.data[0].acf.end_date ? moment(pageData.data[0].acf.end_date).format('M/D/YY') : 'TBD');
                let dateString = (startDate == 'TBD' && endDate == 'TBD' ? 'TBD' : startDate + ' - ' + endDate);
                if(startDate == endDate){
                    dateString = startDate;
                }

                let salesTitle = entities.decode(pageData.data[0].title.rendered);
                let singleSalesData =
                    <Col xs={12} data-store={relatedStore} data-category={(pageData.data[0].categories ? pageData.data[0].categories[0] : null)} id={pageData.data[0].id} className='sale font-color-setter'>
                        <Row>
                            {pageData.data[0].acf.featured_image &&
                            <Col xs={12} sm={4} className="image-container">
                                <img src={pageData.data[0].acf.featured_image} className="img-responsive" alt={salesTitle + ' feature'} />
                            </Col>
                            }
                            <Col xs={12} sm={8}>
                                <h2>
                                    {salesTitle}<br/>
                                    {relatedStore &&
                                    <Link key={pageData.data[0].acf.related_store.ID} to={'/stores/'+pageData.data[0].acf.related_store.post_name} storeID={pageData.data[0].acf.related_store.post_name}>
                                        <small>{pageData.data[0].acf.related_store.post_title}</small>
                                    </Link>
                                    }
                                </h2>
                                <p><b>Date</b>: {dateString}</p>
                                <div className="content" dangerouslySetInnerHTML={{ __html: content}}></div>
                            </Col>
                        </Row>
                    </Col>

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    pageData: salesPageData.data ? salesPageData.data[0] : false,
                    saleData: pageData.data[0],
                    singleSalesData: singleSalesData,
                    metaDescription: metaDescription,
                });

                console.log(component.state.optionsData);
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    externalLinkChecker(){
        $('a').each(function() {
            let a = new RegExp('/' + window.location.host + '/');
            if(!a.test(this.href)) {
                $(this).attr('target', '_blank');
            }
        });
    }

    render(){
        if(this.state.data){
            return (
                <section className="sale-single">
                    <Helmet
                        title={
                                entities.decode(this.state.pageData.title.rendered) +
                                ' | ' +
                                entities.decode(this.state.saleData.title.rendered) +
                                ' | ' +
                                this.state.siteData.name +
                                ' | ' +
                                this.state.optionsData.acf.address_1 +
                                ' ' +
                                (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') +
                                this.state.optionsData.acf.city +
                                ', ' +
                                this.state.optionsData.acf.state
                        }
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />
                    <InteriorHeader pageData={this.state.pageData} secondaryTitle={entities.decode(this.state.saleData.title.rendered)} />
                    {this.state.singleSalesData}
                    {this.state.homeData.acf.enable_mail_signup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    <div className="hidden">{setTimeout(this.externalLinkChecker(), 2000)}</div>
                </section>
            );
        }
        return <Loader />;
    }
}

export default SalesSingle;