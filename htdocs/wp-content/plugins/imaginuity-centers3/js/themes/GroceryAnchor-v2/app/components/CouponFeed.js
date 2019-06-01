// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import Script from 'react-load-script';

// Components

// Endpoints
var SiteURL = window.location.protocol + '//' + document.location.hostname;
var PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class CouponFeed extends Component{
    constructor(props){
        super(props);
        this.state = {
            couponsEnabled: false,
            couponID: '',
            couponSource: ''
        }
    }

    componentWillMount(){
        $.get(PropertyOptions, function(data){
            this.setState({
                couponsEnabled: data.acf.enable_coupons_integration,
                couponID: data.acf.script_id,
                couponSource: data.acf.script_src
            });
        }.bind(this));
    }

    handleScriptCreate() {
        this.setState({ scriptLoaded: false })
    }

    handleScriptError() {
        this.setState({ scriptError: true })
    }

    handleScriptLoad() {
        this.setState({ scriptLoaded: true })
    }

    render(){
        if(this.state.couponsEnabled){
            return (
                <section title="Coupon feed" className="coupon-feed">
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <h3><b>Coupon</b> Central</h3>
                            </Col>
                            <Col xs={12} className="coupon-container">
                                <script type="text/javascript" id={this.state.couponID} src={this.state.couponSource}>
                                </script>
                                <Script
                                    url={this.state.couponSource}
                                    onCreate={this.handleScriptCreate.bind(this)}
                                    onError={this.handleScriptError.bind(this)}
                                    onLoad={this.handleScriptLoad.bind(this)}
                                ></Script>
                            </Col>
                        </Row>
                    </Grid>
                </section>
            )
        }
        return null;
    }
}

export default CouponFeed;