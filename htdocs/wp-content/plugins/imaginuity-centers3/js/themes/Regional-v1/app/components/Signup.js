import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';

class Signup extends Component{
    constructor(props){
        super(props);

        this.state = {
            signupTitle: this.props.homeData.acf.signup_title ? this.props.homeData.acf.signup_title : 'Get Connected. Stay Connected',
            signupSubtitle: this.props.homeData.acf.signup_subtitle,
            signupButton: this.props.homeData.acf.signup_button_text ? this.props.homeData.acf.signup_button_text : 'Sign Me Up',
            signupLink: this.props.homeData.acf.signup_button_link,
            facebook: this.props.optionsData.acf.facebook_url,
            twitter: this.props.optionsData.acf.twitter_url,
            instagram: this.props.optionsData.acf.instagram_url,
        }
    }
    
    render(){
        return(
            <div className="signup font-color-setter">
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h3>{this.state.signupTitle}</h3>
                            <div className="icon-container">
                                {this.state.facebook &&
                                <a href={this.state.facebook} className="social-icon" title="Facebook" target="_blank">
                                    <p className="sr-only">facebook</p>
                                    <svg >
                                        <path className="background-color-setter" d="M23,0.6C10.7,0.6,0.7,10.6,0.7,23c0,12.3,10,22.3,22.3,22.3s22.3-10,22.3-22.3C45.4,10.6,35.4,0.6,23,0.6z
                                                     M29,22.9h-3.9c0,6.2,0,13.8,0,13.8h-5.7c0,0,0-7.5,0-13.8h-2.7V18h2.7v-3.2c0-2.3,1.1-5.8,5.8-5.8l4.2,0v4.7c0,0-2.6,0-3.1,0
                                                    c-0.5,0-1.2,0.3-1.2,1.3V18h4.4L29,22.9z"/>
                                    </svg>
                                </a>
                                }
                                {this.state.twitter &&
                                <a href={this.state.twitter} className="social-icon" title="Twitter" target="_blank">
                                    <p className="sr-only">twitter</p>
                                    <svg >
                                        <path className="background-color-setter" d="M23,0.7C10.7,0.7,0.7,10.7,0.7,23c0,12.3,10,22.3,22.3,22.3s22.3-10,22.3-22.3C45.3,10.7,35.3,0.7,23,0.7z
                                                         M33.4,18.6c0,0.2,0,0.4,0,0.6c0,6.4-4.9,13.9-13.9,13.9c-2.8,0-5.3-0.8-7.5-2.2c0.4,0,0.8,0.1,1.2,0.1c2.3,0,4.4-0.8,6.1-2.1
                                                        c-2.1,0-3.9-1.4-4.6-3.4c0.3,0.1,0.6,0.1,0.9,0.1c0.4,0,0.9-0.1,1.3-0.2C14.7,25,13,23,13,20.7c0,0,0,0,0-0.1
                                                        c0.7,0.4,1.4,0.6,2.2,0.6c-1.3-0.9-2.2-2.4-2.2-4.1c0-0.9,0.2-1.7,0.7-2.4c2.4,2.9,6,4.9,10,5.1c-0.1-0.4-0.1-0.7-0.1-1.1
                                                        c0-2.7,2.2-4.9,4.9-4.9c1.4,0,2.7,0.6,3.6,1.5c1.1-0.2,2.2-0.6,3.1-1.2c-0.4,1.1-1.1,2.1-2.1,2.7c1-0.1,1.9-0.4,2.8-0.8
                                                        C35.2,17.1,34.3,17.9,33.4,18.6z"/>
                                    </svg>
                                </a>
                                }
                                {this.state.instagram &&
                                <a href={this.state.instagram} className="social-icon" title="Instagram" target="_blank">
                                    <p className="sr-only">facebook</p>
                                    <svg>
                                        <g>
                                            <circle className="background-color-setter" cx="23" cy="22.7" r="4.7"/>
                                            <path className="background-color-setter" d="M34,14.4c-0.3-0.7-0.6-1.1-1.1-1.6c-0.5-0.5-1-0.8-1.6-1.1c-0.5-0.2-1.2-0.4-2.6-0.5c-1.5-0.1-1.9-0.1-5.7-0.1
                                                            s-4.2,0-5.7,0.1c-1.4,0.1-2.1,0.3-2.6,0.5c-0.7,0.3-1.1,0.6-1.6,1.1c-0.5,0.5-0.8,1-1.1,1.6c-0.2,0.5-0.4,1.2-0.5,2.6
                                                            c-0.1,1.5-0.1,1.9-0.1,5.7s0,4.2,0.1,5.7c0.1,1.4,0.3,2.1,0.5,2.6c0.3,0.7,0.6,1.1,1.1,1.6c0.5,0.5,1,0.8,1.6,1.1
                                                            c0.5,0.2,1.2,0.4,2.6,0.5c1.5,0.1,1.9,0.1,5.7,0.1c3.8,0,4.2,0,5.7-0.1c1.4-0.1,2.1-0.3,2.6-0.5c0.7-0.3,1.1-0.6,1.6-1.1
                                                            s0.8-1,1.1-1.6c0.2-0.5,0.4-1.2,0.5-2.6c0.1-1.5,0.1-1.9,0.1-5.7s0-4.2-0.1-5.7C34.4,15.6,34.2,14.9,34,14.4z M23,29.9
                                                            c-4,0-7.2-3.2-7.2-7.2s3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2S27,29.9,23,29.9z M30.5,16.8c-0.9,0-1.7-0.8-1.7-1.7
                                                            c0-0.9,0.8-1.7,1.7-1.7c0.9,0,1.7,0.8,1.7,1.7C32.2,16.1,31.4,16.8,30.5,16.8z"/>
                                            <path className="background-color-setter" d="M23,0.7C10.7,0.7,0.7,10.7,0.7,23c0,12.3,10,22.3,22.3,22.3c12.3,0,22.3-10,22.3-22.3
                                                            C45.3,10.7,35.3,0.7,23,0.7z M37,28.5c-0.1,1.5-0.3,2.5-0.7,3.4c-0.4,0.9-0.8,1.7-1.6,2.5c-0.8,0.8-1.6,1.3-2.5,1.6
                                                            c-0.9,0.3-1.9,0.6-3.4,0.7c-1.5,0.1-2,0.1-5.8,0.1c-3.8,0-4.3,0-5.8-0.1c-1.5-0.1-2.5-0.3-3.4-0.7c-0.9-0.4-1.7-0.8-2.5-1.6
                                                            c-0.8-0.8-1.3-1.6-1.6-2.5C9.3,31,9,30,9,28.5c-0.1-1.5-0.1-2-0.1-5.8s0-4.3,0.1-5.8c0.1-1.5,0.3-2.5,0.7-3.4
                                                            c0.4-0.9,0.8-1.7,1.6-2.5c0.8-0.8,1.6-1.3,2.5-1.6c0.9-0.3,1.9-0.6,3.4-0.7c1.5-0.1,2-0.1,5.8-0.1c3.8,0,4.3,0,5.8,0.1
                                                            c1.5,0.1,2.5,0.3,3.4,0.7c0.9,0.4,1.7,0.8,2.5,1.6c0.8,0.8,1.3,1.6,1.6,2.5c0.3,0.9,0.6,1.9,0.7,3.4c0.1,1.5,0.1,2,0.1,5.8
                                                            S37.1,27,37,28.5z"/>
                                        </g>
                                    </svg>
                                </a>
                                }
                            </div>
                            {this.state.signupSubtitle &&
                            <p>{this.state.signupSubtitle}</p>
                            }
                            {this.state.signupLink &&
                            <Button className="background-color-setter"
                                    href={this.state.signupLink}>{this.state.signupButton}</Button>
                            }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Signup;