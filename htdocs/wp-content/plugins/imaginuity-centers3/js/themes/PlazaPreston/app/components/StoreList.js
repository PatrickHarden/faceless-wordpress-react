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
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

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

            let comingSoon = false;

            if (store.acf.flags) {
                store.acf.flags.map(function (flag) {
                    if (flag === 'Coming Soon') {
                        comingSoon = true;
                    }
                });
            }

            if(store.acf.store_type === component.props.storeType){
                return (
                    <Col
                        xs={12}
                        sm={6}
                        md={4}
                        id={store.id}
                        key={store.id}
                        data-filter={entities.decode(store.title.rendered.toLowerCase())}
                        data-category={(store.imag_taxonomy_store_category ? '[' + store.imag_taxonomy_store_category + ']' : 0)}
                        className="store"
                    >
                        <div className="inner-wrapper">

                            <Link
                                title={entities.decode(store.title.rendered)}
                                key={store.id}
                                to={'/stores/' + store.slug + '/'}
                            >
                                <div className="image-container">
                                    <img src={store.acf.featured_image ? store.acf.featured_image.url : Images + 'logo.jpg'}
                                         alt={entities.decode(store.title.rendered)}/>
                                </div>
                                <h4>{entities.decode(store.title.rendered)}</h4>
                            </Link>
                            {store.acf.phone_number &&
                            <a className="phone visible-xs" href={"tel:" + store.acf.phone_number}><img
                                className="phone-icon" src={Images + 'icon-phone.png'} alt="phone"/></a>
                            }
                            {store.acf.address_1 &&
                            <a className="location" href={"//maps.google.com/?q=" + store.acf.address_1 + '+' + store.acf.address_2} target="_blank"><img
                                className="location-icon" src={Images + 'icon-location.png'} alt="location"/></a>
                            }
                        </div>
                    </Col>
                );
            }

        });

        this.setState({
            data: true,
            pageData: this.props.pageData,
            stores: stores,
        });

    }

    render() {
        if (this.state.data) {
            return (
                <Grid>
                    <Row>
                        {this.state.stores}
                    </Row>
                </Grid>
            );
        }
        return <Loader type="cylon"/>;
    }
}

export default Stores;