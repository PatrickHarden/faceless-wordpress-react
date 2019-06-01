// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import InteriorHeader from '../components/InteriorHeader';
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
            <div className="404">
                <Helmet>
                    <title>404 - Page not found</title>
                    <meta name="prerender-status-code" content="404" />
                </Helmet>
                <InteriorHeader
                    title="404: Page not found"
                />
                <Grid>
                    <Row>
                        <h3 className="text-center">Uh-oh, looks like the page you requested doesn't exist. Use the navigation or <Link to="/" >click here</Link> to get back on track.</h3>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default NotFound;