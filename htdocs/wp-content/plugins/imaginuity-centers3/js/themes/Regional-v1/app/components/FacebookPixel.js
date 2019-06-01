// Packages
import React, { PropTypes, Component } from 'react';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import ReactPixel from 'react-facebook-pixel';
// let Entities = require('html-entities').AllHtmlEntities;
// let entities = new Entities();

class FacebookPixel extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    componentWillMount(){
        if(this.props.pageData.acf.enable_facebook_pixel){
            ReactPixel.init(this.props.pageData.acf.pixel_code);
            ReactPixel.pageView();
            ReactPixel.track('track', 'ViewContent');
        }
    }

    render(){
        return null;
    }
}

export default FacebookPixel;