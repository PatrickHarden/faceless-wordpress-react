import React, {Component} from 'react';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import axios from "axios"

// Components
import Helmet from 'react-helmet';
import { ReactBootstrap, Grid, Row, Col} from 'react-bootstrap';
import Loader from '../components/Loader';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
let Pages = SiteURL + '/wp-json/wp/v2/pages';
const BlogData = SiteURL + '/wp-json/wp/v2/posts?order=desc';

class Search extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: false,
            numResults: 0,
            pageCount: 0,
            storeCount: 0,
            eventCount: 0,
            pageData: '',
            searchString: this.props.location.query.s,
        }
    }

    sanitize(input){
        let regex = /(<([^>]+)>)/ig;
        return(input ? entities.decode(input.replace(regex, '')).substr(0, 250) + ' [. . .]' : '');
    }

    componentWillMount(){
        this.search();
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        // Handles navigation between interior pages (pages of the same template)
        if(nextProps.location.query.s !== this.state.searchString){
            this.setState({
                data: false,
                searchString: nextProps.location.query.s,
            }, function(){
                this.search();
            });
        }
    }

    search(){
        let component = this;

        axios.all([
            axios.get(PropertyOptions),
            axios.get(SiteURL + '/wp-json/wp/v2/pages?search=' + this.state.searchString),
            axios.get(SiteURL + '/wp-json/wp/v2/stores?search=' + this.state.searchString),
            axios.get(SiteURL + '/wp-json/wp/v2/events?search=' + this.state.searchString),
            axios.get(SiteURL + '/wp-json/wp/v2/posts?search=' + this.state.searchString),
            axios.get(SiteURL + '/wp-json/wp/v2/posts?order=desc&search=' + this.state.searchString),
        ])
            .then(axios.spread((options, pages, stores, events, blogs) => {
                let numResults = pages.data.length + stores.data.length + events.data.length + blogs.data.length;

                let pageResults;
                let storeResults;
                let eventResults;
                let blogResults;

                if(pages.data){
                    pageResults = pages.data.map(function (data) {
                        let excerpt = component.sanitize(data.excerpt.rendered);
                        return (
                            <div className="search-entry page-result">
                                <h3><a href={data.link}>{entities.decode(data.title.rendered)}</a></h3>
                                <div dangerouslySetInnerHTML={{__html: excerpt}}/>
                            </div>
                        );
                    });
                }

                if(stores.data){
                    storeResults = stores.data.map(function (data) {
                        let excerpt = component.sanitize(data.acf.store_copy);
                        return (
                            <div className="search-entry store-result">
                                <h3><a href={data.link}>{entities.decode(data.title.rendered)}</a></h3>
                                <div dangerouslySetInnerHTML={{__html: excerpt}}/>
                            </div>
                        );
                    });
                }

                if(events.data){
                    eventResults = events.data.map(function (data) {
                        let excerpt = component.sanitize(data.acf.post_copy);
                        return (
                            <div className="search-entry event-result">
                                <h3><a href={data.link}>{entities.decode(data.title.rendered)}</a></h3>
                                <div dangerouslySetInnerHTML={{__html: excerpt}}/>
                            </div>
                        );
                    });
                }

                if(blogs.data){
                    blogResults = blogs.data.map(function (data) {
                        let excerpt = component.sanitize(data.excerpt.rendered);
                        return (
                            <div className="search-entry blog-result">
                                <h3><a href={data.link}>{entities.decode(data.title.rendered)}</a></h3>
                                <div dangerouslySetInnerHTML={{__html: excerpt}}/>
                            </div>
                        );
                    });
                }

                let page = {
                    "title": {
                        "rendered": "Search"
                    },
                    "acf": {
                        // "hero_image": pageData.data.acf.hero_image.url,
                        "enable_header_copy": false,
                    }
                }

                this.setState({
                    siteAddress: options.data.acf.city + ', ' + options.data.acf.state,
                    metaDescription: (options.data.acf.meta_description ? options.data.acf.meta_description : ''),
                    numResults: numResults,
                    pageResults: pageResults ? pageResults : '',
                    storeResults: storeResults ? storeResults : '',
                    eventResults: eventResults ? eventResults : '',
                    blogResults: blogResults ? blogResults : '',
                    pageCount: pages.data.length,
                    storeCount: stores.data.length,
                    eventCount: events.data.length,
                    blogCount: blogs.data.length,
                    pageData: page,
                    data: true
                });
            }))
            .catch((err) => {
                console.log("Error in search query");
                console.log(err);
            })
    }

    render(){
        if(this.state.data){

            return (
                <div className='search'>
                    <Helmet
                        title={"Search - " + this.state.searchString + ' | ' + this.state.siteAddress}
                        meta={[
                            {'name': 'description', 'content': this.state.metaDescription},
                        ]}
                    />
                    <Grid>
                        <Row>
                            <Col xs={12} className="col">
                                <h1>Search</h1><br/>
                                <p className="search-results">
                                    <strong>{this.state.numResults}</strong> match(es) for
                                    "<strong>{this.state.searchString}</strong>"
                                </p>
                            </Col>
                            <Col xs={12} className="col">
                                <h2>Pages <small>({this.state.pageCount})</small></h2>
                                {this.state.pageResults}
                                <h2>Stores <small>({this.state.storeCount})</small></h2>
                                {this.state.storeResults}
                                <h2>Events <small>({this.state.eventCount})</small></h2>
                                {this.state.eventResults}
                                <h2>Blogs <small>({this.state.blogCount})</small></h2>
                                {this.state.blogResults}
                            </Col>
                        </Row>
                    </Grid>
                </div>
            )
        }
        return <Loader />
    }
}

export default Search;