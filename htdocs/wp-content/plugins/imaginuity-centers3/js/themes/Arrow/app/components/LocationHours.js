// Packages
import React, { PropTypes, Component } from 'react';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';

// Components
import Hours from '../components/HoursInformation';
import GoogleMapLive from '../components/GoogleMapLive';

class LocationHours extends Component{
    constructor(props){
        super(props);

        this.state = {
            address1: this.props.optionsData.acf.address_1,
            address2: this.props.optionsData.acf.address_2,
            address3: this.props.optionsData.acf.city + ', ' + this.props.optionsData.acf.state + ' ' + this.props.optionsData.acf.zip,
        }
    }

    render() {
        return(
            <div className="center-info background-color-setter">
                <div className="info-container">
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <Hours optionsData={this.props.optionsData} />
                            </Col>
                            <Col xs={12} className="location">
                                <p>
                                    {this.state.address1}{this.state.address2 ? " " + this.state.address2 : ''}, {this.state.address3}
                                    <br />
                                    {this.props.optionsData.acf.phone}
                                </p>
                            </Col>
                        </Row>
                    </Grid>
                </div>
                {this.props.pageData.acf.map_image &&
                    <div className="map">
                        <GoogleMapLive optionsData={this.props.optionsData} />
                        {this.props.pageData.acf.enable_location_hours &&
                            <Button href={this.props.pageData.acf.map_button_url ? this.props.pageData.acf.map_button_url : "https://maps.google.com?saddr=Current+Location&daddr=" + this.state.address1 + this.state.address2 + this.state.address3} target="_blank" >
                                {this.props.pageData.acf.map_button_text ? this.props.pageData.acf.map_button_text : 'Show Me a Map'}
                            </Button>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default LocationHours;