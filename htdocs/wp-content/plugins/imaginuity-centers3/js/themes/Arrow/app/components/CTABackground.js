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

class CTABackground extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        let buttonLink = (this.props.ctaData.acf.cta_button_link === 'Internal') ? this.props.ctaData.acf.cta_internal_link : this.props.ctaData.acf.cta_external_link;
        return(
            <div
                className="cta-section background-color-setter"
                style={{
                    backgroundImage: (this.props.ctaData.acf.cta_background_image ? "url('" + this.props.ctaData.acf.cta_background_image.url + "')" : ''),
                    backgroundSize: 'cover'
                }}
            >
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h3 className="font-color-setter">{this.props.ctaData.acf.cta_title ? this.props.ctaData.acf.cta_title : ''}</h3>
                            <p className="font-color-setter">{this.props.ctaData.acf.cta_subtitle ? this.props.ctaData.acf.cta_subtitle : ''}</p>
                            {this.props.ctaData.acf.cta_content && 
                                <p style={{'color': 'black'}}> {this.props.ctaData.acf.cta_content}</p>
                            }
                            <Button className="border-color-setter font-color-setter" href={buttonLink} target={(this.props.ctaData.acf.cta_button_link === 'Internal' ? '_self' :'_blank')} >{this.props.ctaData.acf.cta_button_text ? this.props.ctaData.acf.cta_button_text : ''}</Button>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

}

export default CTABackground;