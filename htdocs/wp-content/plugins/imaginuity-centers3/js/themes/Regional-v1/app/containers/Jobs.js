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
import JobsList from '../components/JobsList';
import GoogleMapStatic from '../components/GoogleMapStatic';
import Signup from '../components/Signup';
import Loader from '../components/Loader';
import JobsSubmission from '../components/JobsSubmission';
import FacebookPixel from '../components/FacebookPixel';


// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const JobsData = SiteURL + '/wp-json/wp/v2/jobs?per_page=100';

class Jobs extends Component{
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
            jobsData: '',
            categoryData: '',
        };
    }

    componentWillMount(){
        const component = this;




        axios.all([
            axios.get(JobsData),
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=jobs'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function(jobsData, site, page, home, options){

                let jobsQueries = [];
                let data = [];

                if(jobsData.headers['x-wp-totalpages'] > 1){
                    let paginationCount = jobsData.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        jobsQueries.push(axios.get(SalesData + '&page=' + x));
                        x++;
                    }
                    axios.all(jobsQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.setJobsData(jobsData, site, home, options, page);
                        })
                        .catch((err) => {
                            console.log('error in jobsQueries');
                            console.log(err);
                        })
                }
                else{
                    data = jobsData.data;
                    component.setJobsData(jobsData, site, home, options, page);
                }

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    setJobsData(jobs, site, home, options, page){
        this.setState({
            data: true,
            siteData: site.data,
            homeData: home.data[0],
            enableSignup: home.data[0].acf.enable_mail_signup,
            optionsData: options.data,
            pageData: page.data[0],
            heroImage: page.data[0].acf.hero_image,
            jobData: jobs.data,
        });
    }

    render(){
        if(this.state.data){
            return(
                <div className="template-jobs" data-page="jobs">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '')  + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    <JobsList jobsData={this.state.jobData} />

                    {this.state.optionsData.acf.enable_job_submissions &&
                    <div className="submission-button">
                        <p className="text-uppercase font-color-setter">Retailers:</p>
                        <Link to={'/job-submission/'}
                              className="btn border-color-setter font-color-setter text-uppercase">Post a Job</Link>
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
                            <h2>An error occurred retrieving the Jobs.</h2>
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

export default Jobs;
