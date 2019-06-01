// Packages
import React, {PropTypes, Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {ReactBootstrap, Grid, Row, Col, Button, Tooltip, OverlayTrigger} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import moment from 'moment';

// Components
import Radium from 'radium';
import PixelTrackingCode from './PixelTrackingCode';
import Loader from '../components/Loader';
import HoursToday from './HoursToday';
import EyeSlash from 'react-icons/lib/fa/eye-slash';
import Eye from 'react-icons/lib/fa/eye';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const MenuLocationsURL = SiteURL + '/wp-json/wp-api-menus/v2/menu-locations';
const Menus = SiteURL + '/wp-json/wp-api-menus/v2/menus/';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class Nav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteName: '',
            logo: '',
            navItems: '',
            primaryColor: '',
            secondaryColor: '',
            optionData: '',
        }
    }

    componentWillMount() {

        let component = this;
        let navItems;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(PropertyOptions),
            axios.get(MenuLocationsURL),
        ])
            .then(axios.spread(function (site, options, menuLocations) {

                let primary = menuLocations.data.primary.ID;

                axios.get(Menus + primary)
                    .then((primary) => {
                        let navItems = primary.data.items.map((item, i) => {

                            if (item.children) {
                                return (
                                    <div className="dropdown" id={"dropdown " + i}>
                                        <p className="menu-dropdown background-color-setter"
                                           data-dropdown={i}
                                           onClick={component.dropdownActive.bind(this)}>{entities.decode(item.title)}
                                            <span>{entities.decode('&#9660;')}</span></p>
                                        <ul className="dropdown-items">
                                            {item.children.map((child, j) => {
                                                return (
                                                    <li>
                                                        <Link to={'/' + child.object_slug + '/'} key={j + '.' + i}
                                                              className="menu-item dropdown-item"
                                                              activeClassName="active"
                                                              onClick={component.menuCollapse.bind(this)}>{entities.decode(child.title)}</Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )
                            }
                            else if (item.type === "custom") {

                                let url = item.url.toString();
                                return <a href={url} className="menu-item"
                                          target="_blank">{entities.decode(item.title)}</a>
                            }
                            else {
                                return (
                                    <Link to={'/' + (item.object_slug == 'home' ? '' : item.object_slug + '/')} key={i}
                                          className="menu-item" activeClassName="active"
                                          onClick={component.menuCollapse.bind(this)}>{entities.decode(item.title)}</Link>
                                );
                            }

                        });

                        component.setState({
                            data: true,
                            siteName: site.data.name,
                            logo: options.data.acf.logo,
                            navItems: navItems,
                            primaryColor: options.data.acf.primary_color,
                            secondaryColor: options.data.acf.secondary_color,
                            optionsData: options.data,
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }))
            .catch((err) => {
                console.log(err);
            });
    }

    LightenDarkenColor(col, amt) {

        var usePound = false;

        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }

        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        var g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    }

    hexToRGB(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }

    menuIconAnimate() {
        $("#menu-icon").toggleClass('open');
        $('.nav-menu').toggleClass('active');
    }

    dropdownActive(e) {
        if ($(e.target).closest('.dropdown').hasClass('active')) {
            $('.dropdown').removeClass('active');
        }
        else {
            $('.dropdown').removeClass('active');
            $(e.target).closest('.dropdown').addClass('active');
        }
    }

    navigateHome() {
        browserHistory.push('/');
        this.menuCollapse();
    }

    menuCollapse() {
        $('.nav-menu').removeClass('active');
        $('.dropdown').removeClass('active');
        $('#menu-icon').removeClass('open');
    }


    toggleEye() {
        let eyeContainer = $('.high-contrast-container');
        let eyeSlash = $('.high-contrast-container .eye-slash');
        let eye = $('.high-contrast-container .eye');
        let highContrast = $('#root');
        let nav = $('.nav-container');
        let footer = $('.footer');

        eyeContainer.toggleClass('active');
        eye.toggle();
        eyeSlash.toggle();

        if (eyeContainer.hasClass('active')) {
            highContrast.addClass('high-contrast');
            nav.addClass('high-contrast');
            footer.addClass('high-contrast');
        } else {
            highContrast.removeClass('high-contrast');
            nav.removeClass('high-contrast');
            footer.removeClass('high-contrast');
        }

    }

    render() {
        let loaderStyles = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 9999,
            background: 'white',
        };

        if (this.state.data) {

            const eyeTooltip = (
                <Tooltip id="high-contrast">
                    Toggle high-contrast mode
                </Tooltip>
            );

            return (
                <div>
                    {this.state.optionsData.acf.enable_pixel_tracking_code &&
                    <PixelTrackingCode pixelCode={this.state.optionsData.acf.pixel_tracking_code}/>
                    }
                    {this.state.optionsData.acf.emergency_banner &&
                    <div className="emergency-banner">
                        <span className="text-center"
                              dangerouslySetInnerHTML={{__html: this.state.optionsData.acf.emergency_banner}}></span>
                    </div>
                    }
                    <div className="nav-container">
                        <a href="#content" className="sr-only sr-only-focusable">Skip to main content</a>
                        <Radium.Style
                            scopeSelector=".background-color-setter"
                            rules={{
                                backgroundColor: this.state.primaryColor + ' !important',
                                fill: this.state.primaryColor + ' !important',
                                '.dropdown': {
                                    backgroundColor: this.LightenDarkenColor(this.state.primaryColor, 30),
                                }
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".background-color-setter-lighter"
                            rules={{
                                backgroundColor: this.hexToRGB(this.state.primaryColor, 0.5),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".background-color-setter-lightest"
                            rules={{
                                backgroundColor: this.hexToRGB(this.state.primaryColor, 0.1),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".panel-default > .panel-heading"
                            rules={{
                                backgroundColor: this.hexToRGB(this.state.primaryColor, 0.1),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .background-color-setter, .high-contrast .background-color-setter-lighter, .high-contrast .background-color-setter-lightest, .high-contrast .panel-default > .panel-heading"
                            rules={{
                                backgroundColor: 'white !important',
                                color: 'black !important',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".background-color-setter.btn:hover"
                            rules={{
                                backgroundColor: this.LightenDarkenColor(this.state.primaryColor, 30),
                                background: this.LightenDarkenColor(this.state.primaryColor, 30),
                                color: 'white'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .background-color-setter.btn, .high-contrast .background-color-setter.btn:hover"
                            rules={{
                                backgroundColor: 'black !important',
                                background: 'black !important',
                                color: 'white !important'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".slick-arrow"
                            rules={{
                                backgroundColor: this.state.primaryColor,

                                ':hover': {
                                    backgroundColor: this.LightenDarkenColor(this.state.primaryColor, 50),
                                    background: this.LightenDarkenColor(this.state.primaryColor, 50)
                                }
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".slick-arrow:hover"
                            rules={{
                                backgroundColor: this.LightenDarkenColor(this.state.primaryColor, 50),
                                background: this.LightenDarkenColor(this.state.primaryColor, 50)
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".font-color-setter, .menu-item:hover, .menu-dropdown:hover"
                            rules={{
                                color: this.state.primaryColor + ' !important'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".font-color-setter-darker"
                            rules={{
                                color: this.state.primaryColor + ' !important',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .font-color-setter, .high-contrast .menu-item, .high-contrast .menu-item:hover, .high-contrast .menu-dropdown, .high-contrast .menu-dropdown:hover, .high-contrast .font-color-setter-darker"
                            rules={{
                                color: 'black !important',
                                backgroundColor: 'white !important',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".border-color-setter"
                            rules={{
                                borderColor: this.state.primaryColor,
                                stroke: this.state.primaryColor,
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".border-color-setter-lighter"
                            rules={{
                                borderColor: this.LightenDarkenColor(this.state.primaryColor, 50),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .border-color-setter, .high-contrast .border-color-setter-lighter"
                            rules={{
                                borderColor: 'black !important',
                                stroke: 'black !important',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".featured-events-slider .featured-events .slick-dots li button:before"
                            rules={{
                                borderColor: this.state.primaryColor,
                                color: this.state.primaryColor
                            }}
                        />

                        <OverlayTrigger placement="bottom" overlay={eyeTooltip}>
                            <div className='high-contrast-container'>
                                <EyeSlash className='eye-slash background-color-setter' onClick={this.toggleEye}/>
                                <Eye className='eye' style={{
                                    "display": "none"
                                }} onClick={this.toggleEye}/>
                            </div>
                        </OverlayTrigger>

                        <div id="menu-icon" className={this.state.optionsData.acf.emergency_banner ? 'emergency' : ''}
                             onClick={this.menuIconAnimate.bind(this)}>
                            <span className="background-color-setter"></span>
                            <span className="background-color-setter"></span>
                            <span className="background-color-setter"></span>
                            <span className="background-color-setter"></span>
                        </div>
                        <div className="logo-container">
                            <img src={this.state.logo} alt={this.state.siteName + ' logo'}
                                 className="img-responsive logo" onClick={this.navigateHome.bind(this)}/>
                        </div>
                        <HoursToday/>
                        <span className="menu-placeholder background-color-setter">
                        <div className="nav-menu background-color-setter">
                            {this.state.navItems}
                        </div>
                    </span>
                        <img src="https://via.placeholder.com/315x335" className="nav-thumbnail"
                             alt="navigation thumbnail"/>
                    </div>
                    <OverlayTrigger placement="bottom" overlay={eyeTooltip}>
                        <div className='high-contrast-container desktop'>
                            <EyeSlash className='eye-slash background-color-setter' onClick={this.toggleEye}/>
                            <Eye className='eye' style={{
                                "display": "none"
                            }} onClick={this.toggleEye}/>
                        </div>
                    </OverlayTrigger>
                </div>
            );
        }
        return <Loader type="bars" loaderStyles={loaderStyles}/>;
    }
}

export default Nav;