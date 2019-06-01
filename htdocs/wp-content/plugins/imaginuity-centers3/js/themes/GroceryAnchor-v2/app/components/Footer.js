// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const CentralSite = SiteURL + '/wp-json/ic3/v1/sites/1';

class Footer extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            siteTitle: '',
            footerContacts: false,
            optionsData: '',
            address1: '',
            address2: '',
            address3: '',
            phone: '',
            copyright: '',
            clientInfo: '',
        }
    }

    componentWillMount(){

        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(PropertyOptions),
                axios.get(CentralSite),
            ])
            .then(axios.spread(function (site, options, clients){

                component.setState({
                    data: true,
                    siteName: site.data.name,
                    optionsData: options.data,
                    footerContacts: options.data.acf.footer_contacts ? component.buildFooterContacts(options.data.acf.footer_contacts) : false,
                    address1: options.data.acf.address_1,
                    address2: options.data.acf.address_2,
                    address3: options.data.acf.city + ', ' + options.data.acf.state + ' ' + options.data.acf.zip,
                    phone: options.data.acf.phone,
                    copyright: options.data.acf.copyright_name ? options.data.acf.copyright_name : 'Imaginuity',
                    clientInfo: options.data.acf.client_group ? component.parseClients(clients.data.clients, options.data.acf.client_group.selected_posts[0].ID) : false,
                });
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

    buildFooterContacts(contacts){
        let footerContacts = contacts.map((contact, i) => {
            return(
                <Col xs={12} sm={6} md={3} className="footer-contact">
                    <h4>{contact.contact_title}</h4>
                    <p>
                        {contact.full_name
                            ? (contact.full_name)
                            : ('')
                        }
                        {contact.contact_email ?
                            (
                                <span>
                                    <br/>
                                    <Link to={"mailto:" + contact.contact_email + "/"} className="font-color-setter-2">{contact.contact_email}</Link>
                                </span>
                            ) : ('')
                        }
                        {contact.contact_phone_number ?
                            (
                                <span>
                                    <br/>
                                    <Link to={"tel:" + contact.contact_phone_number + "/"} className="font-color-setter-2">{contact.contact_phone_number}</Link>
                                </span>
                            ) : ('')}
                    </p>
                    {contact.more_information_text ? <Link to={contact.more_information_link + "/"} className="more-info font-color-setter-2">{contact.more_information_text}</Link> : ''}
                </Col>
            );
        });
        return footerContacts;
    }

    render(){
        if(this.state.data){
            return(
                <div className="footer font-color-setter-2">
                    <Grid>
                        <Row className="footer-contacts">
                            {this.state.footerContacts}
                        </Row>
                        <Row>
                            <Col xs={12} className="visible-xs text-center">
                                <p>
                                    &copy; Copyright {this.state.clientInfo ? this.state.clientInfo[0].settings.copyright : this.state.copyright} <br/> All rights reserved.<br/> <Link to="/terms-conditions/" className="font-color-setter-2" >Terms and Conditions</Link> | <Link to="/privacy/" className="font-color-setter-2">Privacy Policy</Link>
                                </p>
                            </Col>
                            <Col xs={12} className="hidden-xs">
                                <p>
                                    &copy; Copyright {this.state.clientInfo ? this.state.clientInfo[0].settings.copyright : this.state.copyright} All rights reserved. | <Link to="/terms-conditions/" className="font-color-setter-2" >Terms and Conditions</Link> | <Link to="/privacy/" className="font-color-setter-2">Privacy Policy</Link>
                                </p>
                            </Col>
                            <Col xs={12} >
                                {this.state.clientInfo &&
                                    <img src={this.state.clientInfo[0].settings.footer_logo} className="footer-logo" alt="footer logo"/>
                                }
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