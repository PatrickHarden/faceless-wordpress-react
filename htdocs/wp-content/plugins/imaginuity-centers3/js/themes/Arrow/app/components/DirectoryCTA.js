import React, {Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';

// Endpoints
const Images = document.location.hostname + "/wp-content/plugins/imaginuity-centers3/js/themes/Arrow/lib/img";
class DirectoryCTA extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }
    
    render(){
        return(
            <div className="directory-cta" style={{backgroundImage: "url(" + (this.props.homeData.acf.directory_background.url ? this.props.homeData.acf.directory_background.url : Images + '/home-directory-bg.jpg' ) + ")", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <Grid>
                    <Row>
                        <Col xs={12} className={"copy" + (this.props.homeData.acf.directory_inherit_primary_color ? ' font-color-setter' : '')}>
                            <h3 className={(this.props.homeData.acf.directory_inherit_primary_color ? 'font-color-setter' : '')}>{this.props.homeData.acf.directory_title ? this.props.homeData.acf.directory_title : "We've got what you're looking for"}</h3>
                            <p className={(this.props.homeData.acf.directory_inherit_primary_color ? 'font-color-setter' : '')}>{this.props.homeData.acf.directory_subtitle ? this.props.homeData.acf.directory_subtitle : 'From fashion to food, it’s all here'}</p>
                            {this.props.homeData.acf.directory_button_link &&
                                <Button className={(this.props.homeData.acf.directory_inherit_primary_color ? 'font-color-setter border-color-setter' : '')} href={this.props.homeData.acf.directory_button_link}>{this.props.homeData.acf.directory_button_text ? this.props.homeData.acf.directory_button_text : 'Show me the Directory'}</Button>
                            }
                        </Col>
                    </Row>
                </Grid>
                <span className="outline-box"></span>
            </div>
        );
    }
}

export default DirectoryCTA;