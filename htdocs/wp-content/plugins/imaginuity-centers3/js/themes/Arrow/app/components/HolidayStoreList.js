import React, { Component } from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
let $ = require('jquery');
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
let moment = require('moment');
let momentRange = require('moment-range/dist/moment-range.js');
moment = momentRange.extendMoment(moment);

// Components
import Loader from '../components/Loader';

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let StoresData = SiteURL + '/wp-json/wp/v2/stores?per_page=100';


class StoreHours extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            error: false,
            hours: '',
        }
    }

    componentWillMount(){
        let component = this;


        axios.all([
            axios.get(StoresData),
        ])
            .then(axios.spread(function(storeData){

                let storeQueries = [];
                let data = [];

                if(storeData.headers['x-wp-totalpages'] > 1){
                    let paginationCount = storeData.headers['x-wp-totalpages'];
                    let x = 1;
                    while(x <= paginationCount){
                        storeQueries.push(axios.get(StoresData + '&page=' + x));
                        x++;
                    }
                    axios.all(storeQueries)
                        .then((response) => {
                            response.map((responsePage) => {
                                data = data.concat(responsePage.data);
                            })
                            component.buildStores(data);
                        })
                        .catch((err) => {
                            console.log('error in storeQueries');
                            console.log(err);
                        })
                }
                else{
                    data = storeData.data;
                    component.buildStores(data);
                }

            }))
            .catch((err) => {
                console.log(err);
                component.setState({
                    error: true,
                })
            })
    }

    buildStores(data){

        let component = this;
        let hours = [];

        // Retrieve stores, sort alphabetically
        let sortedData = data.sort(function(a, b){
            let itemA = entities.decode(a.title.rendered.toUpperCase());
            let itemB = entities.decode(b.title.rendered.toUpperCase());
            return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
        });

        sortedData.map(function(store){

            let thanksgivingHours;
            let blackFridayHours;

            //check if custom thanksgiving hours are enabled for this specific store
            if(store.acf.custom_hours){

                if(!store.acf.alternate_hours){
                    thanksgivingHours = (store.acf.standard_hours[0].thursday_closed ? 'Closed' : store.acf.standard_hours[0].thursday_open + ' - ' + store.acf.standard_hours[0].thursday_close);
                }
                else{
                    $.each(store.acf.alternate_hours, function(){
                        if(this.start_date === "11/19/2018"){ //TODO  make this take into account the start of the week that Thanksgiving is in
                            if(this.thursday_closed){
                                thanksgivingHours = 'Closed';
                            }
                            else{
                                thanksgivingHours = this.thursday_open + ' - ' + this.thursday_close;
                            }
                        }

                        if(!thanksgivingHours){
                            thanksgivingHours = (store.acf.standard_hours[0].thursday_closed ? 'Closed' : store.acf.standard_hours[0].thursday_open + ' - ' + store.acf.standard_hours[0].thursday_close);
                        }
                    });
                }
            }
            // if store has no custom thanksgiving hours enabled, check the Center level 'Custom Hours'
            else if(component.props.optionsData.acf.alternate_hours){
                // if custom hours exist, loop through the start dates to see if Thanksgiving day is included in one
                $.each(component.props.optionsData.acf.alternate_hours, function(){
                    if(this.start_date === "11/19/2018"){ //TODO  make this take into account the start of the week that Thanksgiving is in
                        if(this.thursday_closed){
                            thanksgivingHours = 'Closed';
                        }
                        else{
                            thanksgivingHours = this.thursday_open + ' - ' + this.thursday_close;
                        }
                    }
                });
                if(!thanksgivingHours){
                    thanksgivingHours = component.props.optionsData.acf.standard_hours[0].thursday_open + ' - ' + component.props.optionsData.acf.standard_hours[0].thursday_close;
                }
            }
            else{ // if no custom store hours for thanksgiving exist, AND no alternate hours exist for the Center, inherit the defauly hours
                if(component.props.optionsData.acf.standard_hours[0].thursday_closed){
                    thanksgivingHours = 'Closed';
                }
                else{
                    thanksgivingHours = component.props.optionsData.acf.standard_hours[0].thursday_open + ' - ' + component.props.optionsData.acf.standard_hours[0].thursday_close;
                }
            }

            if(store.acf.custom_hours){

                if(!store.acf.alternate_hours){
                    blackFridayHours = (store.acf.standard_hours[0].friday_closed ? 'Closed' : store.acf.standard_hours[0].friday_open + ' - ' + store.acf.standard_hours[0].friday_close);
                }
                else{
                    $.each(store.acf.alternate_hours, function(){

                        if(this.start_date === "11/19/2018"){ //TODO  make this take into account the start of the week that Thanksgiving is in
                            if(this.friday_closed){
                                blackFridayHours = 'Closed';
                            }
                            else{
                                blackFridayHours = this.friday_open + ' - ' + this.friday_close;
                            }
                        }

                        if(!blackFridayHours){
                            blackFridayHours = (store.acf.standard_hours[0].friday_closed ? 'Closed' : store.acf.standard_hours[0].friday_open + ' - ' + store.acf.standard_hours[0].friday_close);
                        }
                    });
                }
            }
            else if(component.props.optionsData.acf.alternate_hours){
                $.each(component.props.optionsData.acf.alternate_hours, function(){
                    if(this.start_date === "11/19/2018"){//TODO  make this take into account the start date of the week that Black Friday is in
                        if(this.friday_closed){
                            blackFridayHours = 'Closed';
                        }
                        else{
                            blackFridayHours = this.friday_open + ' - ' + this.friday_close;
                        }
                    }
                });
                if(!blackFridayHours){
                    blackFridayHours = component.props.optionsData.acf.standard_hours[0].friday_open + ' - ' + component.props.optionsData.acf.standard_hours[0].friday_close;
                }
            }
            else{
                if(component.props.optionsData.acf.standard_hours[0].friday_closed){
                    blackFridayHours = 'Closed';
                }
                else{
                    blackFridayHours = component.props.optionsData.acf.standard_hours[0].friday_open + ' - ' + component.props.optionsData.acf.standard_hours[0].friday_close;
                }
            }

            hours.push(
                <Col
                    xs={12}
                    className="store"
                >
                    <Link title={entities.decode(store.title.rendered)} key={store.id} to={'/stores/'+store.slug}>
                        <p>
                            <b>{entities.decode(store.title.rendered)}</b><br className="visible-xs visible-sm" />
                            <span className="thanksgiving-hours hours">{thanksgivingHours}<br className="visible-xs visible-sm"/></span>
                            <span className="black-friday-hours hours hidden">{blackFridayHours}</span>
                        </p>
                    </Link>
                </Col>
            );

        });

        component.setState({
            data: true,
            hours: hours,
        });
    }

    toggleHours(e){
        let target = e.target;
        if(!$(target).hasClass('active')){
            $('.day-picker.active').removeClass("active");
            let dayFilter = $(target).data('day-filter');

            $(target).addClass('active');

            $('.hours').removeClass('hidden');
            $('.' + dayFilter + '-hours').addClass('hidden');

        }
    }

    render(){
        if(this.state.data){
            return (
                <Grid className="retailer-hours">
                    {this.props.pageData.acf.retailer_hours_background_mobile ?
                        <img className="visible-xs background" src={this.props.pageData.acf.retailer_hours_background_mobile.url} alt={this.props.pageData.acf.retailer_hours_background_mobile.alt ? this.props.pageData.acf.retailer_hours_background_mobile.alt : 'mobile christmas background'}/> :
                        ''
                    }{this.props.pageData.acf.retailer_hours_background_desktop ?
                        <img className="hidden-xs background" src={this.props.pageData.acf.retailer_hours_background_desktop.url} alt={this.props.pageData.acf.retailer_hours_background_desktop.alt ? this.props.pageData.acf.retailer_hours_background_desktop.alt : 'desktop christmas background'}/> :
                        ''
                    }
                    <Row>
                        <Col xs={12} className="hours-labels">
                            <h2>Retailer Holiday Hours</h2>
                            <h3 className="day-picker thanksgiving active visible-xs visible-sm" data-day-filter="black-friday" onClick={this.toggleHours}>Thanksgiving Day</h3>
                            <h3 className="day-picker black-friday visible-xs visible-sm" data-day-filter="thanksgiving" onClick={this.toggleHours}>Black Friday</h3>
                        </Col>
                        <div className="labels hidden-xs hidden-sm">
                            <p>Retailer</p>
                            <p>Thanksgiving Day</p>
                            <p>Black Friday</p>
                        </div>
                        <div className="hour-container">
                            {this.state.hours}
                        </div>
                    </Row>
                </Grid>
            )
        }
        else if(this.state.error){
            return(
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h4>An error occurred retrieving the Stores holiday hours.</h4>
                            <p>Please refresh the page and try again. If this error continues, please <Link to={'/contact-us'}>contact us</Link> and report the issue.</p>
                            <br/>
                        </Col>
                    </Row>
                </Grid>
            );
        }
        return <Loader />;
    }
}

export default StoreHours;