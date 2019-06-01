// Packages
import React, { PropTypes, Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
import moment from 'moment';

// Components
import Radium from 'radium';
import LocationIcon from 'react-icons/lib/md/place';
import SearchIcon from 'react-icons/lib/md/search';
import Loader from '../components/Loader';
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

        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            data: false,
            siteName: '',
            optionsData: '',
            logo: '',
            navItems: '',
            primaryColor: '',
            secondaryColor: '',
            search_string: '',
        }
    }

    componentWillMount(){

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

                            if(item.children){
                                return(
                                    <div className="dropdown menu-float" id={i}>
                                        <p className="menu-item background-color-setter" onClick={component.dropdownActive.bind(this)} data-dropdown={i}>{entities.decode(item.title )} <span>{entities.decode('&#9660;')}</span></p>
                                        <ul className="dropdown-items background-color-setter-lighter">
                                            {item.children.map((child, j) => {
                                                return(
                                                    <li>
                                                        <Link to={'/' + child.object_slug + '/'} key={j+'.'+i} className="menu-item dropdown-item" activeClassName="active" onClick={component.menuCollapse.bind(this)}>{entities.decode(child.title)}</Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )
                            }
                            else if(item.type === "custom"){

                                let url = item.url.toString();
                                return <a href={url} className="menu-item menu-float" target="_blank">{entities.decode(item.title)}</a>
                            }
                            else{
                                return(
                                    <Link to={'/' + (item.object_slug == 'home' ? '' : item.object_slug + '/')} key={i} className="menu-item menu-float" activeClassName="active" onClick={component.menuCollapse.bind(this)}>{entities.decode(item.title)}</Link>
                                );
                            }
                        });

                        component.setState({
                            data: true,
                            siteName: site.data.name,
                            optionsData: options.data,
                            logo: options.data.acf.logo,
                            navItems: navItems,
                            primaryColor: options.data.acf.primary_color,
                            secondaryColor: options.data.acf.secondary_color,
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

    menuIconAnimate(){
        $("#menu-icon").toggleClass('open');
        $('.nav-menu').toggleClass('active');
    }

    dropdownActive(e){
        if($(e.target).closest('.dropdown').hasClass('active')){
            $('.dropdown').removeClass('active');
        }
        else{
            $('.dropdown').removeClass('active');
            $(e.target).closest('.dropdown').addClass('active');
        }
    }

    navigateHome(){
        browserHistory.push('/');
        this.menuCollapse();
    }

    menuCollapse(){
        $('.nav-menu').removeClass('active');
        $('.dropdown').removeClass('active');
        $('#menu-icon').removeClass('open');
    }

    handleChange(e) {
        this.setState({
            search_string: e.target.value
        });
    }

    handleSearch(e) {
        e.preventDefault();
        browserHistory.push('/search?s=' + this.state.search_string);
        // this.context.router.push();
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

    render(){
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

        if(this.state.data){
            return(
                <div>
                    {this.state.optionsData.acf.emergency_banner &&
                    <div className="emergency-banner">
                        <span className="text-center" dangerouslySetInnerHTML={{ __html: this.state.optionsData.acf.emergency_banner}}></span>
                    </div>
                    }
                    <a href="#content" className="sr-only sr-only-focusable">Skip to main content</a>
                    <nav className="nav-container">
                        <Radium.Style
                            scopeSelector=".background-color-setter"
                            rules={{
                                backgroundColor: this.state.primaryColor,
                                fill: this.state.primaryColor,
                                '.dropdown': {
                                    backgroundColor: this.LightenDarkenColor(this.state.primaryColor, 30),
                                }
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .background-color-setter, .footer.high-contrast.background-color-setter, .high-contrast .background-color-setter a:not(.social-icon)"
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
                            scopeSelector=".background-color-setter-transparent"
                            rules={{
                                backgroundColor: this.hexToRGB(this.state.primaryColor, 0.8),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .background-color-setter-transparent, .high-contrast .background-color-setter-transparent a"
                            rules={{
                                backgroundColor: "white !important",
                                color: "black !important"
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".background-color-setter-lighter"
                            rules={{
                                backgroundColor: this.hexToRGB(this.state.primaryColor, 0.5),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .background-color-setter-lighter"
                            rules={{
                                backgroundColor: 'white',
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".background-color-setter-lightest"
                            rules={{
                                backgroundColor: this.hexToRGB(this.state.primaryColor, 0.1),
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .background-color-setter-lightest"
                            rules={{
                                backgroundColor: 'white',
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
                            scopeSelector=".font-color-setter, .menu-item:hover"
                            rules={{
                                color: this.state.primaryColor + ' !important'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".font-color-setter-2"
                            rules={{
                                color: this.state.secondaryColor + ' !important'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .font-color-setter, .high-contrast .font-color-setter-2, .high-contrast .menu-dropdown:hover, .high-contrast .menu-item, .high-contrast .menu-item:hover"
                            rules={{
                                backgroundColor: 'white !important',
                                color: 'black !important'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".border-color-setter"
                            rules={{
                                borderColor: this.state.primaryColor + '!important',
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
                            scopeSelector=".featured-events-slider .slick-arrow"
                            rules={{
                                backgroundColor: this.state.primaryColor,

                                ':hover': {
                                    backgroundColor: this.LightenDarkenColor(this.state.primaryColor, 50),
                                    background: this.LightenDarkenColor(this.state.primaryColor, 50)
                                }
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".featured-events-slider .slick-arrow:hover"
                            rules={{
                                backgroundColor: this.LightenDarkenColor(this.state.primaryColor, 50),
                                background: this.LightenDarkenColor(this.state.primaryColor, 50)
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".featured-events-slider .featured-events .event"
                            rules={{
                                background: 'repeating-linear-gradient( 55deg,' + this.hexToRGB(this.state.primaryColor, 0.1) + ', ' + this.hexToRGB(this.state.primaryColor, 0.1) + '2px, white 4px, white 15px)'
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".featured-events-slider .featured-events .slick-dots li button:before"
                            rules={{
                                borderColor: this.state.secondaryColor,
                                color: this.state.secondaryColor
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".featured-events-slider .featured-events .slick-dots li.slick-active button:before"
                            rules={{
                                borderColor: this.state.primaryColor,
                                color: this.state.primaryColor
                            }}
                        />
                        <Radium.Style
                            scopeSelector=".high-contrast .flag.background-color-setter p, .high-contrast .flag-marker.background-color-setter, .high-contrast .date-container.background-color-setter, .high-contrast #menu-icon .background-color-setter, .high-contrast .signup.background-color-setter"
                            rules={{
                                backgroundColor: 'black !important',
                                color: 'white !important'
                            }}
                        />
                        <Link to="/hours-directions/" className="visible-xs">
                            <LocationIcon className="location-icon" size={50} color={this.state.primaryColor} />
                        </Link>

                        <OverlayTrigger placement="bottom" overlay={eyeTooltip}>
                            <div className='high-contrast-container'>
                                <EyeSlash className='eye-slash background-color-setter' onClick={this.toggleEye}/>
                                <Eye className='eye' style={{
                                    "display": "none"
                                }} onClick={this.toggleEye}/>
                            </div>
                        </OverlayTrigger>

                        <div id="menu-icon" onClick={this.menuIconAnimate.bind(this)}>
                            <span className="background-color-setter"></span>
                            <span className="background-color-setter"></span>
                            <span className="background-color-setter"></span>
                            <span className="background-color-setter"></span>
                        </div>
                        <img src={this.state.logo} alt={this.state.siteName + ' logo'} className="img-responsive logo" onClick={this.navigateHome.bind(this)} />
                        <span className="menu-placeholder">
                            <div className="nav-menu background-color-setter">
                                {this.state.navItems}
                            </div>
                            <div className="hidden-xs" id="search-icon">
                                <form onSubmit={this.handleSearch} autocomplete="on">
                                    <Link class="icon-link">
                                        <SearchIcon size={30} color={this.state.primaryColor} style={{marginTop:'3px'}} />
                                    </Link>
                                    <label htmlFor="search">
                                        <span className="sr-only">search</span>
                                        <input
                                            id="search"
                                            className="border-color-setter"
                                            name="search"
                                            type="text"
                                            onChange={this.handleChange}
                                            value={this.state.search_string}
                                        />
                                    </label>
                                    <label htmlFor="search-submit" className="sr-only">
                                        <span className="sr-only">submit</span>
                                        <input type="submit" id="search-submit" />
                                    </label>
                                </form>
                            </div>
                        </span>
                    </nav>
                </div>
            );
        }
        return <Loader type="bars" loaderStyles={loaderStyles} />;
    }
}

export default Nav;