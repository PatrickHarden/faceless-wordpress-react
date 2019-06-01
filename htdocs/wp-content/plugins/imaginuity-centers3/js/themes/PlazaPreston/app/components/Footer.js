// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Tooltip, OverlayTrigger} from 'react-bootstrap';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import GravityForm from './GravityForm';
import EyeSlash from 'react-icons/lib/fa/eye-slash';
import Eye from 'react-icons/lib/fa/eye';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";
const MenuLocations = SiteURL + '/wp-json/wp-api-menus/v2/menu-locations';
const Menus = SiteURL + '/wp-json/wp-api-menus/v2/menus/';

class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            optionsData: '',
            socialCount: 0,
            footerNav: false,
        }
    }

    componentWillMount() {

        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(PropertyOptions),
            axios.get(MenuLocations),
        ])
            .then(axios.spread(function (site, options, menuLocations) {

                let socialCount = 0;

                (options.data.acf.facebook_url ? socialCount++ : null);
                (options.data.acf.twitter_url ? socialCount++ : null);
                (options.data.acf.instagram_url ? socialCount++ : null);

                if (menuLocations.data.footer) {
                    axios.get(Menus + menuLocations.data.footer.ID)
                        .then((footerMenu) => {
                            let navCount = footerMenu.data.items.length - 1;
                            let footerNavItems = footerMenu.data.items.map((item, i) => {
                                let link;
                                if (item.object === 'custom') {
                                    link = item.url;
                                }
                                else {
                                    link = '/' + (item.object_slug === 'home' ? '' : item.object_slug)
                                }

                                return (
                                    <Link
                                        to={link + "/"}
                                        key={i}
                                        className=""
                                        target={(item.object === 'custom' ? "_blank" : "")}

                                    >
                                        {entities.decode(item.title)}
                                        {/*{i < navCount &&*/}
                                        {/*<span>*/}
                                            {/*<span className="hidden-xs"> | </span> <br className="visible-xs"/>*/}
                                        {/*</span>*/}
                                        {/*}*/}
                                    </Link>
                                );
                            });

                            component.setState({
                                data: true,
                                siteData: site.data,
                                optionsData: options.data,
                                socialCount: socialCount,
                                footerNav: footerNavItems,
                            });
                        })
                }
                else {
                    component.setState({
                        data: true,
                        siteData: site.data,
                        optionsData: options.data,
                        socialCount: socialCount,
                    });
                }
            }))
            .catch((err) => {
                console.log(err);
            })
    }

    toggleEye = () => {
        let eyeContainer = $('.high-contrast-container');
        let eyeSlash = $('.high-contrast-container .eye-slash');
        let eye = $('.high-contrast-container .eye');
        let highContrast = $('#root');
        let nav = $('.nav-container');

        eyeContainer.toggleClass('active');
        eye.toggle();
        eyeSlash.toggle();

        if (eyeContainer.hasClass('active')) {
            highContrast.addClass('high-contrast');
            nav.addClass('high-contrast')
        } else {
            highContrast.removeClass('high-contrast');
            nav.removeClass('high-contrast');
        }

    }

    render() {
        if (this.state.data) {

            let eyeTooltip =
                <Tooltip id='contrastToggle'>
                    <span>Toggle High Contrast Mode</span>
                </Tooltip>;

            return (
                <div className="footer background-color-setter-secondary">
                    <Grid>
                        <Row>
                            <Col xs={12} md={4} lg={6} className="footer-center-info">
                                <p>
                                    <a className="view-map" href={"//maps.google.com/?q=" + this.state.optionsData.acf.address_1 + '+' + this.state.optionsData.acf.address_2} target="_blank">
                                        {this.state.optionsData.acf.address_1} {" " + this.state.optionsData.acf.address_2} {this.state.optionsData.acf.city}, {this.state.optionsData.acf.state} {this.state.optionsData.acf.zip}
                                    </a>
                                    <br className="visible-xs"/><span className="hidden-xs"> | </span>
                                    {this.state.optionsData.acf.phone &&
                                    <a href={'tel:' + this.state.optionsData.acf.phone}>{this.state.optionsData.acf.phone}</a>
                                    }
                                </p>
                                <div className="footer-nav">
                                    {this.state.footerNav}
                                </div>
                            </Col>
                            <Col xs={12} md={4} lg={3} className="form-container">
                                <GravityForm gformID={this.state.optionsData.acf.footer_form.id} submitLabel="Subscribe" />
                            </Col>
                            <Col xs={12} md={4} lg={3} className="logo-social">
                                <p>Connect with us: #shoptheplaza</p>
                                <div className="logo-social-wrapper">
                                    {this.state.optionsData.acf.facebook_url &&
                                    <a href={this.state.optionsData.acf.facebook_url} target="_blank">
                                        <img
                                            className={'img-responsive footer-social ' + 'social-count-' + this.state.socialCount}
                                            src={Images + 'footer-icon-facebook.png'}
                                            alt={this.state.siteData.name + ' facebook'}/>
                                    </a>
                                    }
                                    {this.state.optionsData.acf.twitter_url &&
                                    <a href={this.state.optionsData.acf.twitter_url} target="_blank">
                                        <img
                                            className={'img-responsive footer-social ' + 'social-count-' + this.state.socialCount}
                                            src={Images + 'footer-icon-twitter.png'}
                                            alt={this.state.siteData.name + ' twitter'}/>
                                    </a>
                                    }
                                    {this.state.optionsData.acf.instagram_url &&
                                    <a href={this.state.optionsData.acf.instagram_url} target="_blank">
                                        <img
                                            className={'img-responsive footer-social ' + 'social-count-' + this.state.socialCount}
                                            src={Images + 'footer-icon-instagram.png'}
                                            alt={this.state.siteData.name + ' instagram'}/>
                                    </a>
                                    }
                                </div>
                                <div className="high-contrast-eye">
                                    <OverlayTrigger placement="bottom" overlay={eyeTooltip}>
                                        <div className='high-contrast-container'>
                                            <EyeSlash className='eye-slash background-color-setter'
                                                      onClick={this.toggleEye}/>
                                            <Eye className='eye' style={{
                                                "display": "none"
                                            }} onClick={this.toggleEye}/>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            </Col>

                        </Row>
                    </Grid>
                </div>
            )
        }
        return null;
    }
}

export default Footer;