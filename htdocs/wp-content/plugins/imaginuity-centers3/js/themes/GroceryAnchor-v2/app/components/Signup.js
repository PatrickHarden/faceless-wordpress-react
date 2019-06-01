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

    render(){
        return(
            <div className="signup background-color-setter">
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h3 style={{'color': this.props.homeData.acf.signup_background_type === 'dark' ? 'white' : 'black' }}>{this.props.homeData.acf.signup_title ? this.props.homeData.acf.signup_title : 'Get Connected. Stay Connected'}</h3>
                            <div className="icon-container">
                                {this.props.optionsData.acf.facebook_url &&
                                <a href={this.props.optionsData.acf.facebook_url} className="social-icon" title="Facebook" target="_blank">
                                    <img src={require("../../lib/img/icon-facebook.png")} alt="facebook" />
                                </a>
                                }
                                {this.props.optionsData.acf.twitter_url &&
                                <a href={this.props.optionsData.acf.twitter_url} className="social-icon" title="Twitter" target="_blank">
                                    <img src={require("../../lib/img/icon-twitter.png")} alt="twitter" />
                                </a>
                                }
                                {this.props.optionsData.acf.instagram &&
                                <a href={this.props.optionsData.acf.instagram} className="social-icon" title="Instagram" target="_blank">
                                    <img src={require("../../lib/img/icon-instagram.png")} alt="instagram" />
                                </a>
                                }
                            </div>
                            <p style={{'color': this.props.homeData.acf.signup_background_type === 'dark' ? 'white' : 'black' }}>{this.props.homeData.acf.signup_subtitle ? this.props.homeData.acf.signup_subtitle : 'Join our mailing list and receive the latest news, sales and special events'}</p>
                            <Button href={this.props.homeData.acf.signup_button_link}>{this.props.homeData.acf.signup_button_text ? this.props.homeData.acf.signup_button_text : 'Sign Me Up'}</Button>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Signup;