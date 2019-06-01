import React, {Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';

class DirectionsCTA extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }
    
    render(){
        return(
            <div className="directions-cta font-color-setter">
                <Grid>
                    <Row>
                        <Col xs={12} className="copy">
                            <h3>{this.props.homeData.acf.directions_title ? this.props.homeData.acf.directions_title : 'Find your way to us'}</h3>
                            {this.props.homeData.acf.directions_subtitle &&
                                <p>{this.props.homeData.acf.directions_subtitle}</p>
                            }
                            {this.props.homeData.acf.directions_button_link &&
                                <Button className="border-color-setter font-color-setter" href={this.props.homeData.acf.directions_button_link}>{this.props.homeData.acf.directions_button_text ? this.props.homeData.acf.directions_button_text : 'Take me there'}</Button>
                            }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default DirectionsCTA;