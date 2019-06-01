// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/Arrow/lib/img";

class SocialMediaGallery extends Component{
    constructor(props){
        super(props);

        this.state = {
            images: false,
        }
    }

    componentWillMount(){

        let images = this.props.homeData.acf.social_media_images.map((image, i) => {
            return(
                <div className="gallery-item">
                    {image.social_media_link_type !== 'None' ? (
                        <a href={image.social_media_link} target="_blank">
                            <img src={image.image.url} alt={image.image.alt ? image.image.alt : image.image.filename} />
                        </a>
                    ) : (
                        <img src={image.image.url} alt={image.image.alt ? image.image.alt : image.image.filename} />
                    )}

                    <div className={"content" + (image.social_media_link_type === 'None' ? ' no-link' : '')}>
                        {image.social_media_link_type !== 'None' ? (
                            <a href={image.social_media_link} className="social-link" target="_blank">
                                <img src={image.social_media_link_type === 'Facebook' ? Images + '/social-gallery-facebook.png' : Images + '/social-gallery-instagram.png'} alt={image.social_media_link_type} />
                            </a>
                        ) : (
                            ''
                        )}
                        {image.caption &&
                            <p>{image.caption}</p>
                        }
                    </div>
                </div>
            );
        });
        this.setState({
            images: images,
        });
    }

    render(){
        if(this.state.images){
            return(
                <div className="social-images-gallery">
                    {this.state.images}
                    <span className="clearfix" />
                </div>
            );
        }
        return <Loader />;
    }
}

export default SocialMediaGallery;