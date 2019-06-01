// Packages
import React, {PropTypes, Component} from 'react';
import { Link} from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import BlogList from '../components/BlogList';
import Loader from '../components/Loader';
import FacebookPixel from '../components/FacebookPixel';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const BlogData = SiteURL + '/wp-json/wp/v2/posts?order=desc';

class Blog extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            error: false,
            siteData: '',
            homeData: '',
            enableSignup: '',
            optionsData: '',
            pageData: '',
            heroImage: '',
            blogData: '',
        };
    }

    componentWillMount(){
        const component = this;

        axios.all([
            axios.get(BlogData),
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=blog'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function(blogData, site, page, home, options){

                let blogQueries = [];
                let data = [];

                if(blogData.headers['x-wp-totalpages'] > 1){
                    let paginationCount = blogData.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        blogQueries.push(axios.get(BlogData + '&page=' + x));
                        x++;
                    }
                    axios.all(blogQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.setBlogData(blogData, site, home, options, page);
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                        })
                }
                else{
                    data = blogData.data;
                    component.setBlogData(blogData, site, home, options, page);
                }

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    setBlogData(blog, site, home, options, page){
        this.setState({
            data: true,
            siteData: site.data,
            homeData: home.data[0],
            enableSignup: home.data[0].acf.enable_mail_signup,
            optionsData: options.data,
            pageData: page.data[0],
            heroImage: page.data[0].acf.hero_image,
            blogData: blog.data,
        });
    }

    render(){
        if(this.state.data){
            return(
                <div className="template-blog" data-page="blog"> 
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 : '') + ' ' + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    <BlogList blogsData={this.state.blogData} />

                    <FacebookPixel pageData={this.state.pageData} />
                </div>
            );
        }
        else if(this.state.error){
            return(
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2>An error occurred retrieving the Blog posts.</h2>
                            <p>Please refresh the page and try again. If this error continues, please <Link to={'/contact-us'}>contact us</Link> and report the issue.</p>
                            <br/>
                        </Col>
                    </Row>
                </Grid>
            )
        }
        return <Loader />;
    }
}


export default Blog;
