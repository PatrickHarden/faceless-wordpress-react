// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import axios from 'axios';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const BlogData = SiteURL + '/wp-json/wp/v2/posts?order=desc&per_page=4';

class BlogRecommend extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    componentWillMount(){
        let component = this;

        let catLength = this.props.categories.length;
        let categories = this.props.categories.map((cat, i) => {
            return(
                i === catLength ? cat : cat + ','
            );
        })

        axios.get(BlogData + '&category=' + categories + '&exclude=' + this.props.id)
            .then((blogData) => {
                console.log(blogData);
                let blogs = blogData.data.map((blog) => {
                    return(
                        <div className="blog">
                            <p className="date">{moment(blog.date).format('MMMM D')}</p>
                            <h3>
                                <Link
                                    to={"/"+blog.slug+'/'}
                                    key={blog.id}
                                >
                                    {entities.decode(blog.title.rendered)} >
                                </Link>
                            </h3>
                        </div>
                    );
                })
                component.setState({
                    data: true,
                    blogs: blogs,
                })
            })
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });
    }

    render(){
        if(this.state.data){
            return(
                <div className="blog-recommend">
                    <h2>You might also be interested in</h2>
                    {this.state.blogs}
                </div>
            )
        }
        else if(this.state.error){
            return null;
        }
        return <Loader />;
    }
}

export default BlogRecommend;