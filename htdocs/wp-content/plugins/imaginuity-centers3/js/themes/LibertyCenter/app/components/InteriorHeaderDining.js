// Packages
import React, {PropTypes, Component} from 'react';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const StoresData = SiteURL + '/wp-json/wp/v2/stores/';

class InteriorHeaderDining extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"interior-header"}>
                <div className={this.props.imageDesktop ? "with-image" : "without-image"}>
                    <div className="image-wrapper mobile">
                        {this.props.imageMobile &&
                        <img className="visible-xs" src={this.props.imageMobile.url}
                             alt={this.props.imageMobile.alt ? this.props.imageMobile.alt : this.props.title + ' featured image mobile'}/>
                        }
                    </div>
                    <div className="image-wrapper desktop">
                        {this.props.imageDesktop &&
                        <img className="hidden-xs" src={this.props.imageDesktop.url}
                             alt={this.props.imageDesktop.alt ? this.props.imageDesktop.alt : this.props.title + ' featured image desktop'}/>
                        }
                    </div>
                    {this.props.title &&
                    <div
                        className="title-section"
                    >
                        <div className="container">
                            <h1>{entities.decode(this.props.title)}</h1>
                            {this.props.contentArea &&
                            <span className={"content-area"}
                                  dangerouslySetInnerHTML={{__html: this.props.contentArea}}></span>
                            }
                        </div>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

export default InteriorHeaderDining;