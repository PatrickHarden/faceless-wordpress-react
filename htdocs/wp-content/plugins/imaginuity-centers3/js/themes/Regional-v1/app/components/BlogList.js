// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();


class BlogsList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            blogs: '',
            blogCount: 0,
        };
    }

    componentWillMount(){

        let blogCount = 0;
        let blogs = this.props.blogsData.map((blog, i) => {

            let excerpt;
            if (blog.content.rendered) {
                let regex = /(<([^>]+)>)/ig;
                excerpt = entities.decode(blog.content.rendered).replace(regex, "").substr(0, 200);
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ")) + '... ';
            }
            else {
                excerpt = false;
            }


            if(moment().diff(blog.acf.end_date, 'days') <= 0 ){
                blogCount++;
                return(
                    <Col xs={12} className="blog">
                        <div className="image-container">
                            {blog.acf.featured_image &&
                                <img src={blog.acf.featured_image.url}  />
                            }
                        </div>
                        <div className="copy-container">
                            <p className="date"><b>{moment(blog.date).format('MMMM D, YYYY')}</b></p>
                            <h3><Link to={"/"+blog.slug+'/'} key={blog.id} className="font-color-setter" ><b>{entities.decode(blog.title.rendered)}</b></Link></h3>
                            {blog.acf.related_store &&
                            <Link className="store-link" key={blog.acf.related_store.ID} to={'/stores/'+blog.acf.related_store.post_name+'/'} storeID={blog.acf.related_store.post_name}>
                                {entities.decode(blog.acf.related_store.post_title)}
                            </Link>
                            }
                            {excerpt &&
                                <div className="excerpt">
                                    <p>{excerpt}</p>
                                    <Link to={"/"+blog.slug+'/'} className=""><b>Read More ></b></Link>
                                </div>
                            }
                            <hr className="border-color-setter" />
                        </div>
                    </Col>
                );
            }
        });

        this.setState({
            data: true,
            blogs: blogs,
            blogCount: blogCount,
        });
    }

    render(){
        if(this.state.data){
            return(
                <div className="blogs">
                    <Grid>
                        <Row>
                            {this.state.blogCount > 0 ? this.state.blogs : <h2>There are no blogs currently available.</h2>}
                        </Row>
                    </Grid>
                </div>
            );
        }
        return null;
    }
}


export default BlogsList;
