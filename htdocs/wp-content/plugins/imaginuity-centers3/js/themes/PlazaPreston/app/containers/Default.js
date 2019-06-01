// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import BlogSingle from '../containers/BlogSingle';
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import NoPage from '../components/404';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const BlogsData = SiteURL + '/wp-json/wp/v2/posts/';

class Default extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            optionsData: '',
            pageData: '',
            isBlog: false,
        };
    }

    componentWillMount(){
        this.retrievePageData();
    }

    componentWillReceiveProps(nextProps){
        // Handles navigation between interior pages (pages of the same template)
        if(nextProps.params.pageSlug !== this.state.pageSlug){
            this.setState({
                data: false,
                pageSlug: nextProps.params.pageSlug
            }, function(){
                this.retrievePageData();
            });
        }
    }

    retrievePageData(){
        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=' + this.props.params.pageSlug),
                axios.get(PropertyOptions),
                axios.get(BlogsData + '?slug=' + this.props.params.pageSlug)
            ])
            .then(axios.spread(function (site, pageData, options, blog) {

                component.setState({
                    data: true,
                    siteData: site.data,
                    optionsData: options.data,
                    pageData: pageData.data[0],
                    isBlog: !!blog,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if(this.state.data){
            if(this.state.isBlog && !this.state.pageData){
                return(
                    <BlogSingle blogSlug={this.props.params.pageSlug} />
                );
            }
            else if(this.state.pageData){
                return (
                    <div className={"template-default " + this.props.params.pageSlug}>
                        <Helmet
                            title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                            meta={[
                                {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                            ]}
                        />
                        <InteriorHeader
                            title={this.state.pageData.acf.title ? this.state.pageData.acf.title : this.state.pageData.title.rendered}
                            titleCopy={this.state.pageData.acf.title_copy}
                            color={this.state.pageData.acf.title_section_color}
                            aboveBelow={this.state.pageData.acf.above_below}
                            imageMobile={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_mobile : false}
                            imageDesktop={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_desktop : false}
                        />
                        <Grid>
                            <Row>
                                <Col
                                    xs={12}
                                    sm={8}
                                    className="main-content"
                                >
                                    <span dangerouslySetInnerHTML={{__html: this.state.pageData.content.rendered}}></span>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                );
            }
            else{
                return(
                    <NoPage/>
                );
            }
        }
        return <Loader />;
    }
}

export default Default;
