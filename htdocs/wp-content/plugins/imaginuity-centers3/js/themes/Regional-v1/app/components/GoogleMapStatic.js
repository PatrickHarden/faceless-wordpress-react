// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class GoogleMapStatic extends Component{
    constructor(props){
        super(props);

        this.state = {
            address1: this.props.optionsData.acf.address_1 + '+',
            address2: this.props.optionsData.acf.address_2 + '+',
            address3: this.props.optionsData.acf.city + '+' + this.props.optionsData.acf.state + '+' + this.props.optionsData.acf.zip,
            color: this.props.optionsData.acf.secondary_color.replace('#', '0x'),
        }

        //<iframe
        //    width="100%"
        //    height="600"
        //    frameborder="0"
        //    src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyA9EyeDHwkuZU1VGcn38GkxEDmFxijVkyk&q="
        //            + this.state.address1 + this.state.address2 + this.state.address3} allowfullscreen>
        //</iframe>

        //<img src={"https://maps.googleapis.com/maps/api/staticmap?center="
        //        + this.state.address1 + this.state.address2 + this.state.address3
        //        + '&zoom=12'
        //        + '&size=1600x300'
        //        + '&scale=2'
        //        + '&markers=' + this.state.address1 + this.state.address2 + this.state.address3
        //        + '&maptype=roadmap'
        //        + '&style=feature:all|element:labels.text.stroke|color:' + this.state.color + '|lightness:20'
        //        + '&style=feature:all|element:labels.text.stroke|weight:1'
        //        + '&style=feature:all|element:labels.text.fill|color:' + this.state.color + '|lightness:-70'
        //        + '&style=feature:all|element:labels.icon|visibility:off'
        //        + '&style=feature:landscape|element:geometry|color:' + this.state.color
        //        + '&style=feature:administrative|element:geometry|color:' + this.state.color + '|lightness:-20'
        //        + '&style=feature:poi|element:geometry|color:' + this.state.color + '|lightness:-25'
        //        + '&style=feature:road|element:geometry|color:' + this.state.color + '|lightness:-35'
        //        + '&style=feature:transit|element:geometry|color:' + this.state.color + '|lightness:-35'
        //        + '&style=feature:water|element:geometry|color:' + this.state.color + '|lightness:-40'
        //        + '&key=AIzaSyAgD-q39-oU68F6YQQo882_WFg9bFGfb5I'} alt="google map background"/>

    }

    render(){
        if(this.props.homeData.acf.enable_google_map){
            return(
                <div className="google-map-static">
                    <Button className="background-color-setter" href={"https://maps.google.com?saddr=Current+Location&daddr=" + this.state.address1 + this.state.address2 + this.state.address3} target="_blank">Take Me There</Button>

                    <img src={this.props.homeData.acf.map_image.url} alt={this.props.homeData.acf.map_image.alt ? this.props.homeData.acf.map_image.alt : 'google map background'}/>
                </div>
            );
        }
        return null;
    }
}

export default GoogleMapStatic;