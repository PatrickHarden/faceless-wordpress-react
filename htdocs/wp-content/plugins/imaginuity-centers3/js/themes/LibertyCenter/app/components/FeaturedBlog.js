// Packages
import React, {Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import axios from 'axios';

let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const BlogData = SiteURL + '/wp-json/wp/v2/posts/';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class FeaturedBlog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredBlog: '',
        }
    }

    componentWillMount() {
        let component = this;

        axios.get(BlogData + this.props.blog)
            .then((blog) => {

                let excerpt;
                console.log(blog);
                if (blog.data.excerpt.rendered) {
                    let regex = /(<([^>]+)>)/ig;
                    excerpt = entities.decode(blog.data.excerpt.rendered).replace(regex, "").substr(0, 200);
                    excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
                }
                else {
                    excerpt = false;
                }

                let featuredBlog =
                    <div className="store" key={blog.data.id}>
                        {blog.data.acf.background_image &&
                        <img className="background hidden-xs hidden-sm"
                             src={blog.data.acf.background_image ? blog.data.acf.background_image.url : Images + 'logo.jpg'}
                             alt={entities.decode(blog.data.title.rendered) + ' background'}
                        />
                        }
                        <div className="container">
                            <Row>
                                <Col md={5}>
                                    <div className="image-wrapper">
                                        {blog.data.acf.featured_image &&
                                        <img className="foreground"
                                             src={blog.data.acf.featured_image.url}
                                             alt={entities.decode(blog.data.title.rendered) + ' featured'}
                                        />
                                        }
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <div className="content-wrapper">
                                        <div className="date">
                                            <b>{moment(blog.date).format('MMMM D')}</b>
                                        </div>
                                        <Link to={blog.data.slug}>
                                            <h3>{entities.decode(blog.data.title.rendered)}</h3>
                                            {excerpt &&
                                            <div className="content" dangerouslySetInnerHTML={{__html: excerpt}}></div>
                                            }
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>


                component.setState({
                    data: true,
                    featuredBlog: featuredBlog,
                });
            })
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });
    }

    render() {

        if (this.state.data) {
            return (
                <div className="featured-blog">
                    {this.state.featuredBlog}
                </div>
            )
        }
        else if (this.state.error) {
            return null;
        }
        return <Loader/>;
    }
}

export default FeaturedBlog;