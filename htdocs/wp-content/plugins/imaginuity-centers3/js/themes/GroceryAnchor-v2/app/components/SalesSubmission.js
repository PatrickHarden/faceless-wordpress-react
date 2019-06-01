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
const SaleTypes = SiteURL + '/wp-json/wp/v2/sales_categories?per_page=100';

class SalesSubmission extends Component{
    constructor(props){
        super(props);
        this.saleSubmitTitle = 'Submit a new sale';
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            data: false,
            saleTypes: '',
            storeData: '',
            storesList: '',
            saleTitle: '',
            featuredImage: '',
            saleDescription: '',
            storeName: '',
            contactInfo: '',
            saleType: ''
        };
    }

    componentWillMount(){
        var component = this;
        var globalStores = [];
        var globalStoreList = [];
        var sortedData;
        var data;

        axios.all([
                axios.get(StoresData),
                axios.get(SaleTypes)
            ])
            .then(axios.spread(function (response1, response2, saletypes) {

                // Retrieve stores, sort alphabetically
                sortedData = storeData.data.sort(function(a, b){
                    var itemA = entities.decode(a.title.rendered.toUpperCase());
                    var itemB = entities.decode(b.title.rendered.toUpperCase());
                    return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
                });

                // Build store list
                let stores = sortedData.map(function(data){
                    return(
                        <option key={data.id} value={data.id}>{entities.decode(data.title.rendered)}</option>
                    );
                });

                // Build Category list
                let categoryList = saletypes.data.map(function(data){
                    return(
                        <option key={data.id} value={data.id}>{entities.decode(data.name)}</option>
                    );
                });

                component.setState({
                    data: true,
                    saleTypes: categoryList,
                    storesList: stores
                });

            }))
            .catch((err) => {
                console.log(err);
            });
    }

    // Form Submit handler
    handleSubmit(sale) {
        sale.preventDefault();
        var component = this;
        var errors = false;
        $('#sales-form-save .btn').attr("disabled", "disabled");
        $('.validation-error').remove();

        if($('#saleTitle').val().length < 1){
            $('#saleTitle').after('<div class="validation-error">* Required (Please enter a Title)</div>');
            errors = true;
        }

        if($('#saleDescription').val().length < 1){
            $('#saleDescription').after('<div class="validation-error">* Required (Please enter a Description)</div>');
            errors = true;
        }

        if(!document.getElementById("honeypot").value && !errors) {
            var dataString = $("#sales-form-save").get(0);
            var dataStringNew = new FormData( dataString )
            
            $.ajax({
                type: "POST",
                url: SiteURL+"/wp-admin/admin-ajax.php",
                data: new FormData( dataString ),
                processData: false,
                contentType: false, 
                crossDomain: true,
                dataType: 'json',
                success: function(data) {                                       
                    $('.sale-submit').hide();
                    $('#sales-submit-confirmation').html('<h3>Thank you for your submission! Your post will be reviewed for approval.</h3>').addClass('bg-success');
                },
                error: function(jqXHR, textStatus, errorThrown){                                        
                    console.error("The following error occured: " + textStatus, errorThrown);                                                   
                }                             
            });
        }else{
            $('#sales-form-save .btn').removeAttr("disabled");
            //component.handleError("Honeypot detected");
        }
        
    }

    // Input value update handler
    handleInputChange(event) {
        var component = this;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const id = target.id;
        component.setState({
          [id]: value
        });
    }

    // Date update handler
    handleDateTimeChange(newDate, stateName) {
        let component = this;
        newDate = moment.unix(newDate/1000).format('MM/DD/YYYY');
        component.setState({
          [stateName]: newDate
        });
        //this.refs.calendar.closeCalendar();
    }

    render(){
        if(this.state.data){
            return (
                <div className="retail-submission">
                    <div className="sale-submit font-color-setter">
                        <form title={this.saleSubmitTitle} id='sales-form-save' onSubmit={this.handleSubmit} encType="multipart/form-data">
                            <Grid>
                                <Row>
                                    <Col xs={12}>
                                        <h3>{this.saleSubmitTitle}</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Sale Title:</b>
                                        </Col>
                                        <label for='sale-title' className="col-xs-12 col-md-8">
                                            <span className="sr-only">Sale Title:</span>
                                            <input
                                                type="text"
                                                id='saleTitle'
                                                className="form-control"
                                                placeholder=''
                                                name='sale-title'
                                                onChange={this.handleInputChange}
                                                value={this.state.saleTitle}
                                            />
                                        </label>
                                    </div>
                                    
                                    <div className="col-xs-12 col-md-6 form-group">
                                        <Col xs={12}>
                                            <b>Start Date:</b>
                                        </Col>
                                        <label for='start-date' className="col-xs-12">
                                            <span className="sr-only">Start Date:</span>
                                            <Datetime
                                                inputProps={{ id: 'startDate', name: 'start-date'} }
                                                dateFormat="MM/DD/YYYY"
                                                timeFormat={false}
                                                onChange={(newDate) => {this.handleDateTimeChange(newDate, 'startDate')}} value={this.state.startDate}
                                                closeOnSelect={true} />
                                        </label>
                                    </div>
                                    
                                    <div className="col-xs-12 col-md-6 form-group">
                                        <Col xs={12}>
                                            <b>End Date:</b>
                                        </Col>
                                        <label for='end-date' className="col-xs-12">
                                            <span className="sr-only">End Date:</span>
                                            <Datetime
                                                inputProps={{ id: 'endDate', name: 'end-date'} } dateFormat="MM/DD/YYYY"
                                                timeFormat={false}
                                                onChange={(newDate) => {this.handleDateTimeChange(newDate, 'endDate')}}
                                                value={this.state.endDate} closeOnSelect={true}/>
                                        </label>
                                    </div>

                                    <div className="col-xs-12 form-group">
                                        <Col xs={12}>
                                            <b>Featured Image:</b>
                                        </Col>
                                        <label for='media-upload' className="col-xs-12 col-sm-4">
                                            <span className="sr-only">Featured Image:</span>
                                            <input
                                                type="file"
                                                id='featuredImage'
                                                className="form-control"
                                                placeholder=''
                                                name='media-upload'
                                                onChange={this.handleInputChange}
                                                multiple="false"
                                            />
                                        </label>
                                    </div>
                                    
                                    <div className="col-xs-12 form-group">
                                        <label for='sale-description' className="col-xs-12 col-sm-8">
                                            <b>Sale Description:</b>
                                    <textarea
                                        type='textarea'
                                        id='saleDescription'
                                        className="form-control"
                                        name='sale-description'
                                        onChange={this.handleInputChange}
                                        value={this.state.saleDescription}
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
                                    {this.state.saleTypes.length > 0 && 
                                        <div className="col-xs-12 form-group">
                                            <Col xs={12}>
                                                <b>Sale Type:</b>
                                            </Col>
                                            <label for="sale-type" className="col-xs-12">
                                                <span className="sr-only">Sale Type</span>
                                                <select title="Sale Type" id="saleType" name="sale-type">
                                                    <option value="all"></option>
                                                    {this.state.saleTypes}
                                                </select>
                                            </label>
                                        </div>
                                    }
                                    <input type="hidden" name="action" value="save_sale_form" />
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
                                <div id="sales-submit-confirmation" className=""></div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
        return <Loader />
    }
}

export default SalesSubmission;