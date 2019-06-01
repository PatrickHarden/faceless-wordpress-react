// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let moment = require('moment');
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import Loader from '../components/Loader';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const blogsData = SiteURL + '/wp-json/wp/v2/posts/';

class BlogSingle extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: false,
            blog: this.props.blogSlug,
            page: this.props.page,
            blogData: false,
            title: '',
            siteData: '',
            homeData: '',
            blogPageData: '',
            optionsData: '',
            pageData: '',
            metaDescription: '',
        };
    }

    componentWillMount(){

        const component = this;
        let blog;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(PropertyOptions),
                axios.get(Pages + '?slug=blog'),
                axios.get(blogsData + '?slug=' + this.props.blogSlug),
            ])
            .then(axios.spread(function(site, home, options, blogPageData, pageData) {

                let pageData_ = pageData.data[0];
                let metaDescription;
                let useCustomMeta = pageData_.acf.use_custom_meta_description;

                if (useCustomMeta) {
                    metaDescription = pageData_.acf.meta_description;
                }
                else if(options.data.acf.use_custom_blog_meta_description){
                    metaDescription = options.data.acf.custom_blog_meta_description;
                    metaDescription = metaDescription.replace('%JOB%', entities.decode(pageData_.title.rendered));
                    metaDescription = metaDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    metaDescription = metaDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    metaDescription = metaDescription.replace('%CENTERNAME%', entities.decode(site.name));
                }
                else{
                    metaDescription = options.data.acf.meta_description;
                }

                let relatedStore = (pageData_.acf.related_store ? pageData_.acf.related_store.ID : false);

                let blogTitle = entities.decode(pageData_.title.rendered);
                let blogData =
                    <Col xs={12} className='blog'>
                        <Row>
                            <Col xs={12} sm={8} smOffset={2}>
                                <div className="copy-container">
                                    <div className="top-info">
                                        <p className="date"><b>{moment(pageData_.date).format('MMMM D, YYYY')}</b></p>
                                        <h3>{blogTitle}</h3>

                                        {pageData_.acf.related_store &&
                                            <Link className="store-link" key={pageData_.acf.related_store.ID}
                                                  to={'/stores/' + pageData_.acf.related_store.post_name + '/'}
                                                  storeID={pageData_.acf.related_store.post_name}>
                                                {entities.decode(pageData_.acf.related_store.post_title)}
                                            </Link>
                                        }
                                        {pageData_.acf.featured_image &&
                                            <img src={pageData_.acf.featured_image.url}  />
                                        }
                                    </div>

                                    {pageData_.content &&
                                        <div dangerouslySetInnerHTML={{__html: pageData_.content.rendered}}></div>
                                    }
                                    <hr className="border-color-setter" />
                                </div>
                            </Col>
                        </Row>
                    </Col>

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    blogPageData: blogPageData.data[0],
                    pageData: pageData_,
                    blogData: blogData,
                    metaDescription: metaDescription,
                });

            }))
            .catch((err) => {
                console.log(err);
            });
    }

    externalLinkChecker(){
        $('a').each(function() {
            let a = new RegExp('/' + window.location.host + '/');
            if(!a.test(this.href)) {
                $(this).attr('target', '_blank');
            }
        });
    }

    render(){
        if(this.state.data){
            console.log(this.state.blogPageData);
            return (
                <section className="blog-single">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.blogPageData} secondaryTitle={this.state.pageData.title.rendered} />

                    {this.state.blogData}

                    <FacebookPixel pageData={this.state.pageData} />
                </section>
            );
        }
        return <Loader />;
    }
}

export default BlogSingle;