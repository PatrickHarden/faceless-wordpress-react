// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
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
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let StoresData = SiteURL + '/wp-json/wp/v2/stores?per_page=100';
let GlobalStores = SiteURL + '/wp-json/ic3/v1/global_store/';
let Sales = SiteURL + '/wp-json/wp/v2/sales?per_page=100';
const Pages = SiteURL + '/wp-json/wp/v2/pages';

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

        axios.all([
            axios.get(StoresData),
            axios.get(Sales),
            axios.get(Pages + '?slug=directory'),
        ])
            .then(axios.spread(function (storeData, sales, pageData) {

                let storeQueries = [];
                let data = [];

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
                            component.buildStores(data, sales, pageData);
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                        })
                }
                else {
                    data = storeData.data;
                    component.buildStores(data, sales, pageData);
                }

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    buildStores(data, sales, pageData) {
        let component = this;
        let globalStores = [];
        let globalStoreList = [];
        let sortedData;
        let salesData;

        salesData = sales.data;


        // Retrieve stores, sort alphabetically
        sortedData = data.sort(function (a, b) {
            let itemA = entities.decode(a.title.rendered.toUpperCase());
            let itemB = entities.decode(b.title.rendered.toUpperCase());
            return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
        });

        sortedData.map((store) => {
            if (store.acf.global_store_selector) {
                if (store.acf.global_store_selector.selected_posts.length > 0) {
                    globalStoreList.push(axios.get(GlobalStores + store.acf.global_store_selector.selected_posts[0].ID));
                }
            }
        });

        component.setState({
            pageData: pageData.data[0],
        });

        axios.all(globalStoreList)
            .then((globalStoreReturn) => {
                globalStoreReturn.map((gStore) => {
                    globalStores[gStore.data.id] = {color: gStore.data.logo_color, mono: gStore.data.logo_monochrome};
                });

                // Build store tiles
                let stores = sortedData.map(function (data) {
                    let storeFlags = ((data.acf.flags ? data.acf.flags : false));

                    let activeFlags = [];

                    salesData.map((sale) => {
                        if (sale.acf.related_store) {
                            if (sale.acf.related_store.post_title === data.title.rendered && (sale.acf.end_date >= moment().format('YYYYMMDD'))) {
                                activeFlags.push(
                                    <div className="flag deals">
                                        <span className="mobile" aria-label="deals" title="Deals"><p>Deals!</p></span>
                                    </div>);
                            }
                        }
                    });

                    if (storeFlags && data.acf.custom_flag !== true) {
                        storeFlags = storeFlags.map(function (flag) {
                            switch (flag) {
                                case 'Coming Soon':
                                    return (
                                        <div className="flag coming-soon">
                                            <span className="mobile" aria-label="Coming Soon" title="Coming Soon"><p>Coming Soon!</p></span>
                                        </div>);
                                    break;
                                default:
                                    break;
                            }
                        });
                        activeFlags.push(storeFlags);
                    } else if (data.acf.custom_flag === true) {
                        let customFlag = <div className="flag custom">
                            <span className="mobile"
                                  aria-label={data.acf.custom_flag_value}><p>{data.acf.custom_flag_value}</p></span>
                        </div>;

                        activeFlags.push(customFlag);
                    }

                    let colorImg;
                    let monoImg;

                    // check for linked global stores. If global store exists, use its logo. Local store's logos take precedent,
                    // even if a global store is present
                    if (data.acf.global_store_selector) {
                        if (data.acf.global_store_selector.selected_posts.length > 0) {
                            let gStoreID = data.acf.global_store_selector.selected_posts[0].ID;
                            colorImg = (data.acf.logo_color ? data.acf.logo_color : globalStores[gStoreID].color);
                            monoImg = (data.acf.logo_monochrome ? data.acf.logo_monochrome : globalStores[gStoreID].mono);
                        }
                    }
                    else {
                        colorImg = data.acf.logo_color;
                        monoImg = data.acf.logo_monochrome;
                    }

                    // Build the log tiles as background images, or display the store name if no logo is present
                    let colorLogo = {
                        background: 'url(' + colorImg + ') no-repeat center center',
                        backgroundSize: 'auto'
                    };
                    let monoLogo = {background: 'url(' + monoImg + ') no-repeat center center', backgroundSize: 'auto'};

                    return (
                        <Col
                            xs={12}
                            sm={6}
                            md={4}
                            id={data.id}
                            key={data.id}
                            data-filter={entities.decode(data.title.rendered.toUpperCase().charAt(0))}
                            data-category={(data.imag_taxonomy_store_category ? '[' + data.imag_taxonomy_store_category + ']' : 0)}
                            className="store border-color-setter-lighter"
                        >
                            {activeFlags ? <div className="flags"> {activeFlags} </div> : null}
                            <Link title={entities.decode(data.title.rendered)} key={data.id}
                                  to={'/stores/' + data.slug + '/'}>
                                {colorImg &&
                                <div style={colorLogo} className={"logo " + (monoImg ? "logo-color" : false)}><p
                                    className="sr-only">{entities.decode(data.title.rendered)}</p></div>
                                }
                                {monoImg &&
                                <div style={monoLogo} className={"logo " + (colorImg ? "logo-mono" : false)}><p
                                    className="sr-only">{entities.decode(data.title.rendered)}</p></div>
                                }
                                {!colorImg && !monoImg &&
                                <p>{entities.decode(data.title.rendered)}</p>
                                }
                            </Link>
                        </Col>
                    );
                });
                this.setState({
                    data: true,
                    stores: stores,
                });
            })
            .catch((err) => {
                console.log(err)
                component.setState({
                    error: true,
                })
            })
    }

    render() {
        if (this.state.data) {
            return (
                <Grid>
                    <Row title="Shops on location">
                        {this.state.pageData.acf.enable_deal_of_the_day_tile &&
                        <Col
                            xs={12}
                            sm={6}
                            md={4}
                            data-filter={'D'}
                            data-category={0}
                            className="store border-color-setter-lighter"
                        >
                            <Link title={'Deal of the Day'} to={this.state.pageData.acf.deal_of_the_day_link}>
                                <div style={{
                                    background: 'url(' + this.state.pageData.acf.deal_of_the_day_icon.url + ') no-repeat center center',
                                    backgroundSize: 'auto'
                                }} className={"logo"}>
                                    <p className="sr-only">Deal of the Day</p>
                                </div>
                            </Link>
                        </Col>
                        }
                        {this.state.stores}
                    </Row>
                </Grid>
            );
        }
        else if (this.state.error) {
            return (
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2>An error occurred retrieving the Stores.</h2>
                            <p>Please refresh the page and try again. If this error continues, please <Link
                                to={'/contact-us'}>contact us</Link> and report the issue.</p>
                            <br/>
                        </Col>
                    </Row>
                </Grid>
            )
        }
        return <Loader/>;
    }
}

export default Stores;