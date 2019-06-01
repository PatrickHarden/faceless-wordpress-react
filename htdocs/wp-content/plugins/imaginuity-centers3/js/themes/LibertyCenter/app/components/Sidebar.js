// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';
import {ReactBootstrap, Col} from 'react-bootstrap';

let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){
        return (
            <Col xs={12} sm={4} lg={3} className="sidebar">
                {this.props.pageData.acf.sidebar_circle_image &&
                <div className="image-circle"><img src={this.props.pageData.acf.sidebar_circle_image.url}
                                                   alt={this.props.pageData.acf.sidebar_circle_image.alt ? this.props.pageData.acf.sidebar_circle_image.alt : entities.decode(this.props.pageData.title.rendered) + ' sidebar image'}/>
                </div>
                }
                {this.props.optionsData.acf.sidebar_map &&
                <div className="map-wrapper">
                    <img src={this.props.optionsData.acf.sidebar_map.url}
                         alt={this.props.optionsData.acf.sidebar_map ? this.props.optionsData.acf.sidebar_map.alt : 'sidebar map'}/>
                </div>
                }
                {this.props.optionsData.acf.sidebar_map_link &&
                <div className="link-wrapper">
                    <Link
                        to={this.props.optionsData.acf.sidebar_map_link.url + "/"}
                        target={this.props.optionsData.acf.sidebar_map_link.target}
                        className="sidebar-link"
                    >
                        <img src={Images + 'sidebar-icon-map.png'} alt="sidebar map link"/>
                        {this.props.optionsData.acf.sidebar_map_link.title ? this.props.optionsData.acf.sidebar_map_link.title : 'View Liberty Center Map'} &#xbb;
                    </Link>
                </div>
                }
                {this.props.optionsData.acf.sidebar_parking_link &&
                <div className="link-wrapper">

                    <Link
                        to={this.props.optionsData.acf.sidebar_parking_link.url + "/"}
                        target={this.props.optionsData.acf.sidebar_parking_link.target}
                        className="sidebar-link"
                    >
                        <img src={Images + 'sidebar-icon-parking.png'} alt="sidebar parking"/>
                        {this.props.optionsData.acf.sidebar_parking_link.title ? this.props.optionsData.acf.sidebar_parking_link.title : 'View Parking Info'} &#xbb;
                    </Link>
                </div>
                }

            </Col>
        );
    }
}

export default Sidebar;