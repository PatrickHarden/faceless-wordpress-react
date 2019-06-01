// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import axios from 'axios';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const StoresData = SiteURL + '/wp-json/wp/v2/stores?per_page=100';
const JobTypes = SiteURL + '/wp-json/wp/v2/job_type_category?per_page=100';

class JobsSubmission extends Component{
    constructor(props){
        super(props);
        this.jobSubmitTitle = 'Submit an Open Position';
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            data: false,
            error: false,
            jobTypes: '',
            storeData: '',
            storesList: '',
            positionTitle: '',
            positionDescription: '',
            storeName: '',
            contactInfo: '',
            jobType: ''
        };
    }

    componentWillMount(){
        let component = this;
        let data = [];

        axios.all([
            axios.get(StoresData),
            axios.get(JobTypes)
        ])
            .then(axios.spread(function(storeData, jobtype){
                let storeQueries = [];
                if(storeData.headers['x-wp-totalpages'] > 1){
                    let paginationCount = storeData.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        storeQueries.push(axios.get(StoresData + '&page=' + x));
                        x++;
                    }
                    axios.all(storeQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.handleDataResponse(data, jobtype);
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                            component.setState({
                                error: true,
                            })
                        })
                }
                else{
                    component.handleDataResponse(storeData.data, jobtype);
                }
            }))
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });
    }

    handleDataResponse(storeData, jobtypes){
        // Retrieve stores, sort alphabetically
        let sortedData = storeData.sort(function(a, b){
            let itemA = entities.decode(a.title.rendered.toUpperCase());
            let itemB = entities.decode(b.title.rendered.toUpperCase());
            return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
        });

        // Build store list
        let stores = sortedData.map(function(data){
            return(
                <option key={data.id} value={data.id}>{entities.decode(data.title.rendered)}</option>
            );
        });

        // Build Category list
        let categoryList = jobtypes.data.map(function(data){
            return(
                <option key={data.id} value={data.id}>{entities.decode(data.name)}</option>
            );
        });

        this.setState({
            data: true,
            jobTypes: categoryList,
            storesList: stores
        });
    }

    // Form Submit handler
    handleSubmit(event) {
        event.preventDefault();
        let component = this;
        let errors = false;
        $('#jobs-form-save .btn').attr("disabled", "disabled");
        $('.validation-error').remove();

        if($('#positionTitle').val().length < 1){
            $('#positionTitle').after('<div class="validation-error">* Required (Please enter a Title)</div>');
            errors = true;
        }

        if($('#positionDescription').val().length < 1){
            $('#positionDescription').after('<div class="validation-error">* Required (Please enter a Description)</div>');
            errors = true;
        }

        if(!document.getElementById("honeypot").value && !errors) {
            let dataString = $("#jobs-form-save").serialize();
            
            $.ajax({
                type: "POST",
                url: SiteURL+"/wp-admin/admin-ajax.php",
                data: dataString,
                crossDomain: true,
                dataType: 'json',
                success: function(data) {                                       
                    $('.job-submit').hide();
                    $('#jobs-submit-confirmation').html('<h3>Thank you for your submission! Your post will be reviewed for approval.</h3>').addClass('bg-success');
                },
                error: function(jqXHR, textStatus, errorThrown){                                        
                    console.error("The following error occured: " + textStatus, errorThrown);                                                   
                }                             
            });
        }else{
            //component.handleError("Honeypot detected");
            $('#jobs-form-save .btn').removeAttr("disabled");
        }
        
    }

    // Input value update handler
    handleInputChange(event) {
        let component = this;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const id = target.id;
        component.setState({
          [id]: value
        });
  }

    render(){
        if(this.state.data){
            return (
                <div className="retail-submission">
                    <div className="job-submit font-color-setter">
                        <form title={this.jobSubmitTitle} id='jobs-form-save' onSubmit={this.handleSubmit}>
                            <Grid>
                                <Row>
                                    <Col xs={12}>
                                        <h3>{this.jobSubmitTitle}</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Position Title:</b>
                                        </Col>
                                        <label for='position-title' className="col-xs-12 col-sm-6">
                                            <span className="sr-only">Position Title:</span>
                                            <input
                                                type="text"
                                                id='positionTitle'
                                                className="form-control"
                                                placeholder=''
                                                name='position-title'
                                                onChange={this.handleInputChange}
                                                value={this.state.positionTitle}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-xs-12 form-group">
                                        <label for='position-description' className="col-xs-12 col-sm-6">
                                            <b>Position Description:</b>
                                    <textarea
                                        type='textarea'
                                        id='positionDescription'
                                        className="form-control"
                                        name='position-description'
                                        onChange={this.handleInputChange}
                                        value={this.state.positionDescription}
                                    />
                                        </label>
                                    </div>
                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Store:</b>
                                        </Col>
                                        <label for="store-name" className="col-xs-12 col-sm-6">
                                            <span className="sr-only">Store Name</span>
                                            <select title="Store Name" id="storeName" name="store-name">
                                                <option value="all"></option>
                                                {this.state.storesList}
                                            </select>
                                        </label>
                                    </div>
                                    <div className="col-xs-12 form-group">
                                        <label for='contact-info' className="col-xs-12">
                                            <b>Contact Info:</b>
                                    <textarea
                                        type='textarea'
                                        id='contactInfo'
                                        className="form-control"
                                        name='contact-info'
                                        onChange={this.handleInputChange}
                                        value={this.state.contactInfo}
                                    />
                                        </label>
                                    </div>
                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Job Type:</b>
                                        </Col>
                                        <label for="job-type" className="col-xs-12 col-sm-6">
                                            <span className="sr-only">Job Type</span>
                                            <select title="Job Type" id="jobType" name="job-type">
                                                <option value="all"></option>
                                                {this.state.jobTypes}
                                            </select>
                                        </label>
                                    </div>
                                    <input type="hidden" name="action" value="save_jobs_form" />
                                    <div style={{display: 'none'}}>
                                        <label>Keep this field blank for spam filtering purposes
                                            <input type="text" name="honeypot" id="honeypot" />
                                        </label>
                                    </div>
                                    <Col xs={12} className="submit-container">
                                        <Col xs={12}>
                                            <button type="submit" className="btn btn-default background-color-setter pull-left">Submit</button>
                                        </Col>
                                    </Col>
                                </Row>
                            </Grid>

                        </form>
                    </div>
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <div id="jobs-submit-confirmation" className=""></div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
        else if(this.state.error){
            return(
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2>An error occurred retrieving the Job Sumbission form.</h2>
                            <p>Please refresh the page and try again. If this error continues, please <Link to={'/contact-us/'}>contact us</Link> and report the issue.</p>
                            <br/>
                        </Col>
                    </Row>
                </Grid>
            )
        }
        return <Loader />
    }
}

export default JobsSubmission;