// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class Signup extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    componentWillMount(){

    }

    render(){
        return null;
    }
}

export default Signup;