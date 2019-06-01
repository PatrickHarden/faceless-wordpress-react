// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import CryptoJS from 'crypto-js';

//Component
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class GravityForm extends Component{
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            data: false,
            gformTitle: '',
            fields: '',
            fieldList: '',
            value: '',
            confirmation: '',
        };
    }

    componentDidMount() {
        // assign top-level component scope
        let component = this;
        if (this.props.gformID) {
            $.ajax({
                url: PropertyOptions,
                type: 'GET',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
                },
                dataType: 'json',
                success: function (data) {

                    (data.acf.public_api_key === false ? console.log('gForm public key invalid') : null);
                    (data.acf.private_api_key === false ? console.log('gForm private key invalid') : null);
                    component.setState({
                        publicKey: data.acf.public_api_key,
                        privateKey: data.acf.private_api_key
                    });
                    // Build an authentication url using Gravity Forms Web API
                    let signature = component.gformAuth(component.props.gformID, data.acf.public_api_key, data.acf.private_api_key, "GET");
                    let gformURL = SiteURL + '/gravityformsapi/forms/' + component.props.gformID + '?api_key=' + data.acf.public_api_key + '&signature=' + signature;
                    $.ajax({
                        url: gformURL,
                        type: 'GET',
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
                        },
                        dataType: 'json',
                        success: function (data) {
                            let title = data.response.title;
                            if (data.status == 200) {
                                let fields = data.response.fields.map(function (field) {
                                    // Create input type based off gForm Web API response, as well as accompanying state variable to match
                                    {
                                        console.log(field);
                                        switch (field.type) {
                                            case 'name':
                                            case 'address':
                                                return (
                                                    <div
                                                        className={"col-xs-12 form-group" + (field.isRequired ? ' required' : '') + ' type-' + field.type}
                                                        id={"group-" + field.id}
                                                        data-name={field.label}
                                                    >
                                                        <Row>
                                                            {field.inputs.map(function (input) {
                                                                if (!input.isHidden) {
                                                                    return (
                                                                        <label for={input.id}
                                                                               className="col-xs-12 col-sm-6">
                                                                            <span className="sr-only">{input.label}</span>
                                                                            <input
                                                                                type="text"
                                                                                id={input.id}
                                                                                className={"form-control" + (field.cssClass ? ' ' + field.cssClass : '')}
                                                                                placeholder={input.label + (field.isRequired ? '*' : '')}
                                                                                name={input.label + input.id}
                                                                                value={component.state[input.id]}
                                                                                onChange={component.handleInputChange}
                                                                                required={input.isRequired}
                                                                            />
                                                                        </label>
                                                                    );
                                                                }
                                                            })}
                                                        </Row>
                                                    </div>
                                                );
                                            case 'textarea':
                                                return (
                                                    <div
                                                        className={"col-xs-12 form-group" + (field.isRequired ? ' required' : '') + ' type-' + field.type}
                                                        id={"group-" + field.id}
                                                        data-name={field.label}
                                                    >
                                                        <div className="row">
                                                            <label for={field.label} className="col-xs-12">
                                                            <textarea
                                                                type={field.type}
                                                                id={field.id}
                                                                className="form-control"
                                                                name={field.label}
                                                                placeholder={field.label + (field.isRequired ? '*' : '')}
                                                                value={component.state[field.id]}
                                                                onChange={component.handleInputChange}
                                                                required={field.isRequired}
                                                            />
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                            case 'select':
                                                return (
                                                    <div
                                                        className={"col-xs-12 form-group" + (field.isRequired ? ' required' : '') + ' type-' + field.type}
                                                        id={"group-" + field.id}
                                                        data-name={field.label}
                                                    >
                                                        <div className="row">

                                                            <Col xs={12}>
                                                                <label for={field.label}>
                                                                    <b>{field.label + (field.isRequired ? '*' : '')}</b><br/>
                                                                    <select
                                                                        className="form-control"
                                                                        type={field.type}
                                                                        id={field.id}
                                                                        name={field.label}
                                                                        value={component.state[field.id]}
                                                                        onChange={component.handleInputChange}
                                                                        required={field.isRequired}
                                                                    >
                                                                        <option value="none-selected">-</option>
                                                                        {field.choices.map(function (choice) {
                                                                            return (<option
                                                                                value={choice.value}>{choice.text}</option>);
                                                                        })}
                                                                    </select>
                                                                </label>
                                                            </Col>
                                                        </div>
                                                    </div>
                                                );
                                            case 'checkbox':
                                                return (
                                                    <div
                                                        className={"col-xs-12 form-group checkbox-group" + (field.isRequired ? ' required' : '') + ' type-' + field.type}
                                                        id={"group-" + field.id}
                                                        data-name={field.label}
                                                    >
                                                        <div className="row">
                                                            <Col xs={12}>
                                                                <b>{field.label + (field.isRequired ? '*' : '')}</b>
                                                                {field.inputs.map(function (choice) {
                                                                    return (
                                                                        <div className="checkbox">
                                                                            <label for={field.label}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id={choice.id}
                                                                                    name={field.id}
                                                                                    value={choice.label}
                                                                                    onChange={component.handleInputChange}
                                                                                />
                                                                                {choice.label}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </Col>
                                                        </div>
                                                    </div>
                                                );
                                            case 'radio':
                                                return (
                                                    <div
                                                        className={"col-xs-12 form-group" + (field.isRequired ? ' required' : '') + ' type-' + field.type}
                                                        id={"group-" + field.id}
                                                        data-name={field.label}
                                                    >
                                                        <div className="row">
                                                            <Col xs={12}>
                                                                <b>{field.label}</b>
                                                                {field.choices.map(function (choice) {
                                                                    return (
                                                                        <div className="radio">
                                                                            <label for={field.label}>
                                                                                <input
                                                                                    type="radio"
                                                                                    id={field.id}
                                                                                    name={field.label}
                                                                                    value={choice.value}
                                                                                    onChange={component.handleInputChange}
                                                                                    required={field.isRequired}
                                                                                />
                                                                                {choice.text}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </Col>
                                                        </div>
                                                    </div>
                                                );
                                            case 'html':
                                                return (
                                                    <div
                                                        className={"col-xs-12 form-group" + ' type-' + field.type}
                                                        id={"group-" + field.id}
                                                        data-name={field.label}
                                                    >
                                                        <div className="row">
                                                            <Col
                                                                xs={12}
                                                                dangerouslySetInnerHTML={{__html: field.content}}></Col>
                                                        </div>
                                                    </div>
                                                );
                                            case 'time':
                                                return (
                                                    <div
                                                        className={"col-xs-12 form-group" + (field.size !== 'large' ? ' col-sm-6' : '') + (field.isRequired ? ' required' : '') + ' type-' + field.type}
                                                        id={"group-" + field.id}
                                                        data-name={field.label}
                                                    >
                                                        <div className="row">
                                                            <label for={field.id} className="col-xs-12">
                                                                <b>{field.label + (field.isRequired ? '*' : '')}</b>
                                                                <input
                                                                    type="text"
                                                                    id={field.id}
                                                                    className="form-control"
                                                                    name={field.label}
                                                                    value={component.state[field.id]}
                                                                    onChange={component.handleInputChange}
                                                                    required={field.isRequired}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                            default:
                                                return (
                                                    <div
                                                        className={"col-xs-12 form-group" + (field.size !== 'large' ? ' col-sm-6' : '') + (field.isRequired ? ' required' : '') + ' type-' + field.type}
                                                        id={"group-" + field.id}
                                                        data-name={field.label}
                                                    >
                                                        <div className="row">
                                                            <label for={field.id} className="col-xs-12">
                                                                {field.type === 'date' &&
                                                                <b>{field.label + (field.isRequired ? '*' : '')}</b>
                                                                }
                                                                <input
                                                                    type={field.type}
                                                                    id={field.id}
                                                                    className="form-control"
                                                                    name={field.label}
                                                                    placeholder={field.label + (field.isRequired ? '*' : '')}
                                                                    value={component.state[field.id]}
                                                                    onChange={component.handleInputChange}
                                                                    required={field.isRequired}
                                                                />
                                                                <span className="sr-only">{field.label}</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                        }
                                    }
                                });

                                // Build a list of fields, to be referenced for values/submissions
                                let fieldList = [];
                                data.response.fields.map(function (field) {
                                    if (field.inputs) {
                                        let inputs = field.inputs.map(function (input, index) {
                                            let inputID;
                                            if (input.id) {
                                                inputID = input.id.toString();
                                            } else {
                                                inputID = field.id + '_' + index.toString();
                                            }
                                            return inputID.toString();
                                        });
                                        inputs.map(function (data) {
                                            fieldList.push(data);
                                        });
                                    }
                                    else {
                                        fieldList.push(field.id.toString());
                                    }
                                });

                                let confirmation = (data.response.confirmations ? data.response.confirmation_message : 'Thanks for contacting us! We will get in touch with you shortly.');

                                component.setState({
                                    gformTitle: title,
                                    fields: fields,
                                    fieldList: fieldList,
                                    confirmation: confirmation,
                                    data: true,
                                });
                            } else {
                                return 'The requested form is not available.';
                            }
                        },
                        error: function (jqXHR, textStatus) {
                            component.handleError('An error occurred with the ajax call to retrieve the GravityForm fields');
                            console.log(jqXHR);
                            console.log(textStatus);
                        }
                    });
                },
                error: function (jqXHR, textStatus) {
                    component.handleError('There was an error retrieving the GravityForms fields.');
                    console.log(jqXHR);
                    console.log(textStatus);
                }
            });
        }
    }

    gformAuth(gform, pubkey, privkey, ajaxMethod){
        // Generate an HMAC SHA1 hash, then convert it to a URL-encoded base64 string.
        // One of these authentication URLs must be generated to:
        //      1) to retrieve a list of form IDs based on the form name (this.props.gformTitle)
        //      2) to retrieve the fields and variables associated with the specified form
        function CalculateSig(stringToSign, privateKey){
            let hash = CryptoJS.HmacSHA1(stringToSign, privateKey);
            let base64 = hash.toString(CryptoJS.enc.Base64);
            return encodeURIComponent(base64);
        }

        let d = new Date,
            expiration = 3600, // 1 hour
            unixtime = parseInt(d.getTime() / 1000),
            future_unixtime = unixtime + expiration,
            route = "forms/" + gform;

        let stringToSign = pubkey + ":" + ajaxMethod + ":" + route + ":" + future_unixtime;
        let sig = CalculateSig(stringToSign, privkey);
        return sig + '&expires=' + future_unixtime;
    }

    // Input value update handler
    handleInputChange(event) {
        let target = event.target;
        let value = target.value; //target.type === 'checkbox' ? target.checked :
        let id = target.id;
        // Create state variable that holds the value of a corresponding input ID
        let newState = {};
        newState[id] = value;
        this.setState(newState);

    }

    // Form Submit handler
    handleSubmit(event) {

        let component = this;
        // Build a form submission authentication URL (similar to the form input field retrieval authentication URL)
        let signature = this.gformAuth(this.props.gformID, this.state.publicKey, this.state.privateKey, "POST");
        let gformURL = SiteURL + '/gravityformsapi/forms/' + this.props.gformID + '/submissions?api_key=' + this.state.publicKey + '&signature=' + signature;
        // Build the gForms submission object
        let entry = {
            "input_values":{

            }
        };

        $('#submit-button').prop('disabled', true);
        // Using the previously built form ID list, retrieve corresponding values and add them to the submission object
        this.state.fieldList.map(function(field){
            let fieldSanitized = field.replace('.', '_');
            entry.input_values['input_'+ fieldSanitized ] = typeof component.state[field] === 'undefined' ? ' ' : component.state[field];
        });

        let entry_json = JSON.stringify(entry);

        if(!document.getElementById("honeypot").value) {
            $.ajax({
                url: gformURL,
                type: 'POST',
                crossDomain: true,
                data: entry_json,
                dataType: 'json',
                success: function (data) {
                    if (data.status <= 202) {
                        if(data.response.is_valid){
                            $('#gform-' + component.props.gformID + ' input[type="submit"]').addClass('hidden');
                            $('#gform-' + component.props.gformID + ' .confirmation .message').html(data.response.confirmation_message);
                            $('#gform-' + component.props.gformID + ' .confirmation').removeClass('hidden');
                            $('#gform-' + component.props.gformID + ' .fields').fadeOut();
                            $('.gform .error').addClass('hidden');
                        }
                        else if(!data.response.is_valid){
                            $('.validation-error').remove();
                            let messages = data.response.validation_messages;
                            for(let i in messages){
                                component.handleValidationError(i, messages[i]);
                            }
                        }
                    }
                    else{
                        component.handleSoftError(component.state.gformTitle + ' form submission was not valid. Please review your form data to ensure completion and try again.');
                        console.log("Response code: " + data.status);
                        console.log(data);
                    }
                },
                error: function (jqXHR, textStatus) {
                    component.handleError(component.state.gformTitle + ' form submission. This was caused by a problem with the ajax POST of this form.');
                    console.log(jqXHR.responseText);
                    console.log(textStatus);
                }
            });
        }else{
            component.handleError("Honeypot detected");
        }
        event.preventDefault();
    }

    handleError(error){
        $('.gform input[type="submit"]').addClass('hidden');
        $('.gform .error').removeClass('hidden');
        $('.gform .error .bg-danger').html(error);
        $('.gform .fields').fadeOut();
        console.log("Error description: " + error);
        $('#submit-button').prop('disabled', false);
    }

    handleValidationError(id, error){
        console.log(id);
        console.log(error);
        $('#submit-button').prop('disabled', false);
        $('#group-' + id).addClass('bg-danger');
        $('.gform .error').removeClass('hidden');
        $('.gform .error .bg-danger').append('<p>Form field <b>' + $('#group-' + id).data('name') + '</b>: ' + error + '</p>');
    }

    render(){
        if(this.state.data){
            return (
                <Row className="gform">
                    <Col xs={12}>
                        <h2>{this.state.gformTitle}</h2>
                        <form title={this.state.gformTitle} className="gform" id={'gform-' + this.props.gformID} onSubmit={this.handleSubmit}>
                            <Row className="fields">
                                {this.state.fields}
                                <div style={{display: 'none'}}>
                                    <label>Keep this field blank for spam filtering purposes
                                        <input type="text" name="honeypot" id="honeypot" />
                                    </label>
                                </div>
                                <Col xs={12} className="submit-container">
                                    <Row>
                                        <Col xs={12}>
                                            <button id="submit-button" type="submit" className="liberty-button brown">Submit</button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} className="confirmation hidden"><p className="bg-success"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span> <span className="message" dangerouslySetInnerHTML={{ __html: this.state.confirmation}} ></span></p></Col>
                                <Col xs={12} className="error hidden"><p className="bg-danger"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span> An error occurred with this form. Please review your form entry and try again. If this error persists, contact the site administrator to alert them of this problem.</p></Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
            )
        }
        return <Loader />;
    }
}

export default GravityForm;