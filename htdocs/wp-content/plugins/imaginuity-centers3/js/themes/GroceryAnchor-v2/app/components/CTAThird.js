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

class CTAs extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        var buttonLink = (this.props.ctaData.acf.cta3_button_link == 'Internal')? this.props.ctaData.acf.cta3_internal_link : this.props.ctaData.acf.cta3_external_link;
        var ctaTextColor = (this.props.ctaData.acf.cta3_image_background_type == 'Dark') ? 'cta-color-white' : 'cta-color-black';
        var ctaButtonColor = (this.props.ctaData.acf.cta3_image_background_type == 'Dark') ? 'border-color-white' : 'border-color-black';
        return(
            <div
                className="cta-section background-color-setter"
                style={{
                    backgroundImage: (this.props.ctaData.acf.cta3_background_image ? "url('" + this.props.ctaData.acf.cta3_background_image.url + "')" : ''),
                    backgroundSize: 'cover'
                }}
            >
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h3 className={ctaTextColor}>{this.props.ctaData.acf.cta3_title ? this.props.ctaData.acf.cta3_title : 'Get Connected. Stay Connected'}</h3>
                            <p className={ctaTextColor}>{this.props.ctaData.acf.cta3_subtitle ? this.props.ctaData.acf.cta3_subtitle : 'Join our mailing list and receive the latest news, sales and special events'}</p>
                            <Button className={ctaButtonColor} href={buttonLink}>{this.props.ctaData.acf.cta3_button_text ? this.props.ctaData.acf.cta3_button_text : 'Sign Me Up'}</Button>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default CTAs;