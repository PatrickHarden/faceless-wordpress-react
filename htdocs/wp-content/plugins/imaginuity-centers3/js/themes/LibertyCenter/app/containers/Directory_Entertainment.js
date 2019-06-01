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
import InteriorHeaderDining from '../components/InteriorHeaderDining';
import Stores from '../components/StoreList';
import Loader from '../components/Loader';
import FooterLinks from '../components/FooterLinks';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const StoreCategories = SiteURL + '/wp-json/wp/v2/imag_taxonomy_store_category?per_page=100';

class Entertainment extends Component {
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
            axios.get(Pages + '?slug=entertainment'),
            axios.get(PropertyOptions),
            axios.get(StoreCategories),
        ])
            .then(axios.spread(function (site, page, options, categories) {

                let categoryOptions = categories.data.map((category) => {
                    return (
                        <option value={category.id}>{entities.decode(category.name)}</option>
                    );
                });

                component.setState({
                    data: true,
                    siteData: site.data,
                    pageData: page.data[0],
                    optionsData: options.data,
                    categoryData: categories.data,
                    categoryOptions: categoryOptions,
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

    categoryFilter = (e) => {

        let filterValue = e.target.value;

        $('#store-name').val('');

        if (filterValue !== 'all') {
            $('.store').each(function () {
                let eventCategories = $(this).data('category');
                if (eventCategories.indexOf(parseInt(filterValue)) === -1) {
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
            // $('.store').slideDown();
            $('.store').show();
        }
    }

    storeNameFilter = (e) => {

        this.setState({
            searchFilter: e.target.value,
        })

        let filterValue = this.state.searchFilter.toLowerCase();
        let storeValue;

        $('#store-categories').val('all');

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
                <div className="template-directory entertainment" data-page="entertainment">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {
                                'name': 'description',
                                'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)
                            },
                        ]}
                    />
                    <InteriorHeaderDining
                        title={this.state.pageData.acf.title ? this.state.pageData.acf.title : this.state.pageData.title.rendered}
                        imageMobile={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_desktop : false}
                        contentArea={this.state.pageData.content.rendered ? this.state.pageData.content.rendered : false}
                    />
                    <div className="header-wrapper">
                        <div className="filters">
                            <div className="container">
                                <div className="filter-wrap">
                                    <form action="" id="store-filter">
                                        <label for="store-categories">
                                            <span className="sr-only">Store Categories</span>
                                            <select
                                                type="select"
                                                placeholder="Category Filter"
                                                id="store-categories"
                                                onChange={this.categoryFilter}
                                            >
                                                <option value="all">Filter</option>
                                                {this.state.categoryOptions}
                                            </select>
                                        </label>
                                    </form>
                                    <form action="" id="store-search" onSubmit={this.clearStoreNameFilter}>
                                        <label className="input-label" for="store-name">
                                            <span className="sr-only">Store Name</span>
                                            <input
                                                type="text"
                                                placeholder="Store Name"
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
                                {this.state.optionsData.acf.printable_directory &&
                                <div className="button-wrapper">
                                    <Link className="printable-directory liberty-button white" to={this.state.optionsData.acf.printable_directory} target="_blank">
                                        Printable Directory
                                    </Link>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                    <Stores
                        storeSearch={this.state.searchFilter}
                        pageData={this.state.pageData}
                        storeType={'entertainment'}
                    />
                    <FooterLinks optionsData={this.state.optionsData}/>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default Entertainment;
