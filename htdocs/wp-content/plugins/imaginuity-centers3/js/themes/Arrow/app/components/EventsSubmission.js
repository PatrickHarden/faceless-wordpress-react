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
let Datetime = require('react-datetime');

// Components
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const StoresData = SiteURL + '/wp-json/wp/v2/stores?per_page=100';
const EventTypes = SiteURL + '/wp-json/wp/v2/event_categories?per_page=100';

class EventsSubmission extends Component{
    constructor(props){
        super(props);
        this.eventSubmitTitle = 'Submit a new event';
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateTimeChange = this.handleDateTimeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            data: false,
            error: false,
            eventTypes: '',
            storeData: '',
            storesList: '',
            eventTitle: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            featuredImage: '',
            eventDescription: '',
            storeName: '',
            contactInfo: '',
            eventType: ''
        };
    }

    componentWillMount(){
        let component = this;
        let data = [];

        axios.all([
            axios.get(StoresData),
            axios.get(EventTypes)
        ])
            .then(axios.spread(function(storeData, eventtype){
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
                            component.handleDataResponse(data, eventtype);
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
                    component.handleDataResponse(storeData.data, eventtype);
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

    handleDataResponse(storeData, eventtypes){
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
        let categoryList = eventtypes.data.map(function(data){
            return(
                <option key={data.id} value={data.id}>{entities.decode(data.name)}</option>
            );
        });

        this.setState({
            data: true,
            eventTypes: categoryList,
            storesList: stores
        });
    }

    // Form Submit handler
    handleSubmit(event) {
        event.preventDefault();
        let component = this;
        let errors = false;

        if($('#featuredImage').val() === ""){
            $('#featuredImage').remove();
        }

        $('#events-form-save .btn').attr("disabled", "disabled");
        $('.validation-error').remove();

        if($('#eventTitle').val().length < 1){
            $('#eventTitle').after('<div class="validation-error">* Required (Please enter a Title)</div>');
            errors = true;
        }

        if($('#eventDescription').val().length < 1){
            $('#eventDescription').after('<div class="validation-error">* Required (Please enter a Description)</div>');
            errors = true;
        }

        if(!document.getElementById("honeypot").value && !errors) {
            let dataString = $("#events-form-save").get(0);
            let dataStringNew = new FormData( dataString )

            $.ajax({
                type: "POST",
                url: SiteURL+"/wp-admin/admin-ajax.php",
                data: new FormData( dataString ),
                processData: false,
                contentType: false,
                crossDomain: true,
                dataType: 'json',
                success: function(data) {
                    $('.event-submit').hide();
                    $('#events-submit-confirmation').html('<h3>Thank you for your submission! Your post will be reviewed for approval.</h3>').addClass('bg-success');
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.error("The following error occured: " + textStatus, errorThrown);
                }
            });
        }else{
            $('#events-form-save .btn').removeAttr("disabled");
            //component.handleError("Honeypot detected");
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

    // Date update handler
    handleDateTimeChange(newDate, stateName, returnedFormat) {
        let component = this;
        let returnFormat = (returnedFormat === 'time')? 'hh:mm:ss a' : 'MM/DD/YYYY';
        newDate = moment.unix(newDate/1000).format(returnFormat);
        component.setState({
          [stateName]: newDate
        });
    }

    render(){
        if(this.state.data){
            return (
                <div className="retail-submission">
                    <div className="event-submit font-color-setter">
                        <form title={this.eventSubmitTitle} id='events-form-save' onSubmit={this.handleSubmit} encType="multipart/form-data">
                            <Grid>
                                <Row>
                                    <Col xs={12}>
                                        <h3>{this.eventSubmitTitle}</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Event Title:</b>
                                        </Col>
                                        <label for='event-title' className="col-xs-12 col-sm-6">
                                            <span className="sr-only">Event Title:</span>
                                            <input
                                                type="text"
                                                id='eventTitle'
                                                className="form-control"
                                                placeholder=''
                                                name='event-title'
                                                onChange={this.handleInputChange}
                                                value={this.state.eventTitle}
                                            />
                                        </label>
                                    </div>
                                    
                                    <div className="col-xs-12 col-sm-6 form-group">
                                        <Col xs={12}>
                                            <b>Start Date:</b>
                                        </Col>
                                        <label for='start-date' className="col-xs-12">
                                            <span className="sr-only">Start Date:</span>
                                            <Datetime inputProps={{ id: 'startDate', name: 'start-date'} } dateFormat="MM/DD/YYYY" timeFormat={false} onChange={(newDate) => {this.handleDateTimeChange(newDate, 'startDate', 'date')}} value={this.state.startDate} closeOnSelect={true} />
                                        </label>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 form-group">
                                        <Col xs={12}>
                                            <b>Start Time:</b>
                                        </Col>
                                        <label for='start-time' className="col-xs-12">
                                            <span className="sr-only">Start Time:</span>
                                            <Datetime inputProps={{ id: 'startTime', name: 'start-time'}} dateFormat={false} onChange={(newDate) => {this.handleDateTimeChange(newDate, 'startTime', 'time')}} />
                                        </label>
                                    </div>
                                    
                                    <div className="col-xs-12 col-sm-6 form-group">
                                        <Col xs={12}>
                                            <b>End Date:</b>
                                        </Col>
                                        <label for='end-date' className="col-xs-12">
                                            <span className="sr-only">End Date:</span>
                                            <Datetime inputProps={{ id: 'endDate', name: 'end-date'} } dateFormat="MM/DD/YYYY" timeFormat={false} onChange={(newDate) => {this.handleDateTimeChange(newDate, 'endDate', 'date')}} value={this.state.endDate} closeOnSelect={true} />
                                        </label>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 form-group">
                                        <Col xs={12}>
                                            <b>End Time:</b>
                                        </Col>
                                        <label for='end-time' className="col-xs-12">
                                            <span className="sr-only">End Time:</span>
                                            <Datetime inputProps={{ id: 'endTime', name: 'end-time'} } dateFormat={false} onChange={(newDate) => {this.handleDateTimeChange(newDate, 'endTime', 'time')}} />
                                        </label>
                                    </div>

                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Featured Image:</b>
                                        </Col>
                                        <label for='media-upload' className="col-xs-12 col-sm-6">
                                            <span className="sr-only">Featured Image:</span>
                                            <input
                                                type="file"
                                                id='featuredImage'
                                                className="form-control"
                                                placeholder=''
                                                name='media-upload'
                                                onChange={this.handleInputChange}
                                                multiple={false}
                                            />
                                        </label>
                                    </div>
                                    
                                    <div className="col-xs-12 form-group">
                                        <label for='event-description' className="col-xs-12 col-md-6">
                                            <b>Event Description:</b>
                                            <textarea
                                                type='textarea'
                                                id='eventDescription'
                                                className="form-control"
                                                name='event-description'
                                                onChange={this.handleInputChange}
                                                value={this.state.eventDescription}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Store:</b>
                                        </Col>
                                        <label for="store-name" className="col-xs-12 col-md-6">
                                            <span className="sr-only">Store Name</span>
                                            <select title="Store Name" id="storeName" name="store-name">
                                                <option value="all"></option>
                                                {this.state.storesList}
                                            </select>
                                        </label>
                                    </div>
                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Event Type:</b>
                                        </Col>
                                        <label for="event-type" className="col-xs-12 col-sm-6">
                                            <span className="sr-only">Event Type</span>
                                            <select title="Event Type" id="eventType" name="event-type">
                                                <option value="all"></option>
                                                {this.state.eventTypes}
                                            </select>
                                        </label>
                                    </div>
                                    <input type="hidden" name="action" value="save_event_form" />
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
                                <div id="events-submit-confirmation" className=""></div>
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
                            <h2>An error occurred retrieving the Event Submission form.</h2>
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

export default EventsSubmission;