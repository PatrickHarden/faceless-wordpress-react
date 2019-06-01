// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col} from 'react-bootstrap';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/GroceryAnchor-v1/lib/img";


class SocialScene extends Component{
    constructor(props){
        super(props);

        this.state = {

        };
    }

    render(){

        var social = [];

        this.props.fb ? social.push(this.props.fb) : null;
        this.props.tw ? social.push(this.props.tw) : null;
        this.props.ig ? social.push(this.props.ig) : null;
        this.props.pn ? social.push(this.props.pn) : null;

        var offset;
        switch(social.length){
            case 1:
                offset = 5;
                break;
            case 2:
                offset = 4;
                break;
            case 3:
                offset = 3;
                break;
            default:
                offset = 2;
        }

        return (
            <section>
                {social.length > 0 &&
                <Row className="social-scene border-color-setter">
                    <Col xs={12}>
                        <h2 className="font-color-setter">The <b>Social Scene</b></h2>
                    </Col>
                    {this.props.fb &&
                    <Col xs={12} md={2} mdOffset={offset} >
                        <a href={this.props.fb} target="_blank" title="facebook">
                            <svg id="facebook-icon" alt="facebook icon">
                                <defs>
                                    <style>
                                    </style>
                                    <clipPath id="clip-path">
                                        <rect className="cls-1" x="64" y="42.69" width="37" height="79.62"/>
                                    </clipPath>
                                    <clipPath id="clip-path-2">
                                        <rect className="cls-1" x="64" y="42.69" width="37" height="79.62"/>
                                    </clipPath>
                                </defs>
                                <title>Facebook Icon</title>
                                <circle className="cls-2 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                <g id="Facebook">
                                    <g className="cls-3">
                                        <g className="cls-4">
                                            <path className="cls-5 background-color-setter"
                                                  d="M99.55,82.53H88.4v39.78H71.87V82.53H64V68.48h7.87v-9.1c0-6.51,3.09-16.69,16.68-16.69l12.25,0V56.39H91.9c-1.45,0-3.51.72-3.51,3.83v8.26H101Z"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </Col>
                    }

                    {this.props.tw &&
                    <Col xs={12} md={2} smOffset={social.length == 1 ? 5 : 0} >
                        <a href={this.props.tw} target="_blank" title="twitter">
                            <svg id="twitter-icon" alt="twitter icon">
                                <defs>
                                    <clipPath id="clip-path-tw">
                                        <rect className="cls-1" x="44.97" y="52" width="75.07" height="61"/>
                                    </clipPath>
                                </defs>
                                <title>Twitter Icon</title>
                                <circle className="cls-2 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                <g id="Twitter">
                                    <g className="cls-3">
                                        <g className="cls-3">
                                            <path className="cls-4 border-color-setter background-color-setter"
                                                  d="M112.35,67.19c0,.66,0,1.32,0,2C112.4,89.54,96.9,113,68.58,113A43.56,43.56,0,0,1,45,106.08a32.8,32.8,0,0,0,3.67.21,30.85,30.85,0,0,0,19.12-6.59A15.43,15.43,0,0,1,53.39,89a15.85,15.85,0,0,0,2.89.28,15.54,15.54,0,0,0,4.05-.54A15.43,15.43,0,0,1,48,73.64v-.19a15.36,15.36,0,0,0,7,1.92A15.43,15.43,0,0,1,50.2,54.81,43.7,43.7,0,0,0,81.94,70.9a15.41,15.41,0,0,1,26.24-14A30.76,30.76,0,0,0,118,53.12a15.43,15.43,0,0,1-6.77,8.52A30.7,30.7,0,0,0,120,59.22a31.27,31.27,0,0,1-7.68,8"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </Col>
                    }

                    {this.props.ig &&
                    <Col xs={12} md={2} smOffset={social.length == 1 ? 5 : 0} >
                        <a href={this.props.ig} target="_blank" title="instagram">
                            <svg id="instagram-icon" alt="instagram icon">
                                <defs>
                                    <clipPath id="clip-path-ig">
                                        <rect className="cls-1" x="44.67" y="44.67" width="75.67" height="75.67"/>
                                    </clipPath>
                                </defs>
                                <title>Instagram icon</title>
                                <circle className="cls-2 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                <g id="Artwork_1" data-name="Artwork 1">
                                    <g className="cls-3">
                                        <g className="cls-3">
                                            <path className="cls-4 border-color-setter background-color-setter"
                                                  d="M82.5,51.48c10.1,0,11.3,0,15.29.22a20.93,20.93,0,0,1,7,1.3A12.53,12.53,0,0,1,112,60.19a20.94,20.94,0,0,1,1.3,7c.18,4,.22,5.19.22,15.29s0,11.3-.22,15.29a20.94,20.94,0,0,1-1.3,7,12.53,12.53,0,0,1-7.18,7.18,20.93,20.93,0,0,1-7,1.3c-4,.18-5.19.22-15.29.22s-11.3,0-15.29-.22a20.94,20.94,0,0,1-7-1.3A12.53,12.53,0,0,1,53,104.81a20.94,20.94,0,0,1-1.3-7c-.18-4-.22-5.19-.22-15.29s0-11.3.22-15.29a20.94,20.94,0,0,1,1.3-7A12.53,12.53,0,0,1,60.19,53a20.93,20.93,0,0,1,7-1.3c4-.18,5.19-.22,15.29-.22m0-6.82c-10.27,0-11.56,0-15.6.23a27.77,27.77,0,0,0-9.18,1.76A19.35,19.35,0,0,0,46.65,57.72a27.77,27.77,0,0,0-1.76,9.18c-.18,4-.23,5.32-.23,15.6s0,11.56.23,15.6a27.77,27.77,0,0,0,1.76,9.18,19.35,19.35,0,0,0,11.06,11.06,27.77,27.77,0,0,0,9.18,1.76c4,.18,5.32.23,15.6.23s11.56,0,15.6-.23a27.77,27.77,0,0,0,9.18-1.76,19.35,19.35,0,0,0,11.06-11.06,27.77,27.77,0,0,0,1.76-9.18c.18-4,.23-5.32.23-15.6s0-11.56-.23-15.6a27.77,27.77,0,0,0-1.76-9.18,19.35,19.35,0,0,0-11.06-11.06,27.77,27.77,0,0,0-9.18-1.76c-4-.18-5.32-.23-15.6-.23"/>
                                            <path className="cls-4 border-color-setter background-color-setter"
                                                  d="M82.5,63.07A19.43,19.43,0,1,0,101.93,82.5,19.43,19.43,0,0,0,82.5,63.07m0,32A12.61,12.61,0,1,1,95.11,82.5,12.61,12.61,0,0,1,82.5,95.11"/>
                                            <path className="cls-4 border-color-setter background-color-setter"
                                                  d="M107.24,62.3a4.54,4.54,0,1,1-4.54-4.54,4.54,4.54,0,0,1,4.54,4.54"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </Col>
                    }
                    {this.props.pn &&
                    <Col xs={12} md={2} smOffset={social.length == 1 ? 5 : 0} >
                        <a href={this.props.pn} target="_blank" title="pinterest">
                            <svg id="pinterest-icon" alt="pinterest incon">
                                <defs>
                                    <clipPath id="clip-path-pn">
                                        <rect className="cls-1" x="50.55" y="41.79" width="63.9" height="82.54"/>
                                    </clipPath>
                                    <clipPath id="clip-path-2-pn">
                                        <rect className="cls-1" x="50.55" y="41.79" width="63.9" height="82.54"/>
                                    </clipPath>
                                </defs>
                                <title>Pinterest Icon</title>
                                <circle className="cls-2 border-color-setter" cx="82.5" cy="83.06" r="79.8"/>
                                <g id="Pinterest">
                                    <g className="cls-3">
                                        <g className="cls-4">
                                            <path className="cls-5 border-color-setter background-color-setter"
                                                  d="M88.87,101.44c-5.12,0-9.94-2.76-11.58-5.91,0,0-2.75,10.93-3.34,13-2.05,7.45-8.09,14.91-8.56,15.52a.63.63,0,0,1-1.13-.27c-.13-.95-1.67-10.35.14-18C65.32,101.95,70.5,80,70.5,80A18.16,18.16,0,0,1,69,72.46c0-7,4.08-12.27,9.15-12.27,4.31,0,6.39,3.23,6.39,7.11,0,4.33-2.75,10.82-4.18,16.83-1.19,5,2.52,9.13,7.48,9.13,9,0,15-11.54,15-25.21,0-10.38-7-18.16-19.73-18.16-14.38,0-23.34,10.73-23.34,22.71a13.65,13.65,0,0,0,3.13,9.29,2.32,2.32,0,0,1,.68,2.65c-.23.87-.75,3-1,3.8a1.63,1.63,0,0,1-2.37,1.19c-6.62-2.7-9.71-10-9.71-18.11,0-13.46,11.35-29.62,33.89-29.62,18.1,0,30,13.1,30,27.17,0,18.59-10.34,32.49-25.58,32.49"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </Col>
                    }
                </Row>
                }
            </section>
        )
    }
}

export default SocialScene;