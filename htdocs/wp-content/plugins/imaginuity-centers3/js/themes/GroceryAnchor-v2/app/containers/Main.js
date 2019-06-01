import React, { Component } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import axios from "axios";

//Components
import GTM from '../components/GoogleTagManager';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: '',
            GTM: '',
            GTM_id: '',
        }
    }

    componentWillMount() {
        let component = this;

        axios.all([
            axios.get(PropertyOptions)
        ])
            .then(axios.spread(function (propertyOptions) {

                component.setState({
                    data: true,
                    GTM: propertyOptions.data.acf.enable_google_tag_manager,
                    GTM_id: propertyOptions.data.acf.enable_google_tag_manager ? propertyOptions.data.acf.google_tag_manager_ID : '',
                });
            }))
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        return (
            <div className="app">
                {this.state.GTM &&
                <GTM
                    gtmId={this.state.GTM_id}
                />
                }
                <Nav />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default Main;
