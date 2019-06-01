// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class PageLayout extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: true,
            layoutType: this.props.pageData.acf.layout_type ? this.props.pageData.acf.layout_type[0].acf_fc_layout : false,
            layout: this.props.pageData.acf.layout_type ? this.props.pageData.acf.layout_type[0] : 'full_width',
        }
    }

    render(){
        if(this.state.data){
            let layout;
            switch(this.state.layoutType){
                case 'full_width':
                    layout =
                        <Row>
                            <Col xs={12}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout ? this.state.layout.content_area : '')}} />
                            </Col>
                        </Row>;
                    break;
                case '2_column_wide_left':
                    layout =
                        <Row>
                            <Col xs={12} md={7}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout.left_column)}} />
                            </Col>
                            <Col xs={12} md={5}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout.right_column)}} />
                            </Col>
                        </Row>;
                    break;
                case '2_column_wide_right':
                    layout =
                        <Row>
                            <Col xs={12} md={3}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout.left_column)}} />
                            </Col>
                            <Col xs={12} md={8}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout.right_column)}} />
                            </Col>
                        </Row>;
                    break;
                case '4_column':
                    layout =
                        <Row>
                            <Col xs={12} md={3}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout.column_1)}} />
                            </Col>
                            <Col xs={12} md={3}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout.column_2)}} />
                            </Col>
                            <Col xs={12} md={3}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout.column_3)}} />
                            </Col>
                            <Col xs={12} md={3}>
                                <section dangerouslySetInnerHTML={{ __html: entities.decode(this.state.layout.column_4)}} />
                            </Col>
                        </Row>;
                    break;
                default:
                    break;
            }
            return(
                <Grid className="main-layout font-color-setter">
                    {layout}
                </Grid>
            )
        }
        return null;
    }
}

export default PageLayout;