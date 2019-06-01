import React, { Component } from 'react';
import axios from 'axios';

//Components
import GTM from '../components/GoogleTagManager';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: false,
            optionsData: '',
            GTM: '',
            GTM_id: '',
        }
    }

    componentWillMount(){
        let component = this;

        axios.all([
            axios.get(PropertyOptions)
        ])
            .then(axios.spread(function (propertyOptions){

                component.setState({
                    data: true,
                    optionsData: propertyOptions.data,
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
                <div id="content" tabIndex="-1">
                    {this.props.children}
                </div>
                <Footer />
            </div>
        );
    }
}

export default Main;
