// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let moment = require('moment');
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import BlogRecommend from '../components/BlogRecommend';
import Loader from '../components/Loader';
import InteriorHeader from '../components/InteriorHeader';
import FooterLinks from '../components/FooterLinks';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const blogsData = SiteURL + '/wp-json/wp/v2/posts/';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class BlogSingle extends Component {
    constructor(props) {
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

    componentWillMount() {

        const component = this;
        let blog;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(PropertyOptions),
            axios.get(Pages + '?slug=blog'),
            axios.get(blogsData + '?slug=' + this.props.blogSlug),
        ])
            .then(axios.spread(function (site, options, blogPageData, pageData) {

                let pageData_ = pageData.data[0];
                let metaDescription;
                let useCustomMeta = pageData_.acf.use_custom_meta_description;

                if (useCustomMeta) {
                    metaDescription = pageData_.acf.meta_description;
                }
                else if (options.data.acf.use_custom_blog_meta_description) {
                    metaDescription = options.data.acf.custom_blog_meta_description;
                    metaDescription = metaDescription.replace('%JOB%', entities.decode(pageData_.title.rendered));
                    metaDescription = metaDescription.replace('%CITY%', entities.decode(options.data.acf.city));
                    metaDescription = metaDescription.replace('%STATE%', entities.decode(options.data.acf.state));
                    metaDescription = metaDescription.replace('%CENTERNAME%', entities.decode(site.name));
                }
                else {
                    metaDescription = options.data.acf.meta_description;
                }

                component.setState({
                    data: true,
                    siteData: site.data,
                    optionsData: options.data,
                    blogPageData: blogPageData.data[0],
                    pageData: pageData_,
                    metaDescription: metaDescription,
                });

            }))
            .catch((err) => {
                console.log(err);
            });
    }

    externalLinkChecker() {
        $('a').each(function () {
            let a = new RegExp('/' + window.location.host + '/');
            if (!a.test(this.href)) {
                $(this).attr('target', '_blank');
            }
        });
    }

    render() {
        if (this.state.data) {
            return (
                <section className="blog-single">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />
                    <InteriorHeader
                        imageMobile={this.state.blogPageData.acf.use_featured_image ? this.state.blogPageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.blogPageData.acf.use_featured_image ? this.state.blogPageData.acf.header_featured_image_desktop : false}
                    />
                    <div className="container">
                        <div className="column-left col-sm-12 col-md-6">
                            <p className="date">{moment(this.state.pageData.date).format('MMMM D')}</p>
                            <h1>{entities.decode(this.state.pageData.title.rendered)}</h1>
                            {this.state.pageData.acf.featured_image &&
                            <img className="foreground visible-xs"
                                 src={this.state.pageData.acf.featured_image.url}
                                 alt={entities.decode(this.state.pageData.title.rendered) + ' featured'}
                            />
                            }
                            <span dangerouslySetInnerHTML={{__html: this.state.pageData.content.rendered}}></span>
                        </div>
                        <div className="column-right col-sm-12 col-md-6">
                            {this.state.pageData.acf.featured_image &&
                            <img className="foreground hidden-xs"
                                 src={this.state.pageData.acf.featured_image.url}
                                 alt={entities.decode(this.state.pageData.title.rendered) + ' featured'}
                            />
                            }
                            <BlogRecommend categories={this.state.pageData.categories} id={this.state.pageData.id} />
                        </div>
                    </div>
                    <FooterLinks optionsData={this.state.optionsData}/>
                </section>
            );
        }
        return <Loader/>;
    }
}

export default BlogSingle;