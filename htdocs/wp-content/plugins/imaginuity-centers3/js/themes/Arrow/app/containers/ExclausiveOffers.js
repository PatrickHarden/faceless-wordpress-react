import React from 'react';
import {Link} from 'react-router';
import axios from "axios";
import { ReactBootstrap, Grid, Row, Col, Image } from 'react-bootstrap';

// Components
import Helmet from 'react-helmet';
// import PageHeading from '../components/PageHeading';
import Loader from '../components/Loader';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let Pages = SiteURL + '/wp-json/wp/v2/pages';
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
let Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/Arrow/lib/img";
let PDFs = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/Arrow/lib/pdf";

let ExclausiveOffers = React.createClass({
    getInitialState: function(){
        return{
            data: false,
            siteName: '',
            siteAddress: '',
            metaDescription: '',
            content: '',
            gform: false,
            pageData: '',
        }
    },

    componentWillMount: function(){
        const component = this;

        axios.all([
            axios.get(PropertyOptions),
            axios.get(Pages + '?slug=exclausive-offers'),
            axios.get(SiteURL + "/wp-json"),
        ])
        .then(axios.spread((options, page, site) => {

            component.setState({
                data: true,
                siteAddress: options.data.acf.city + ', ' + options.data.acf.state,
                metaDescription: (options.data.acf.meta_description ? options.data.acf.meta_description : ''),
                gform: (typeof page.data[0].acf.gravity_form !== "undefined" ? page.data[0].acf.gravity_form.id : false),
                pageData: page.data[0],
                siteName: site.data.name
            })
        }))
        .catch((err) => {
            console.log(err);
        })
    },

    render: function(){
        if(this.state.data){
            let imgStyle = {width: '100%', height: 'auto', marginBottom: '50px'}

            return (
                <div className="exclausive-offers">
                    {this.state.pageData.acf.exclausive_header &&
                        <div className="header-image">
                            {this.state.pageData.acf.exclausive_header ? (
                                <img style={imgStyle} src={this.state.pageData.acf.exclausive_header} alt="exclausive access"/>
                            ) : (
                                <img style={imgStyle} src={this.state.pageData.acf.exclausive_header} alt="exclausive access"/>
                            )}
                        </div>
                    }
                    <Grid>
                        <Helmet
                            title={'exCLAUSive Offers | ' + this.state.siteName + ' | ' + this.state.siteAddress}
                            meta={[
                                    {'name': 'description', 'content': (this.state.pageData.acf.meta_description ? this.state.pageData.acf.meta_description : this.state.metaDescription)},
                                ]}
                        />
                        <Row>
                            <Col xs={12} className="title">
                                <h1>exCLAUSive offers</h1>
                            </Col>
                        </Row>
                        <div className="offers">
                            <Row className="offer">
                                <Col xs={12} sm={6}>
                                    {this.state.pageData.acf.coupons[0].description ? (
                                        <div className="description" dangerouslySetInnerHTML={{ __html: this.state.pageData.acf.coupons[0].description}}></div>
                                    ) : (
                                        <div>
                                            <div className="description">
                                                <h4>$5 off santa photo package A</h4>
                                                <ul>
                                                    <li><span>Four 5” x 7“ photos</span></li>
                                                    <li><span>Four 3” x 5” photos</span></li>
                                                    <li><span>Two 4” x 6” photos</span></li>
                                                    <li><span>Four wallets with two keychains</span></li>
                                                    <li><span>Free digital download</span></li>
                                                    <li><span>$20 Shutterfly promo card</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </Col>
                                <Col xs={12} sm={6}>
                                    {this.state.pageData.acf.coupons[0].barcode ? (
                                        <img className="barcode" src={this.state.pageData.acf.coupons[0].barcode.url} alt="barcode1"/>
                                    ) : (
                                        <img className="barcode" src={Images + '/holiday/barcode1.gif'} alt="barcode1"/>
                                    )}
                                </Col>
                            </Row>
                            <Row className="offer">
                                <Col xs={12} sm={6}>
                                    {this.state.pageData.acf.coupons[1].description ? (
                                        <div className="description" dangerouslySetInnerHTML={{ __html: this.state.pageData.acf.coupons[1].description}}></div>
                                    ) : (
                                        <div>
                                            <div className="description">
                                                <h4>$3 OFF Santa Photo Package B</h4>
                                                <ul>
                                                    <li><span>Three 5” x 7“ photos</span></li>
                                                    <li><span>Three 3” x 5” photos</span></li>
                                                    <li><span>Two 4” x 6” photos</span></li>
                                                    <li><span>Two wallets</span></li>
                                                    <li><span>$20 Shutterfly promo card</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </Col>
                                <Col xs={12} sm={6}>
                                    {this.state.pageData.acf.coupons[1].barcode ? (
                                        <img className="barcode" src={this.state.pageData.acf.coupons[1].barcode.url} alt="barcode1"/>
                                    ) : (
                                        <img className="barcode" src={Images + '/holiday/barcode2.gif'} alt="barcode2"/>
                                    )}
                                </Col>
                            </Row>
                            <Row className="offer">
                                <Col xs={12} sm={6}>
                                    {this.state.pageData.acf.coupons[2].description ? (
                                        <div className="description" dangerouslySetInnerHTML={{ __html: this.state.pageData.acf.coupons[2].description}}></div>
                                    ) : (
                                        <div>
                                            <div className="description">
                                                <h4>$1 off santa merchandise</h4>
                                                <ul>
                                                    <li><span>A variety of photo frames & more!</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </Col>
                                <Col xs={12} sm={6}>
                                    {this.state.pageData.acf.coupons[2].barcode ? (
                                        <img className="barcode" src={this.state.pageData.acf.coupons[2].barcode.url} alt="barcode1"/>
                                    ) : (
                                        <img className="barcode" src={Images + '/holiday/barcode3.gif'} alt="barcode1"/>
                                    )}
                                </Col>
                            </Row>
                            <Row className="redeem-instructions">
                                <Col xs={12} >
                                    {this.state.pageData.acf.redeem_instructions ? (
                                            <span dangerouslySetInnerHTML={{ __html: this.state.pageData.acf.redeem_instructions}}></span>
                                        ) : (
                                            <h4 style={{textAlign: 'center'}}>TO REDEEM, PRESENT THESE OFFERS ON YOUR MOBILE PHONE, OR <a href={PDFs + '/jll-holiday-coupons.pdf'} target="_blank">CLICK HERE TO PRINT.</a></h4>
                                        )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} className="santa" >
                                    <Link to={this.state.pageData.acf.santa_button_internal_link ? this.state.pageData.acf.santa_button_internal_link : '/holiday'}>
                                        <img src={this.state.pageData.acf.santa_button_image ? this.state.pageData.acf.santa_button_image.url : Images + "/holiday/santa-button.png"} alt="Santa Location & Hours" style={{width: '100%', maxWidth: '500px'}}/>
                                    </Link>
                                </Col>
                                <Col xs={12} className="details" >
                                    {this.state.pageData.acf.program_details ? (
                                            <span dangerouslySetInnerHTML={{ __html: this.state.pageData.acf.program_details}}></span>
                                        ) : (
                                            <span>
                                                <p style={{textAlign: 'center'}}>Valid only at Cherry Hill Programs Santa locations. Not valid with other coupons. Must present coupon to redeem. One per family. Not valid on FastPass reservations.</p>
    <h2 style={{textAlign: 'center'}}>Valid From 11/01/2018 Until 12/24/2018</h2>
                                            </span>
                                        )
                                    }
                                </Col>
                            </Row>

                        </div>
                    </Grid>
                </div>
            )
        }
        return <Loader />;
    }
});

module.exports = ExclausiveOffers;