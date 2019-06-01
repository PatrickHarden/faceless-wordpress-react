// Packages
import React, { PropTypes, Component } from 'react';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class Signup extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    componentWillMount(){
        console.log(this.props.pageData.acf.enable_custom_script);
        console.log(this.props.pageData.acf.script_code);

    }

    componentDidMount(){
        $('#script-container').append(this.props.pageData.acf.script_code);
    }

    componentWillUnmount(){

    }

    render(){
        if(this.props.pageData.acf.enable_custom_script){
            return(
                <div id="script-container">

                </div>
            );
        }
        return null;
    }
}

export default Signup;