// Packages
import React, { PropTypes, Component } from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import GoogleMapAPI from 'google-map-react';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

//Endpoints
let Geocode = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
let APIkey = 'AIzaSyBHF1GDBvLyW0iLTnwZnSbKRcIcx-FMOtg';

//Components
import MapMarker from 'react-icons/lib/md/location-on';

class GoogleMapLive extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            address1: this.props.optionsData.acf.address_1 + '+',
            address2: this.props.optionsData.acf.address_2 + '+',
            address3: this.props.optionsData.acf.city + '+' + this.props.optionsData.acf.state + '+' + this.props.optionsData.acf.zip,
            color: this.props.optionsData.acf.secondary_color.replace('#', '0x'),
            coordinates: {},
        }
    }

    componentWillMount(){

        let component = this;

        axios.all([
            axios.get(Geocode + this.state.address1 + this.state.address2 + this.state.address3 + "&key=" + APIkey)
        ])
            .then(axios.spread(function(geo){
                component.setState({
                    data: true,
                    coordinates: {
                        center: [geo.data.results[0].geometry.location.lat, geo.data.results[0].geometry.location.lng],
                        lat: geo.data.results[0].geometry.location.lat,
                        lng: geo.data.results[0].geometry.location.lng,
                    },
                    styles: [
                        {
                            "featureType": "all",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": component.props.optionsData.acf.secondary_color,
                                    "lightness": 50,
                                    "weight": 1
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "lightness": 50,
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "weight": 1
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": component.props.optionsData.acf.secondary_color,
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "lightness": -80
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": component.props.optionsData.acf.secondary_color,
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 40,
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": component.props.optionsData.acf.secondary_color,
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 10,
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": component.props.optionsData.acf.secondary_color,
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 10,
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": component.props.optionsData.acf.secondary_color,
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 10,
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": component.props.optionsData.acf.secondary_color,
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 10,
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": component.props.optionsData.acf.secondary_color,
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 0,
                                }
                            ]
                        },
                    ]
                });
            }))
            .catch((err) => {
                console.log("Error in REST API endpoint return");
                console.log(err);
            })
    }

    render(){
        if(this.state.data){
            return(
                <div className="google-map-live">
                    <GoogleMapAPI
                        bootstrapURLKeys={{key: APIkey}}
                        defaultCenter={this.state.coordinates.center}
                        defaultZoom={15}
                        options={{styles: this.state.styles}}
                    >
                        <MapMarker
                            lat={this.state.coordinates.lat}
                            lng={this.state.coordinates.lng}
                            color="#f65147"
                            size={50}
                            style={{
                                "position": "relative",
                                "top": "-50px",
                                "left": "-25px"
                            }}
                        />
                    </GoogleMapAPI>
                </div>
            );
        }
        return null;

    }
}

export default GoogleMapLive;