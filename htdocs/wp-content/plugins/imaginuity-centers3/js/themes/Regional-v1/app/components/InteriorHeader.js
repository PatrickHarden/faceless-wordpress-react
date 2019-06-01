// Packages
import React, { PropTypes, Component } from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class InteriorHeader extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }



    render(){
        return(
            <div>
                <div className="interior-header background-color-setter">
                    <div className="header-image-container">
                        {this.props.pageData.acf.hero_image &&
                            <div className="img-container">
                                <img src={this.props.pageData.acf.hero_image.url}
                                     alt={this.props.pageData.acf.hero_image.alt ? this.props.pageData.acf.hero_image.alt : 'header image'}
                                     className="header-image"/>
                            </div>
                        }
                        <h1 className={this.props.pageData.acf.hide_title ? 'sr-only' : false} >
                            {entities.decode(this.props.pageData.title.rendered)}
                            {this.props.secondaryTitle &&
                                <small><br />{this.props.secondaryTitle}</small>
                            }
                        </h1>
                    </div>
                    {this.props.pageData.acf.enable_header_copy &&
                    <div>
                        <img src={this.props.pageData.acf.navigation_thumbnail.url} alt={this.props.pageData.acf.navigation_thumbnail.alt ? this.props.pageData.acf.navigation_thumbnail.alt : 'navigation thumbnail'} className="nav-thumbnail hidden-xs hidden-sm"/>
                        <div className="header-copy-container">
                            <span className="header-copy font-color-setter" dangerouslySetInnerHTML={{ __html: entities.decode(this.props.pageData.acf.header_copy)}} />
                        </div>
                    </div>
                    }
                </div>
                <span className="clearfix" />
            </div>
        );
    }
}

export default InteriorHeader;