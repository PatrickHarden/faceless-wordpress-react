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
import Stores from '../components/StoreList';
import EventCTA from '../components/EventCTA';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const StoreCategories = SiteURL + '/wp-json/wp/v2/imag_taxonomy_store_category?per_page=100';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class Shopping extends Component {
    constructor(props) {
        super(props);

        this.storeNameFilter = this.storeNameFilter.bind(this);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            optionsData: '',
            pageData: '',
            categoryData: '',
            categoryOptions: '',
            searchFilter: this.props.location.query.s ? this.props.location.query.s : '',
        };
    }

    componentWillMount() {
        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=shopping'),
            axios.get(Pages + '?slug=home'),
            axios.get(PropertyOptions),
            axios.get(StoreCategories),
        ])
            .then(axios.spread(function (site, page, home, options, categories) {

                let categoryOptions = categories.data.map((category) => {
                    return (
                        <option value={category.id}>{entities.decode(category.name)}</option>
                    );
                });

                component.setState({
                    data: true,
                    siteData: site.data,
                    pageData: page.data[0],
                    homeData: home.data[0],
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
            let homeData = this.state.homeData.acf;
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
                        title={this.state.pageData.acf.title ? this.state.pageData.acf.title : this.state.pageData.title.rendered}
                        titleCopy={this.state.pageData.acf.title_copy}
                        color={this.state.pageData.acf.title_section_color}
                        aboveBelow={this.state.pageData.acf.above_below}
                        imageMobile={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_mobile : false}
                        imageDesktop={this.state.pageData.acf.use_featured_image ? this.state.pageData.acf.header_featured_image_desktop : false}
                    />

                    <div className="lookbook">
                        <div className="container">
                            <div className="heading-wrapper hidden-xs">
                                <h2 className="heading">{homeData.lookbook_title ? homeData.lookbook_title : 'Destination Dallas'}</h2>
                                {homeData.lookbook_season &&
                                <h2 className="season">{homeData.lookbook_season}</h2>
                                }
                            </div>
                            <div className="image-wrapper">
                                {homeData.lookbook_featured_image &&
                                <img className="lookbook-feature" src={homeData.lookbook_featured_image.url}
                                     alt={homeData.lookbook_featured_image.alt ? homeData.lookbook_featured_image.alt : 'lookbook featured image'}/>
                                }
                            </div>
                            <div className="heading-wrapper visible-xs">
                                <h2 className="heading">{homeData.lookbook_title ? homeData.lookbook_title : 'Destination Dallas'}</h2>
                                {homeData.lookbook_season &&
                                <h2 className="season">{homeData.lookbook_season}</h2>
                                }
                            </div>
                            {homeData.lookbook_button &&
                            <Link className="plaza-button"
                                  to={homeData.lookbook_button.target === '_blank' ? homeData.lookbook_button.url : homeData.lookbook_button.url.replace(SiteURL, "")}
                                  target={homeData.lookbook_button.target}>{homeData.lookbook_button.title}</Link>
                            }
                        </div>
                    </div>
                    <div className="filters">
                        <img className="foliage hidden-xs" src={Images + 'background-foliage.png'} alt="foliage"/>
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
                            </div>
                        </div>
                    </div>
                    <Stores storeSearch={this.state.searchFilter} pageData={this.state.pageData} storeType={'retailer'} />
                    <EventCTA/>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default Shopping;
