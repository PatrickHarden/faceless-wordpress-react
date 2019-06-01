// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';
import Slider from 'react-slick';
import axios from 'axios';

let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Loader from './Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const StoresData = SiteURL + '/wp-json/wp/v2/stores/';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/LibertyCenter/lib/img/";

class FeaturedRetailers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredRetailers: '',
        }
    }

    componentWillMount() {
        let component = this;

        let retailers = [];

        this.props.retailers.map((retailer) => {
            retailers.push(axios.get(StoresData + retailer));
        })

        axios.all(
            retailers
        )
            .then((retailers) => {

                let retailerSlides = retailers.map((retailer) => {
                    return (
                        <div className="store" key={retailer.data.id}>
                            <Link to={'/stores/' + retailer.data.slug}>
                                <div className="image-container">
                                    <img
                                        src={retailer.data.acf.featured_image ? retailer.data.acf.featured_image.url : Images + 'logo.jpg'}
                                        alt={entities.decode(retailer.data.title.rendered)}/>
                                </div>
                                <h3>{entities.decode(retailer.data.title.rendered)}</h3>
                            </Link>
                        </div>
                    );
                })

                component.setState({
                    data: true,
                    featuredRetailers: retailerSlides,
                });
            })
            .catch((err) => {
                console.log('Error');
                console.log(err);
                component.setState({
                    error: true,
                })
            });
    }

    render() {
        if (this.state.data) {
            const settings = {
                dots: false,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                draggable: true,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                speed: 800,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: 'unslick'
                    }
                ]
            };
            return (
                <div className="featured-retailers">
                    <img className="texture" src={Images + 'texture-grey.png'} alt="grey texture"/>
                    <div className="container">
                        {this.props.retailerTitle &&
                        <h2>{this.props.retailerTitle}</h2>
                        }
                        <Slider
                            className={"featured-retailers-slider"}
                            ref={a => this.slider = a}
                            {...settings}
                        >
                            {this.state.featuredRetailers}
                        </Slider>
                    </div>
                    {this.props.retailerLink &&
                    <div className="button-container container">
                        <Link to={this.props.retailerLink.url} className="plaza-button black" target={this.props.retailerLink.target ? '_blank' : '_self'}>{this.props.retailerLink.title}</Link>
                    </div>
                    }
                </div>
            )
        }
        else if (this.state.error) {
            return (
                <div className="featured-retailers">
                    <h2>An error occurred retrieving the Featured Retailers.</h2>
                    <p>Please refresh the page and try again. If this error continues, please <Link to={'/contact-us'}>contact
                        us</Link> and report the issue.</p>
                    <br/>
                </div>
            );
        }
        return <Loader/>;
    }
}

export default FeaturedRetailers;