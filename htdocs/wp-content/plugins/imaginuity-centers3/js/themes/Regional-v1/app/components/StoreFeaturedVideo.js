// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button, ResponsiveEmbed } from 'react-bootstrap';

class FeaturedVideo extends Component{
    constructor(props){
        super(props);

        this.state = {
            videoID: this.props.videoID ? this.props.videoID : false,
        }
    }

    render(){
        if(this.props.videoID){
            return(
                <div className="featured-video">
                    <Grid>
                        <Row>
                            <Col xs={12} className="col">
                                <ResponsiveEmbed a16by9>
                                    <iframe title="Featured Video" type="video" src={'https://www.youtube.com/embed/'+this.state.videoID + '?controls=0&showinfo=0&rel=0&modestbranding=1 '}></iframe>
                                </ResponsiveEmbed>
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