import React, {Component} from 'react';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import axios from "axios"

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import { ReactBootstrap, Grid, Row, Col} from 'react-bootstrap';
import Loader from '../components/Loader';

// Endpoints
let SiteURL = 'http://' + document.location.hostname;
let PropertyOptions = SiteURL + '/wp-json/acf/v2/options/?option_id=property_options';

class Search extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: false,
            siteAddress: '',
            numResults: 0,
            pageResults: '',
            storeResults: '',
            eventResults: '',
            saleResults: '',
            jobResults: '',
            pageCount: 0,
            storeCount: 0,
            eventCount: 0,
            saleCount: 0,
            jobCount: 0,
            pageData: '',
            searchString: this.props.location.query.s,
            metaDescription: ''
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
            axios.get(SiteURL + '/wp-json/wp/v2/sales?search=' + this.state.searchString),
            axios.get(SiteURL + '/wp-json/wp/v2/jobs?search=' + this.state.searchString),
        ])
            .then(axios.spread((options, pages, stores, events, sales, jobs) => {
                let numResults = pages.data.length + stores.data.length + events.data.length + sales.data.length + jobs.data.length;

                let pageResults;
                let storeResults;
                let eventResults;
                let saleResults;
                let jobResults;

                if(pages.data){
                    pageResults = pages.data.map(function (data) {
                        let excerpt = component.sanitize(data.excerpt.rendered);
                        return (
                            <div className="search-entry page-result font-color-setter">
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
                            <div className="search-entry store-result font-color-setter">
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
                            <div className="search-entry event-result font-color-setter">
                                <h3><a href={data.link}>{entities.decode(data.title.rendered)}</a></h3>
                                <div dangerouslySetInnerHTML={{__html: excerpt}}/>
                            </div>
                        );
                    });
                }

                if(sales.data){
                    saleResults = sales.data.map(function (data) {
                        let excerpt = component.sanitize(data.acf.post_copy);
                        return (
                            <div className="search-entry sale-result font-color-setter">
                                <h3><a href={data.link}>{entities.decode(data.title.rendered)}</a></h3>
                                <div dangerouslySetInnerHTML={{__html: excerpt}}/>
                            </div>
                        );
                    });
                }

                if(jobs.data){
                    jobResults = jobs.data.map(function (data) {
                        let excerpt = component.sanitize(data.acf.listing_copy);
                        return (
                            <div className="search-entry job-result font-color-setter">
                                <h3><a href={data.link}>{entities.decode(data.title.rendered)}</a></h3>
                                <div dangerouslySetInnerHTML={{__html: excerpt}}/>
                            </div>
                        );
                    });
                }

                let pageData = {
                    "title": {
                        "rendered": "Search"
                    },
                    "acf": {
                        "hero_image": options.data.acf.store_hero_image,
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
                    saleResults: saleResults ? saleResults : '',
                    jobResults: jobResults ? jobResults : '',
                    pageCount: pages.data.length,
                    storeCount: stores.data.length,
                    eventCount: events.data.length,
                    saleCount: sales.data.length,
                    jobCount: jobs.data.length,
                    pageData: pageData,
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
                    <InteriorHeader pageData={this.state.pageData} secondaryTitle={'"' + entities.decode(this.state.searchString) + '"'} />
                    <Grid>
                        <Row>
                            <Col xs={12} className="col font-color-setter">
                                <h1>Search</h1><br/>
                                <p className="search-results">
                                    <strong>{this.state.numResults}</strong> match(es) for
                                    "<strong>{this.state.searchString}</strong>"
                                </p>
                            </Col>
                            <Col xs={12} className="col font-color-setter">
                                <h2>Pages <small>({this.state.pageCount})</small></h2>
                                {this.state.pageResults}
                                <h2>Stores <small>({this.state.storeCount})</small></h2>
                                {this.state.storeResults}
                                <h2>Events <small>({this.state.eventCount})</small></h2>
                                {this.state.eventResults}
                                <h2>Sales <small>({this.state.saleCount})</small></h2>
                                {this.state.saleResults}
                                <h2>Jobs <small>({this.state.jobCount})</small></h2>
                                {this.state.jobResults}
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