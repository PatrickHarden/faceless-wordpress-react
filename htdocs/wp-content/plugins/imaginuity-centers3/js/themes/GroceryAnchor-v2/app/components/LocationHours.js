// Packages
import React, { PropTypes, Component } from 'react';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';

// Components
import Hours from './Hours';
import LocationIcon from 'react-icons/lib/md/place';

class LocationHours extends Component{
    constructor(props){
        super(props);

        this.state = {
            address1: this.props.optionsData.acf.address_1,
            address2: this.props.optionsData.acf.address_2,
            address3: this.props.optionsData.acf.city + ', ' + this.props.optionsData.acf.state + ' ' + this.props.optionsData.acf.zip,
            phone: this.props.optionsData.acf.phone,
        }
    }

    render() {
        return(
            <div className="center-info background-color-setter-transparent">
                <Grid>
                    <Row>
                        <Hours optionsData={this.props.optionsData} />
                        <Col xs={12} sm={6} className="location">
                            <div id="address-location">
                                <p>Location</p>
                                <br/>
                                <p>
                                    <a href={"https://maps.google.com?saddr=Current+Location&daddr=" + "+" + this.state.address1 + "+" + this.state.address2 + "+" + this.state.address3} target="_blank">
                                        {this.state.address1} {this.state.address2 ? this.state.address2 : ''} {this.state.address3}
                                    </a>
                                </p>
                            </div>
                            <a href={"tel:"+this.state.phone} style={{'color': 'white'}}>{this.state.phone}</a>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

}

export default LocationHours;