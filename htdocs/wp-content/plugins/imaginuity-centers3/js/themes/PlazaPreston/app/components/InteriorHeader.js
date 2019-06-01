// Packages
import React, {PropTypes, Component} from 'react';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class InteriorHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            aboveBelow: this.props.aboveBelow ? this.props.aboveBelow : 'above'
        }
    }

    render() {
        return (
            <div className={"interior-header"}>
                <div className={this.props.imageDesktop ? "with-image" : "without-image"}>
                    {this.state.aboveBelow === 'above' &&
                    <div
                        className="title-section"
                        style={{'backgroundColor': this.props.color ? this.props.color : '#586a83'}}
                    >
                        <div className="container">
                            <h1>{entities.decode(this.props.title)}</h1>
                            <p>{entities.decode(this.props.titleCopy)}</p>
                        </div>
                    </div>
                    }
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
                    {this.state.aboveBelow === 'below' &&
                    <div
                        className="title-section"
                        style={{'backgroundColor': this.props.color ? this.props.color : '#586a83'}}
                    >
                        <div className="container">
                            <h1>{entities.decode(this.props.title)}</h1>
                            <p>{entities.decode(this.props.titleCopy)}</p>
                        </div>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

export default InteriorHeader;