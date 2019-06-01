// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

//Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';


class FooterLinks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            optionsData: '',
        }
    }

    componentWillMount() {

        const component = this;

        let linkCircles;

        if (this.props.optionsData.acf.link_circles) {
            linkCircles = this.props.optionsData.acf.link_circles.map((circle) => {
                return (
                    <Col xs={12} sm={6} lg={3}>
                        <Link
                            to={circle.link.url + "/"}
                            target={circle.link.target}
                            className="circle"
                        >
                            <div className="inner-wrapper">
                                <h3>{circle.heading}</h3>
                                {circle.link.title &&
                                <span>{circle.link.title} »</span>
                                }
                            </div>
                            <img className="hidden-xs" src={circle.image} alt={circle.heading}/>
                        </Link>
                    </Col>
                )
            })
        }
        this.setState({
            data: true,
            linkCircles: linkCircles
        });

    }

    render() {
        if (this.state.data) {

            return (
                <div className="link-circles container">
                    <Row>
                        {this.state.linkCircles}
                    </Row>
                </div>
            )
        }
        return null;
    }
}

export default FooterLinks;