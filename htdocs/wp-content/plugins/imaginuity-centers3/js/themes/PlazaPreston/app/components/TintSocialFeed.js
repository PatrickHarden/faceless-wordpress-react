// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import Script from 'react-load-script';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class TintSocialFeed extends Component{
    constructor(props){
        super(props);

        this.state = {
            scriptLoaded: false,
        }
    }

    componentWillMount(){

    }

    handleScriptCreate() {
        this.setState({ scriptLoaded: false })
    }

    handleScriptError() {
        this.setState({ scriptError: true })
    }

    handleScriptLoad() {
        this.setState({ scriptLoaded: true })
    }

    render(){
        return(
            <div className="tint-social-feed">
                <div
                    className="tintup"
                    data-id="theplazaatprestoncenter"
                    data-columns=""
                    data-mobilescroll="true"
                    data-infinitescroll="true"
                    data-personalization-id="926224"
                    style={{'height':'350px','width':'100%'}}
                ></div>
                <Script
                    url={'https://cdn.hypemarks.com/pages/a5b5e5.js'}
                    onCreate={this.handleScriptCreate.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                    onLoad={this.handleScriptLoad.bind(this)}
                />
            </div>

        )
    }
}

export default TintSocialFeed;