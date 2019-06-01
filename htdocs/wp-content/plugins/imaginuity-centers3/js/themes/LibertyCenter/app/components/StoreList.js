// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
let moment = require('moment');
let momentRange = require('moment-range/dist/moment-range.js');
moment = momentRange.extendMoment(moment);

// Components
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const StoresData = SiteURL + '/wp-json/wp/v2/stores?per_page=100';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class Stores extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            error: false,
            stores: '',
            events: false,
            pageData: ''
        }
    }

    componentWillMount() {
        let component = this;

        let data = [];

        axios.all([
            axios.get(StoresData),
        ])
            .then(axios.spread(function (storeData) {
                let storeQueries = [];
                if (storeData.headers['x-wp-totalpages'] > 1) {
                    let paginationCount = storeData.headers['x-wp-totalpages'];
                    let x = 1;
                    while (x <= paginationCount) {
                        storeQueries.push(axios.get(StoresData + '&page=' + x));
                        x++;
                    }
                    axios.all(storeQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.handleDataResponse(data);
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                            component.setState({
                                error: true,
                            })
                        })
                }
                else {
                    component.handleDataResponse(storeData.data);
                }
            }))
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });

    }

    handleDataResponse(storeData) {

        let component = this;

        // Retrieve stores, sort alphabetically
        let sortedStoreData = storeData.sort(function (a, b) {
            let itemA = entities.decode(a.title.rendered.toUpperCase());
            let itemB = entities.decode(b.title.rendered.toUpperCase());
            return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
        });

        let stores = sortedStoreData.map(function (store) {

            if((component.props.storeType === 'retailer' && !store.acf.store_type) || (store.acf.store_type === component.props.storeType)){

                let comingSoon = false;

                if (store.acf.flags) {
                    store.acf.flags.map(function (flag) {
                        if (flag === 'Coming Soon') {
                            comingSoon = true;
                        }
                    });
                }

                let parkingTooltip =
                    <Tooltip className="visible-xs visible-sm">
                        {store.acf.convenient_parking ? store.acf.convenient_parking : 'Not Available'}
                    </Tooltip>;

                let phoneTooltip =
                    <Tooltip className="visible-xs visible-sm">
                        <span>Not Available</span>
                    </Tooltip>;

                return (
                    <Col
                        xs={12}
                        id={store.id}
                        key={store.id}
                        data-filter={entities.decode(store.title.rendered.toLowerCase())}
                        data-category={(store.imag_taxonomy_store_category ? '[' + store.imag_taxonomy_store_category + ']' : 0)}
                        className="store"
                    >
                        <div className="inner-wrapper">
                            <h4>
                                <Link
                                    title={entities.decode(store.title.rendered)}
                                    key={store.id}
                                    to={'/stores/' + store.slug + '/'}
                                >
                                    {entities.decode(store.title.rendered)}
                                </Link>
                            </h4>

                            <div className="store-info">
                                <div className="parking">
                                    <OverlayTrigger placement="top" overlay={parkingTooltip}
                                                    className="visible-xs visible-sm">
                                        <img className="visible-xs visible-sm" src={Images + 'directory-parking-icon.png'} alt="Best Parking Lot"/>
                                    </OverlayTrigger>
                                    <p className="hidden-xs hidden-sm">
                                        {store.acf.convenient_parking &&
                                        store.acf.convenient_parking
                                        }
                                        {!store.acf.convenient_parking &&
                                        'Not Available'
                                        }
                                    </p>
                                </div>

                                <div className="phone-number">
                                    <div className="visible-xs visible-sm">
                                        {store.acf.phone_number &&
                                        <a href={"tel:" + store.acf.phone_number}>
                                            <img src={Images + 'directory-phone-icon.png'} alt="Phone Number"
                                                 className="visible-xs visible-sm"/>
                                        </a>
                                        }
                                        {!store.acf.phone_number &&
                                        <OverlayTrigger placement="top" overlay={phoneTooltip}>
                                            <img src={Images + 'directory-phone-icon.png'} alt="Phone Number"
                                                 className="visible-xs visible-sm"/>
                                        </OverlayTrigger>
                                        }
                                    </div>
                                    <p className="hidden-xs hidden-sm">
                                        {store.acf.phone_number &&
                                        <a href={"tel:" + store.acf.phone_number}>
                                            {store.acf.phone_number}
                                        </a>
                                        }
                                        {!store.acf.phone_number &&
                                        "Not Available"
                                        }
                                    </p>
                                </div>
                                <Link title={entities.decode(store.title.rendered)} key={store.id}
                                      to={'/stores/' + store.slug + '/'} className="liberty-button dark">
                                    {comingSoon ? 'Coming Soon' : 'See Store'}
                                </Link>
                            </div>
                        </div>
                    </Col>
                );
            }
        });

        stores = stores.filter(function (el) {
            return el != null;
        });


        this.setState({
            data: true,
            pageData: this.props.pageData,
            stores: stores,
        });

        if (this.state.data && this.props.storeSearch) {
            this.storeNameFilter();
        }
    }

    storeNameFilter = (e) => {

        let filterValue = this.props.storeSearch.toLowerCase();
        let storeValue;

        $('#store-categories').val('all');

        $('#store-submit').addClass('active');

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

    render() {
        if (this.state.data) {
            return (
                <Grid className="full">
                    <Row>
                        {this.state.stores.length > 0 ? this.state.stores : <div className="container"><h2 className='directory-empty'>There are no retailers in the {this.props.storeType}. Please check again at a later date.</h2></div>}
                    </Row>
                </Grid>
            );
        }
        return <Loader type="cylon"/>;
    }
}

export default Stores;