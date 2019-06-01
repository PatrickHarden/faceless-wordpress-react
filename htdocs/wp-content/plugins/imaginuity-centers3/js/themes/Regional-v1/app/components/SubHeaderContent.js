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

class SubHeaderContent extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        return(
            <div className="subheader-content-area">
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2 className="font-color-setter">{this.props.headerData.acf.header_subtitle_text ? this.props.headerData.acf.header_subtitle_text : ''}</h2>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default SubHeaderContent;