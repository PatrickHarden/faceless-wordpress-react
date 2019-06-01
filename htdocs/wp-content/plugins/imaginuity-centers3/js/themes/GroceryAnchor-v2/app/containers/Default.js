// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import Loader from '../components/Loader';
import InteriorHeader from '../components/InteriorHeader';
import PageLayout from '../components/PageLayout';
import GravityForm from '../components/GravityForm';
import Signup from '../components/Signup';
import NoPage from '../components/404';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class Default extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            optionsData: '',
            pageData: '',
        };
    }

    componentWillMount(){
        this.retrievePageData();
    }

    componentWillReceiveProps(nextProps){
        // Handles navigation between interior pages (pages of the same template)
        if(nextProps.params.pageSlug !== this.state.pageSlug){
            this.setState({
                data: false,
                pageSlug: nextProps.params.pageSlug
            }, function(){
                this.retrievePageData();
            });
        }
    }

    retrievePageData(){
        const component = this;
        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(Pages + '?slug=' + this.props.params.pageSlug),
                axios.get(PropertyOptions),
            ])
            .then(axios.spread(function (site, home, pageData, options) {

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    pageData: pageData.data[0],
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if(this.state.data){
            if(this.state.pageData){
                return (
                    <div className="template-default" data-page="home">
                        <Helmet
                            title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                            meta={[
                                {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                            ]}
                        />
                        <InteriorHeader pageData={this.state.pageData} />
                        <PageLayout pageData={this.state.pageData} />
                        {this.state.pageData.acf.gravity_form &&
                        <Grid>
                            <Row>
                                <Col xs={12}>
                                    <GravityForm gformID={this.state.pageData.acf.gravity_form.id} />
                                </Col>
                            </Row>
                        </Grid>
                        }
                        {this.state.homeData.acf.enable_mail_signup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                        }

                    </div>
                );
            }
            else{
                return (<NoPage />);
            }
        }
        return <Loader />;
    }
}

export default Default;
