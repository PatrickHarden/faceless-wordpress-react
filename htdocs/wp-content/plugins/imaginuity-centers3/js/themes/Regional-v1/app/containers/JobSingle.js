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
import GoogleMapStatic from '../components/GoogleMapStatic';
import Signup from '../components/Signup';
import Loader from '../components/Loader';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const jobsData = SiteURL + '/wp-json/wp/v2/jobs/';

class JobSingle extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: false,
            job: this.props.params.jobSlug,
            page: this.props.page,
            jobData: false,
            title: '',
            siteData: '',
            homeData: '',
            jobPageData: '',
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
                axios.get(Pages + '?slug=jobs'),
                axios.get(jobsData + '?slug=' + this.props.params.jobSlug),
            ])
            .then(axios.spread(function(site, home, options, jobPageData, pageData) {

                let pageData_ = pageData.data[0];
                let metaDescription;
                let useCustomMeta = pageData_.acf.use_custom_meta_description;

                if (useCustomMeta) {
                    metaDescription = pageData_.acf.meta_description;
                }
                else if(options.data.acf.use_custom_job_meta_description){
                    metaDescription = options.data.acf.custom_job_meta_description;
                    metaDescription = metaDescription.replace('%JOB%', entities.decode(pageData_.title.rendered));
                    metaDescription = metaDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    metaDescription = metaDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    metaDescription = metaDescription.replace('%CENTERNAME%', entities.decode(site.name));
                }
                else{
                    metaDescription = options.data.acf.meta_description;
                }

                let content;
                if(pageData_.acf.listing_copy){
                    content = (pageData_.acf.listing_copy ? entities.decode(pageData_.acf.listing_copy) : '');
                }
                else{
                    content = '';
                }

                let relatedStore = (pageData_.acf.related_store ? pageData_.acf.related_store.ID : false);

                let jobTitle = entities.decode(pageData_.title.rendered);
                let jobData =
                    <Col xs={12} className='job font-color-setter'>
                        <Row>
                            <Col xs={12} sm={6} smOffset={2}>
                                <h2>
                                    {jobTitle}<br/>
                                    {relatedStore &&
                                    <Link key={pageData_.acf.related_store.ID} to={'/stores/'+pageData_.acf.related_store.post_name+'/'} storeID={pageData_.acf.related_store.post_name}>
                                        <small>{pageData_.acf.related_store.post_title}</small>
                                    </Link>
                                    }
                                </h2>
                                <div className="content" dangerouslySetInnerHTML={{ __html: content}}></div>
                                <div className="content" dangerouslySetInnerHTML={{ __html: entities.decode(pageData_.acf.contact_info)}}></div>
                            </Col>
                        </Row>
                    </Col>

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    jobPageData: jobPageData.data[0],
                    pageData: pageData_,
                    jobData: jobData,
                    metaDescription: metaDescription,
                });

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
                <section className="job-single">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.jobPageData} secondaryTitle={this.state.pageData.title.rendered} />

                    {this.state.jobData}

                    <GoogleMapStatic optionsData={this.state.optionsData} homeData={this.state.homeData} />

                    {this.state.homeData.acf.enable_mail_signup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                    <FacebookPixel pageData={this.state.pageData} />
                </section>
            );
        }
        return <Loader />;
    }
}

export default JobSingle;