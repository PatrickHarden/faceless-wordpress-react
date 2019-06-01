// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import NoPage from '../components/404';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class DirectoryCategories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            optionsData: '',
            pageData: '',
        };
    }

    componentWillMount() {
        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=directory-categories'),
            axios.get(PropertyOptions),
        ])


            .then(axios.spread(function (site, pageData, options) {

                let directoryCategories;

                console.log(pageData);

                if (pageData.data[0].acf.links) {
                    directoryCategories = pageData.data[0].acf.links.map((link) => {
                        return (
                            <Col xs={12} sm={6} lg={4}>
                                <Link
                                    to={link.link.url}
                                    target={link.link.target}
                                    className="link"
                                >
                                    <div className="inner-wrapper">
                                        <h3>{link.heading}</h3>
                                        {link.link.title &&
                                        <span>{link.link.title} »</span>
                                        }
                                    </div>
                                    <img src={link.image} alt={link.heading}/>
                                </Link>
                            </Col>
                        )
                    })
                }

                component.setState({
                    data: true,
                    siteData: site.data,
                    optionsData: options.data,
                    pageData: pageData.data[0],
                    directoryCategories: directoryCategories
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if (this.state.data) {

            return (
                <div className={"template-directory-categories"}>
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {
                                'name': 'description',
                                'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)
                            },
                        ]}
                    />
                    <InteriorHeader
                        title={this.state.pageData.acf.title ? this.state.pageData.acf.title : this.state.pageData.title.rendered}
                        imageMobile={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_desktop : false}
                    />
                    <Grid>
                        <Row>
                            {this.state.pageData.acf.top_copy &&
                            <Col xs={12} sm={8}>
                                <div className="top-copy">
                                    {this.state.pageData.acf.top_copy}
                                </div>
                            </Col>
                            }
                            {this.state.pageData.acf.top_link &&
                            <Col xs={12} sm={4}>
                                <div className="top-link-container">
                                    <Link className="top-link" href={this.state.pageData.acf.top_link.url}
                                          target={this.state.pageData.acf.top_link.target}>
                                        <img src={Images + 'sidebar-icon-map.png'} alt="sidebar map link"/>
                                        {this.state.pageData.acf.top_link.title} &#xbb;
                                    </Link>
                                </div>
                            </Col>
                            }
                        </Row>
                        <Row className="balls">
                            {this.state.directoryCategories}
                        </Row>
                    </Grid>
                </div>
            );

        }
        return <Loader/>;
    }
}

export default DirectoryCategories;
