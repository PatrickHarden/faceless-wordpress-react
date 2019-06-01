// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import $ from 'jquery';

let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();


class BlogsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            blogs: '',
            blogCount: 0,
        };
    }

    componentWillMount() {

        let blogCount = 0;
        let blogs = this.props.blogsData.map((blog, i) => {
            blogCount++;
            return (
                <Col sm={6} md={4}
                     className="blog"
                     key={i}
                     data-categories={blog.categories ? '[' + blog.categories + ']' : 0}
                     data-filter={entities.decode(blog.title.rendered).toLowerCase()}
                >
                    <Row>
                        <Col xs={6} sm={12}>
                            <div className="image-container">
                                {blog.acf.featured_image &&
                                <Link to={"/" + blog.slug + '/'}>
                                    <img src={blog.acf.featured_image.url}
                                         alt={blog.acf.featured_image.alt ? blog.acf.featured_image.alt : entities.decode(blog.title.rendered)}/>
                                </Link>
                                }
                            </div>
                        </Col>
                        <Col xs={6} sm={12}>
                            <div className="copy-container">
                                <p className="date"><b>{moment(blog.date).format('MMMM D')}</b></p>
                                <h4 className="blog-title">
                                    <Link to={"/" + blog.slug + '/'} key={blog.id} className="font-color-setter">
                                        {entities.decode(blog.title.rendered)} >
                                    </Link>
                                </h4>
                            </div>
                        </Col>
                    </Row>
                </Col>
            );
        });

        this.setState({
            data: true,
            blogs: blogs,
            blogCount: blogCount,
        });
    }

    render() {
        if (this.state.data) {
            return (
                <div className="blogs">
                    <Grid>
                        <Row>
                            {this.state.blogCount > 0 ? this.state.blogs :
                                <h2>There are no blogs currently available.</h2>}
                        </Row>
                    </Grid>
                </div>
            );
        }
        return null;
    }
}


export default BlogsList;
