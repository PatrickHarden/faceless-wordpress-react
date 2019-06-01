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

    render(){
        if(this.state.data){
            return(
                <div className="footer">
                    <Grid>
                        <Row>
                            <Col xs={12} md={10} mdOffset={1} lg={12} lgOffset={0}>
                                <p className="font-color-setter">
                                    {this.state.siteName} / {this.state.address1} / {this.state.address2 ? this.state.address2 + ' / ' : ''}<br className="visible-xs visible-sm" />{this.state.address3} / {this.state.phone}
                                </p>
                                <p className="font-color-setter">
                                    &copy; Copyright {this.state.clientInfo ? this.state.clientInfo[0].settings.copyright : this.state.copyright} All rights reserved.
                                </p>
                                {this.state.clientInfo &&
                                    <img src={this.state.clientInfo[0].settings.footer_logo} alt="footer logo"/>
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