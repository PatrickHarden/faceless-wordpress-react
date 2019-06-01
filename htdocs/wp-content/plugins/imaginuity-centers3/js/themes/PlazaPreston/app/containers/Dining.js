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
import InteriorHeader from '../components/InteriorHeaderDining';
import Stores from '../components/StoreList';
import EventCTA from '../components/EventCTA';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class Dining extends Component {
    constructor(props) {
        super(props);

        this.storeNameFilter = this.storeNameFilter.bind(this);

        this.state = {
            data: false,
            siteData: '',
            optionsData: '',
            pageData: '',
            searchFilter: this.props.location.query.s ? this.props.location.query.s : '',
        };
    }

    componentWillMount() {
        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=dining'),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function (site, page, options) {

                console.log(page);


                component.setState({
                    data: true,
                    siteData: site.data,
                    pageData: page.data[0],
                    optionsData: options.data,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        if (this.state.searchFilter) {
            $('#store-submit').addClass('active');
        }
    }

    storeNameFilter = (e) => {

        this.setState({
            searchFilter: e.target.value,
        })

        let filterValue = this.state.searchFilter.toLowerCase();
        let storeValue;

        if (filterValue) {
            $('#store-submit').addClass('active');
        } else {
            $('#store-submit').removeClass('active');
        }

        $('.store').each(function () {
            storeValue = $(this).data('filter');
            if (storeValue.indexOf(filterValue) === -1) {
                // $(this).slideUp();
                $(this).hide();
            }
            else {
                $(this).show();
            }
        });
    }

    clearStoreNameFilter = (e) => {
        e.preventDefault();

        $('#store-submit').removeClass('active');
        $('#store-name').val('');

        $('.store').each(function () {
            $(this).show();
        });
        this.setState({
            searchFilter: '',
        });
    }


    render() {
        if (this.state.data) {
            return (
                <div className="template-shopping" data-page="shopping">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {
                                'name': 'description',
                                'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)
                            },
                        ]}
                    />

                    <InteriorHeader
                        storeID={this.state.pageData.acf.featured_restaurant.ID}
                        title={this.state.pageData.acf.title ? this.state.pageData.acf.title : this.state.pageData.title.rendered}
                        titleCopy={this.state.pageData.acf.title_copy}
                        color={this.state.pageData.acf.title_section_color}
                        aboveBelow={this.state.pageData.acf.above_below}
                    />

                    <div className="filters">
                        <div className="container">
                            <div className="filter-wrap">
                                <form action="" id="store-search" onSubmit={this.clearStoreNameFilter}>
                                    <label className="input-label" for="store-name">
                                        <span className="sr-only">Store Name</span>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            id="store-name"
                                            value={this.state.searchFilter}
                                            onChange={this.storeNameFilter}
                                        />
                                    </label>
                                    <label className="submit-label" for="store-submit">
                                        <span className="sr-only">Search store</span>
                                        <input type="submit" id="store-submit"/>
                                    </label>
                                </form>
                            </div>
                        </div>
                    </div>
                    <Stores storeSearch={this.state.searchFilter} pageData={this.state.pageData} storeType={'restaurant'} />
                    <EventCTA/>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default Dining;
