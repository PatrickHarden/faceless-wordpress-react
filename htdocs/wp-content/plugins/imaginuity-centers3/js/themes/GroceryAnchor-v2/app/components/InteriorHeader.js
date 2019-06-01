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
            <div className="interior-header background-color-setter">
                <div className="header-image-container">
                    {this.props.pageData.acf.hero_image &&
                        <div className="img-container">
                            <img src={this.props.pageData.acf.hero_image.url}
                                 alt={this.props.pageData.acf.hero_image.alt ? this.props.pageData.acf.hero_image.alt : 'header image'}
                                 className="header-image"/>
                        </div>
                    }
                    <h1>
                        {entities.decode(this.props.pageData.title.rendered)}
                        {this.props.secondaryTitle &&
                            <small><br />{this.props.secondaryTitle}</small>
                        }
                    </h1>
                </div>
                {this.props.pageData.acf.enable_header_copy &&
                <div className="header-copy">
                    <div className="copy font-color-setter-2">
                        <span className="inner-copy" dangerouslySetInnerHTML={{ __html: entities.decode(this.props.pageData.acf.header_copy)}} />
                    </div>
                    <div className="img-container">
                        {this.props.pageData.acf.left_image &&
                        <img className='left'
                             src={this.props.pageData.acf.left_image.url}
                             alt={this.props.pageData.acf.left_image.alt ? this.props.pageData.acf.left_image.alt : 'hero image'}/>
                        }

                        {this.props.pageData.acf.right_image &&
                        <img className='right'
                             src={this.props.pageData.acf.right_image.url}
                             alt={this.props.pageData.acf.right_image.alt ? this.props.pageData.acf.right_image.alt : 'hero image'}/>
                        }
                    </div>
                </div>
                }
            </div>
        );
    }
}

export default InteriorHeader;