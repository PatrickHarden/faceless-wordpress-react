// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button, ResponsiveEmbed } from 'react-bootstrap';

class FeaturedVideo extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            videoID: this.props.homeData.acf.video_id,
            title: this.props.homeData.acf.overlay_title
        }
    }

    render(){
        if(this.props.homeData.acf.video_or_image == 'video'){
            return(
                <div className="featured-video">
                    <Grid>
                        <Row>
                            <Col xs={12} className="col">
                                {this.state.title &&
                                <h3>{this.state.title}</h3>
                                }
                                <ResponsiveEmbed a16by9>
                                    <iframe title="Featured Video" type="video" src={'https://www.youtube.com/embed/'+this.state.videoID + '?controls=0&showinfo=0&rel=0&modestbranding=1 '}></iframe>
                                </ResponsiveEmbed>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
        else{
            return(
                <div className="featured-video image">
                    <Grid>
                        <Row>
                            <Col xs={12} className="col">
                                <img className="img-responsive" src={this.props.homeData.acf.featured_image.url} alt={this.props.homeData.acf.featured_image.alt ? this.props.homeData.acf.featured_image.alt : 'featured image'}/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
        return null;
    }
}

export default FeaturedVideo;