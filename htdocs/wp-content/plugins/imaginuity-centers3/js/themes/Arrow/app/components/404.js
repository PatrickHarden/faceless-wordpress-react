// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import Helmet from 'react-helmet';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class NotFound extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    componentWillMount(){

    }

    render(){
        return(
            <div className="no-page-found">
                <Helmet>
                    <title>404 - Page not found</title>
                    <meta name="prerender-status-code" content="404" />
                </Helmet>
                <div className="spacer background-color-setter"></div>
                <Grid>
                    <Row>
                        <h1 className="text-center">404: Page not found</h1>
                        <h3 className="text-center">Uh-oh, looks like the page you requested doesn't exist. Use the navigation or <Link to="/" >click here</Link> to get back on track.</h3>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default NotFound;