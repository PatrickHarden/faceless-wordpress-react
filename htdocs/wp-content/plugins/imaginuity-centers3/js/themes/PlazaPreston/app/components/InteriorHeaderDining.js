// Packages
import React, {PropTypes, Component} from 'react';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const StoresData = SiteURL + '/wp-json/wp/v2/stores/';

class InteriorHeaderDining extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            imageMobile: '',
            imageDesktop: '',
        }
    }

    componentWillMount() {
        let component = this;

        axios.get(StoresData + this.props.storeID)
            .then((response) => {
            console.log(response);
                component.setState({
                    data: true,
                    storeData: response.data,
                    imageMobile: response.data.acf.header_image_mobile,
                    imageDesktop: response.data.acf.header_image_desktop,
                    storeTitle: entities.decode(response.data.title.rendered),
                })
            })
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });

    }

    render() {
        if (this.state.data) {
            console.log(this.state.storeData);
            return (
                <div className={"interior-header"}>
                    <div className={this.state.imageDesktop ? "with-image" : "without-image"}>
                        {this.props.aboveBelow === 'above' &&
                        <div
                            className={"title-section " + this.props.aboveBelow}
                            style={{'backgroundColor': this.props.color ? this.props.color : '#905631'}}
                        >
                            <div className="container">
                                <h1>{this.props.title}</h1>
                                <p>{this.props.titleCopy}</p>
                            </div>
                        </div>
                        }
                        <div className="image-wrapper mobile visible-xs">
                            {this.state.imageMobile &&
                            <img
                                src={this.state.imageMobile.url}
                                alt={this.state.imageMobile.alt ? this.state.imageMobile.alt : this.state.title + ' featured image mobile'}
                            />
                            }
                        </div>
                        <div className="image-wrapper desktop hidden-xs">
                            {this.state.imageDesktop &&
                            <img
                                src={this.state.imageDesktop.url}
                                alt={this.state.imageDesktop.alt ? this.state.imageDesktop.alt : this.state.title + ' featured image desktop'}
                            />
                            }
                        </div>
                        {this.props.aboveBelow === 'below' &&
                        <div
                            className={"title-section " + this.props.aboveBelow}
                            style={{'backgroundColor': this.props.color ? this.props.color : '#905631'}}
                        >
                            <div className="container">
                                <h1>{this.props.title}</h1>
                                <p>{this.props.titleCopy}</p>
                            </div>
                        </div>
                        }
                        {this.props.aboveBelow === 'test' &&
                        <div className="container store-title-container">
                            <h2 className="store-title">{this.state.storeTitle}</h2>
                        </div>
                        }
                    </div>
                    <div className="restaurant-details container">
                        <Col xs={12} sm={8}>
                            <p>{this.state.storeData.acf.header_copy}</p>
                        </Col>
                        <Col xs={12} sm={4}>
                            <a
                                href={this.state.storeData.acf.restaurant_menu}
                                target="_blank"
                                className="plaza-button black"
                            >View Menu</a>
                        </Col>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default InteriorHeaderDining;