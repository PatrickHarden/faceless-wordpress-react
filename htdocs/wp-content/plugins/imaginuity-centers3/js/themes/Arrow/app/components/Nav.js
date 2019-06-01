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
import HoursToday from './HoursToday';
import Loader from '../components/Loader';
import EyeSlash from 'react-icons/lib/fa/eye-slash';
import Eye from 'react-icons/lib/fa/eye';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const MenuLocationsURL = SiteURL + '/wp-json/wp-api-menus/v2/menu-locations';
const Menus = SiteURL + '/wp-json/wp-api-menus/v2/menus/';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/Arrow/lib/img";

class Nav extends Component {
    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            data: false,
            siteName: '',
            logo: '',
            navItems: '',
            primaryColor: '',
            secondaryColor: '',
            optionData: '',
            search_string: '',
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
                                    <div className="dropdown" id={i}>
                                        <p className="menu-item menu-dropdown background-color-setter"
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
                                let id = item.id;
                                return <a href={url} className="menu-item"
                                          target="_blank">{entities.decode(item.title)}</a>
                            }
                            else {
                                return (
                                    <Link to={'/' + (item.object_slug === 'home' ? '' : item.object_slug + '/')} key={i}
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

    toggleSearch() {
        let search = $('.search-container form');
        if (search.hasClass('open')) {
            search.removeClass('open');
        }
        else {
            search.addClass('open');
        }
    }

    toggleEye() {
        let eyeContainer = $('.high-contrast-container');
        let eyeSlash = $('.high-contrast-container .eye-slash');
        let eye = $('.high-contrast-container .eye');
        let highContrast = $('#content');
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

    handleChange(e) {
        this.setState({
            search_string: e.target.value
        });
    }

    handleSearch(e) {
        e.preventDefault();
        $('.search-container form').removeClass('open');
        browserHistory.push('/search?s=' + this.state.search_string);
    }

    render() {
        let loaderStyles = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 9999,
            background: 'white',
        };

        let eyeTooltip =
            <Tooltip id='contrastToggle'>
                <span>Toggle High Contrast Mode</span>
            </Tooltip>;

        if (this.state.data) {
            return (
                <div>
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
                            scopeSelector=".high-contrast .background-color-setter"
                            rules={{
                                backgroundColor: 'white !important',
                                fill: 'white !important',
                                color: 'black !important',
                                '.dropdown': {
                                    backgroundColor: 'white',
                                }
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".background-color-setter-lighter"
                            rules={{
                                backgroundColor: this.LightenDarkenColor(this.state.primaryColor, 30),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".background-color-setter-lightest"
                            rules={{
                                backgroundColor: this.hexToRGB(this.state.primaryColor, 0.1),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .background-color-setter-lighter, .high-contrast .background-color-setter-lightest"
                            rules={{
                                backgroundColor: 'white',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".panel-default > .panel-heading"
                            rules={{
                                backgroundColor: this.hexToRGB(this.state.primaryColor, 0.1),
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
                            scopeSelector=".high-contrast .background-color-setter.btn:hover"
                            rules={{
                                backgroundColor: 'white',
                                background: 'white',
                                color: 'black'
                            }}
                        />

                        <Radium.Style
                            scopeSelector=".background-color-setter-secondary"
                            rules={{
                                backgroundColor: this.state.secondaryColor,
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .background-color-setter-secondary"
                            rules={{
                                backgroundColor: 'white',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".font-color-setter, .menu-dropdown:hover, .menu-item:hover"
                            rules={{
                                color: this.state.primaryColor + ' !important'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .font-color-setter, .high-contrast .menu-dropdown:hover, .high-contrast .menu-item, .high-contrast .menu-item:hover"
                            rules={{
                                color: 'black !important'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".font-color-setter-darker"
                            rules={{
                                color: this.state.primaryColor + ' !important',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .font-color-setter-darker"
                            rules={{
                                color: 'black !important',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".font-color-setter-secondary"
                            rules={{
                                color: this.state.secondaryColor,
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .font-color-setter-secondary"
                            rules={{
                                color: 'black',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".border-color-setter"
                            rules={{
                                borderColor: this.state.primaryColor + ' !important',
                                stroke: this.state.primaryColor + ' !important',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .border-color-setter"
                            rules={{
                                borderColor: 'black !important',
                                stroke: 'black !important',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".border-color-setter-secondary"
                            rules={{
                                borderColor: this.state.secondaryColor,
                                stroke: this.state.secondaryColor,
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .border-color-setter-secondary"
                            rules={{
                                borderColor: 'black',
                                stroke: 'black',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".border-color-setter-lighter"
                            rules={{
                                borderColor: this.LightenDarkenColor(this.state.primaryColor, 50),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .border-color-setter-lighter"
                            rules={{
                                borderColor: 'black',
                            }}
                        />

                        <div className="location-container">
                            <Link to="/information/" title="Location" className="visible-xs visible-sm">
                                <img src={Images + "/icon-location.png"} alt="location"/>
                            </Link>
                            <div className="hours-location hidden-xs hidden-sm">
                                <HoursToday/>
                                <div className="address">
                                    <p>
                                        {this.state.optionsData.acf.address_1 ? this.state.optionsData.acf.address_1 : ''}
                                        {this.state.optionsData.acf.address_2 ? ', ' + this.state.optionsData.acf.address_2 + ', ' : ', '}
                                        {this.state.optionsData.acf.city ? this.state.optionsData.acf.city + ', ' : ''}
                                        {this.state.optionsData.acf.state ? this.state.optionsData.acf.state + ' ' : ''}
                                        {this.state.optionsData.acf.phone &&
                                        <span>
                                                {this.state.optionsData.acf.phone}
                                            </span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <OverlayTrigger placement="bottom" overlay={eyeTooltip}>
                            <div className='high-contrast-container'>
                                <EyeSlash className='eye-slash' onClick={this.toggleEye}/>
                                <Eye className='eye' style={{
                                    "display": "none"
                                }} onClick={this.toggleEye}/>
                            </div>
                        </OverlayTrigger>
                        <div id="menu-icon" className={this.state.optionsData.acf.emergency_banner ? 'emergency' : ''}
                             onClick={this.menuIconAnimate.bind(this)}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <div className="menu-label">
                                <p className="hidden-xs hidden-sm">menu</p>
                            </div>
                        </div>

                        <div className="search-container">
                            <img src={Images + "/icon-search.png"} alt="search" onClick={this.toggleSearch}/>
                            <form onSubmit={this.handleSearch} autocomplete="on">
                                <label htmlFor="search">
                                    <span className="sr-only">search</span>
                                    <input
                                        id="search"
                                        name="search"
                                        className="border-color-setter"
                                        type="text"
                                        onChange={this.handleChange}
                                        value={this.state.search_string}
                                    />
                                </label>
                                <label htmlFor="search-submit" className="sr-only">
                                    <span className="sr-only">submit</span>
                                    <input type="submit" id="search-submit"/>
                                </label>
                            </form>
                        </div>

                        <div className="logo-container">
                            <img src={this.state.logo} alt={this.state.siteName + ' logo'}
                                 className="img-responsive logo" onClick={this.navigateHome.bind(this)}/>
                        </div>

                        <span className="menu-placeholder background-color-setter">
                        <div className="nav-menu background-color-setter">
                            {this.state.navItems}
                        </div>
                    </span>
                    </div>
                </div>
            );
        }
        return <Loader type="bars" loaderStyles={loaderStyles}/>;
    }
}

export default Nav;