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

class CTASolid extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        var buttonLink = (this.props.ctaData.acf.cta2_button_link == 'Internal')? this.props.ctaData.acf.cta2_internal_link : this.props.ctaData.acf.cta2_external_link;
        return(
            <div className="cta-section background-color-setter">
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h3 style={{'color': 'white' }}>{this.props.ctaData.acf.cta2_title ? this.props.ctaData.acf.cta2_title : 'Get Connected. Stay Connected'}</h3>
                            <p style={{'color': 'white'  }}>{this.props.ctaData.acf.cta2_subtitle ? this.props.ctaData.acf.cta2_subtitle : 'Join our mailing list and receive the latest news, sales and special events'}</p>
                            {this.props.ctaData.acf.cta2_content ? <p style={{'color': 'white'  }}>{this.props.ctaData.acf.cta2_content}</p> : 'Join our mailing list and receive the latest news, sales and special events'}
                            <Button className="border-color-white btn" href={buttonLink}>{this.props.ctaData.acf.cta2_button_text ? this.props.ctaData.acf.cta2_button_text : 'Sign Me Up'}</Button>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
    
}

export default CTASolid;