// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const MenuLocationsURL = SiteURL + '/wp-json/wp-api-menus/v2/menu-locations/';
const Menus = SiteURL + '/wp-json/wp-api-menus/v2/menus/';
const CentralSite = SiteURL + '/wp-json/ic3/v1/sites/1';

class Footer extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            siteTitle: '',
            address1: '',
            address2: '',
            address3: '',
            phone: '',
            copyright: '',
            clientInfo: '',
            footerMenu: '',
        }
    }

    componentWillMount(){

        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(MenuLocationsURL),
                axios.get(PropertyOptions),
                axios.get(CentralSite),
            ])
            .then(axios.spread(function (site, menuLocations, options, clients){
                axios.get(Menus + menuLocations.data.footer.ID)
                    .then((footerMenu) => {
                        component.setState({
                            data: true,
                            siteName: site.data.name,
                            address1: options.data.acf.address_1,
                            address2: options.data.acf.address_2,
                            address3: options.data.acf.city + ', ' + options.data.acf.state + ' ' + options.data.acf.zip,
                            phone: options.data.acf.phone,
                            copyright: options.data.acf.copyright_name ? options.data.acf.copyright_name : 'Imaginuity',
                            clientInfo: options.data.acf.client_group ? component.parseClients(clients.data.clients, options.data.acf.client_group.selected_posts[0].ID) : false,
                            footerMenu: component.buildFooterMenu(footerMenu),
                        });
                        // console.log(component.state.footerMenu);
                    })

            }))
            .catch((err) => {
                console.log(err);
            })
    }

    parseClients(clients, clientID){
        let client = clients.filter((client) => {
            if(clientID == client.id){
                return client;
            }
        })
        return client;
    }
    
    buildFooterMenu(menuData){
        let footerNavItems = menuData.data.items.map(function(item, i) {
            if(item.children){
                return(
                    <div className="dropdown" id={i} >
                        <p className="menu-item background-color-setter"
                           data-dropdown={i}
                           >{entities.decode(item.title )} <span>{entities.decode('&#9660;')}</span></p>
                        <ul className="dropdown-items">
                            {item.children.map((child, j) => {
                                return(
                                    <li>
                                        <Link to={'/' + child.object_slug + '/'} key={j+'.'+i} className="menu-item dropdown-item" activeClassName="active">{entities.decode(child.title)}</Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )
            }
            else if(item.type === "custom"){
                let url = item.url.toString();
                let id = item.id;
                return <a href={url} className="menu-item" target="_blank">{entities.decode(item.title)}</a>
            }
            else{
                return(
                    <Link to={'/' + (item.object_slug === 'home' ? '' : item.object_slug + '/')} key={i} className="menu-item" activeClassName="active">{entities.decode(item.title)}</Link>
                );
            }
        });
        return footerNavItems;
    }

    render(){
        if(this.state.data){
            return(
                <div className="footer">
                    <Grid>
                        <Row>
                            <Col xs={12} md={8} className="footer-menu">
                                {this.state.footerMenu}
                            </Col>
                            <Col xs={12} md={4} >
                                <p className="address">
                                    {this.state.address1} {this.state.address2 ? this.state.address2 + ', ' : ''}<br/>{this.state.address3} <br/><a className='phone-number' title="phone number" href={"tel:" + this.state.phone}>{this.state.phone}</a>
                                </p>
                            </Col>
                            <Col xs={12} md={6}>
                                <p className="copyright">
                                    &copy; Copyright {this.state.clientInfo ? this.state.clientInfo[0].settings.copyright : this.state.copyright} All rights reserved.
                                </p>
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