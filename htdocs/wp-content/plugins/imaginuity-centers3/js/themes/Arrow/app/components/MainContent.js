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

class MainContent extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        return(
            <div className="main-content-area">
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h3>{this.props.mainData.acf.main_content_title ? this.props.mainData.acf.main_content_title : ''}</h3>
                            {this.props.mainData.acf.main_content_text_area.length && 
                                <span dangerouslySetInnerHTML={{ __html: entities.decode(this.props.mainData.acf.main_content_text_area)}} />
                            }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default MainContent;