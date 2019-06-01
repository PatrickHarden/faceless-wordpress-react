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
import FeaturedBlog from '../components/FeaturedBlog';
import BlogList from '../components/BlogList';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const BlogData = SiteURL + '/wp-json/wp/v2/posts?order=desc';
const BlogCategories = SiteURL + '/wp-json/wp/v2/categories';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class Blog extends Component {
    constructor(props) {
        super(props);

        this.blogNameFilter = this.blogNameFilter.bind(this);

        this.state = {
            data: false,
            error: false,
        };
    }

    componentWillMount() {
        const component = this;

        axios.all([
            axios.get(BlogData),
            axios.get(BlogCategories),
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=blog'),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function (blogData, blogCategories, site, page, options) {

                let blogQueries = [];
                let data = [];

                if (blogData.headers['x-wp-totalpages'] > 1) {
                    let paginationCount = blogData.headers['x-wp-totalpages'];
                    let x = 1;
                    while (x <= paginationCount) {
                        blogQueries.push(axios.get(BlogData + '&page=' + x));
                        x++;
                    }
                    axios.all(blogQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.setBlogData(blogData, blogCategories, site, options, page);
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                        })
                }
                else {
                    data = blogData.data;
                    component.setBlogData(blogData, blogCategories, site, options, page);
                }

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    setBlogData(blog, blogCategories, site, options, page) {
        console.log(page.data[0]);

        let categoryOptions = blogCategories.data.map((category) => {
            return (
                <option data-value={category.id} value={category.id}>{entities.decode(category.name)}</option>
            );
        });

        let categoryLinks = blogCategories.data.map((category) => {
            if (category.name !== 'Uncategorized') {
                return (
                    <span
                        data-value={category.id}
                        className="category-filter-link"
                        onClick={this.categoryFilter}
                    >
                        {entities.decode(category.name)}
                    </span>
                );
            }
        });

        this.setState({
            data: true,
            siteData: site.data,
            optionsData: options.data,
            pageData: page.data[0],
            blogData: blog.data,
            categoryOptions: categoryOptions,
            categoryLinks: categoryLinks,
        });
    }


    categoryFilter = (e) => {

        let filterValue = e.target.dataset.value ? e.target.dataset.value : e.target.value;

        $('#blog-name').val('');

        if (filterValue !== 'all') {
            $('.blog').each(function () {
                let blogCategories = $(this).data('categories');
                if (blogCategories.indexOf(parseInt(filterValue)) === -1) {
                    // $(this).slideUp();
                    $(this).hide()
                }
                else {
                    //
                    $(this).show();
                }
            });
        }
        else {
            $('.blog').show();
        }
    }

    blogNameFilter = (e) => {

        this.setState({
            searchFilter: e.target.value,
        })

        let filterValue = this.state.searchFilter.toLowerCase();
        let blogValue;

        $('#blog-categories').val('all');

        if (filterValue) {
            $('#blog-submit').addClass('active');
        } else {
            $('#blog-submit').removeClass('active');
        }

        $('.blog').each(function () {
            blogValue = $(this).data('categories');
            if (blogValue.indexOf(filterValue) === -1) {
                // $(this).slideUp();
                $(this).hide();
            }
            else {
                $(this).show();
            }
        });
    }

    clearBlogNameFilter = (e) => {
        e.preventDefault();

        $('#blog-submit').removeClass('active');
        $('#blog-name').val('');

        $('.blog').each(function () {
            $(this).show();
        });
        this.setState({
            searchFilter: '',
        });
    }

    render() {
        if (this.state.data) {
            return (
                <div className="template-blog" data-page="blog">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 : '') + ' ' + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {
                                'name': 'description',
                                'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)
                            },
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
                    {this.state.pageData.acf.featured_post &&
                    <div className="featured-blog-container">
                        <img className="branches one" src={Images + 'branches1.png'} alt="branches"/>
                        <FeaturedBlog blog={this.state.pageData.acf.featured_post}/>
                    </div>
                    }
                    <div className="filters">
                        <div className="container">
                            <div className="filter-wrap">
                                <form action="" id="blog-search" onSubmit={this.clearBlogNameFilter}>
                                    <label className="input-label" for="blog-name">
                                        <span className="sr-only">blog Name</span>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            id="blog-name"
                                            value={this.state.searchFilter}
                                            onChange={this.blogNameFilter}
                                        />
                                    </label>
                                    <label className="submit-label" for="blog-submit">
                                        <span className="sr-only">Search blog posts</span>
                                        <input type="submit" id="blog-submit"/>
                                    </label>
                                </form>
                                <form action="" id="blog-filter">
                                    <label for="blog-categories">
                                        <span className="sr-only">blog Categories</span>
                                        <select
                                            type="select"
                                            placeholder="Category Filter"
                                            id="blog-categories"
                                            onChange={this.categoryFilter}
                                        >
                                            <option value="all">All News</option>
                                            {this.state.categoryOptions}
                                        </select>
                                    </label>
                                </form>
                                <p className="category-filter-links">
                                    <span
                                        className="category-filter-link"
                                        data-value={'all'}
                                        onClick={this.categoryFilter}
                                    >
                                        All
                                    </span>
                                    {this.state.categoryLinks}
                                </p>
                            </div>
                        </div>
                    </div>
                    <BlogList blogsData={this.state.blogData}/>

                </div>
            );
        }
        else if (this.state.error) {
            return (
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2>An error occurred retrieving the Blog posts.</h2>
                            <p>Please refresh the page and try again. If this error continues, please <Link
                                to={'/contact-us'}>contact us</Link> and report the issue.</p>
                            <br/>
                        </Col>
                    </Row>
                </Grid>
            )
        }
        return <Loader/>;
    }
}


export default Blog;
