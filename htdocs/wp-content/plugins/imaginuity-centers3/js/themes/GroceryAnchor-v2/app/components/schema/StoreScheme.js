let React = require('react');
let ReactRouter = require('react-router');
let $ = require('jquery');
import {JSONLD, Generic} from 'react-structured-data';

let moment = require('moment');
let momentRange = require('moment-range/dist/moment-range.js');
moment = momentRange.extendMoment(moment);

// Endpoints
let SiteURL = window.location.protocol + '//' + document.location.hostname;
let Stores = SiteURL + '/wp-json/wp/v2/stores';
let PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

let StoreSchema = React.createClass({
    getInitialState: function () {
        return {
            storeID: this.props.storeID,
            customHours: this.props.customHours,
            storeHours: false,
            start_date: '',
            end_date: '',
            monday_closed: '',
            monday_open: '',
            monday_close: '',
            tuesday_closed: '',
            tuesday_open: '',
            tuesday_close: '',
            wednesday_closed: '',
            wednesday_open: '',
            wednesday_close: '',
            thursday_closed: '',
            thursday_open: '',
            thursday_close: '',
            friday_closed: '',
            friday_open: '',
            friday_close: '',
            saturday_closed: '',
            saturday_open: '',
            saturday_close: '',
            sunday_closed: '',
            sunday_open: '',
            sunday_close: ''
        }
    },
    componentDidMount: function () {

        let queryURL = this.state.customHours ? Stores + '/' + this.state.storeID : PropertyOptions;
        // Get page with the Home Page template applied, return advanced custom fields
        this.serverRequest = $.get(queryURL, function (data) {
            let today;
            let range;
            let startDate = data['acf']['standard_hours'][0]['start_date'];
            let endDate = data['acf']['standard_hours'][0]['end_date'];
            let monday_closed = data['acf']['standard_hours'][0]['monday_closed'];
            let monday_open = data['acf']['standard_hours'][0]['monday_open'];
            let monday_close = data['acf']['standard_hours'][0]['monday_close'];
            let tuesday_closed = data['acf']['standard_hours'][0]['tuesday_closed'];
            let tuesday_open = data['acf']['standard_hours'][0]['tuesday_open'];
            let tuesday_close = data['acf']['standard_hours'][0]['tuesday_close'];
            let wednesday_closed = data['acf']['standard_hours'][0]['wednesday_closed'];
            let wednesday_open = data['acf']['standard_hours'][0]['wednesday_open'];
            let wednesday_close = data['acf']['standard_hours'][0]['wednesday_close'];
            let thursday_closed = data['acf']['standard_hours'][0]['thursday_closed'];
            let thursday_open = data['acf']['standard_hours'][0]['thursday_open'];
            let thursday_close = data['acf']['standard_hours'][0]['thursday_close'];
            let friday_closed = data['acf']['standard_hours'][0]['friday_closed'];
            let friday_open = data['acf']['standard_hours'][0]['friday_open'];
            let friday_close = data['acf']['standard_hours'][0]['friday_close'];
            let saturday_closed = data['acf']['standard_hours'][0]['saturday_closed'];
            let saturday_open = data['acf']['standard_hours'][0]['saturday_open'];
            let saturday_close = data['acf']['standard_hours'][0]['saturday_close'];
            let sunday_closed = data['acf']['standard_hours'][0]['sunday_closed'];
            let sunday_open = data['acf']['standard_hours'][0]['sunday_open'];
            let sunday_close = data['acf']['standard_hours'][0]['sunday_close'];

            // test for active alternative hours
            if (data['acf']['alternate_hours']) {
                $.each(data['acf']['alternate_hours'], function () {
                    moment.createFromInputFallback = function (config) {
                        // unreliable string magic, or
                        config._d = new Date(config._i);
                    };
                    today = moment();
                    startDate = this['start_date'];
                    endDate = this['end_date'];
                    range = moment.range(startDate, endDate);

                    if ((parseInt(moment(startDate, "MM/DD/YYYY").format('DDD')) <= parseInt(today.format('DDD'))) && (parseInt(moment(endDate, "MM/DD/YYYY").format('DDD')) >= parseInt(today.format('DDD')))) {
                        startDate = this['start_date'];
                        endDate = this['end_date'];
                        monday_closed = this['monday_closed'];
                        monday_open = this['monday_open'];
                        monday_close = this['monday_close'];
                        tuesday_closed = this['tuesday_closed'];
                        tuesday_open = this['tuesday_open'];
                        tuesday_close = this['tuesday_close'];
                        wednesday_closed = this['wednesday_closed'];
                        wednesday_open = this['wednesday_open'];
                        wednesday_close = this['wednesday_close'];
                        thursday_closed = this['thursday_closed'];
                        thursday_open = this['thursday_open'];
                        thursday_close = this['thursday_close'];
                        friday_closed = this['friday_closed'];
                        friday_open = this['friday_open'];
                        friday_close = this['friday_close'];
                        saturday_closed = this['saturday_closed'];
                        saturday_open = this['saturday_open'];
                        saturday_close = this['saturday_close'];
                        sunday_closed = this['sunday_closed'];
                        sunday_open = this['sunday_open'];
                        sunday_close = this['sunday_close'];
                        return false;
                    }
                });
            }
            this.setState({
                start_date: startDate,
                end_date: endDate,
                monday_closed: monday_closed,
                monday_open: monday_open,
                monday_close: monday_close,
                tuesday_closed: tuesday_closed,
                tuesday_open: tuesday_open,
                tuesday_close: tuesday_close,
                wednesday_closed: wednesday_closed,
                wednesday_open: wednesday_open,
                wednesday_close: wednesday_close,
                thursday_closed: thursday_closed,
                thursday_open: thursday_open,
                thursday_close: thursday_close,
                friday_closed: friday_closed,
                friday_open: friday_open,
                friday_close: friday_close,
                saturday_closed: saturday_closed,
                saturday_open: saturday_open,
                saturday_close: saturday_close,
                sunday_closed: sunday_closed,
                sunday_open: sunday_open,
                sunday_close: sunday_close
            });
        }.bind(this));
    },
    render: function () {
        return (
            <JSONLD>
                {this.props.restaurantMenu ? (
                    <Generic type="restaurant" jsonldtype="Restaurant" schema={{
                        name: this.props.storeName,
                        url: window.location.href,
                        description: stripHTML(this.props.description),
                        telephone: this.props.telephone,
                        image: this.props.logo,
                        hasMenu:this.props.restaurantMenu,
                        openingHours: this.getOpeningHoursSchema(),
                        sameAs: formatSameAs(this.props.facebook, this.props.twitter, this.props.instagram, this.props.website, this.props.pinterest),
                        location: this.props.siteName
                    }}>
                        <Generic type="address" jasonldtype="PostalAddress" schema={{
                            addressLocality: this.props.city,
                            addressRegion: this.props.state,
                            postalCode: this.props.zip,
                            streetAddress: this.props.address_1 + " " + this.props.address_2
                        }}/>
                    </Generic>
                ) : (
                    <Generic type="store" jsonldtype="Store" schema={{
                        name: this.props.storeName,
                        url: window.location.href,
                        description: stripHTML(this.props.description),
                        telephone: this.props.telephone,
                        image: this.props.logo,
                        openingHours: this.getOpeningHoursSchema(),
                        sameAs: formatSameAs(this.props.facebook, this.props.twitter, this.props.instagram, this.props.website, this.props.pinterest),
                        location: this.props.siteName
                    }}>
                        <Generic type="address" jsonldtype="PostalAddress" schema={{
                            addressLocality: this.props.city,
                            addressRegion: this.props.state,
                            postalCode: this.props.zip,
                            streetAddress: this.props.address_1 + " " + this.props.address_2
                        }}/>
                    </Generic>
                )}

            </JSONLD>
        )
    },
    getOpeningHoursSchema() {

        let openingHours = [];
        if (!this.state.monday_closed) {
            openingHours.push("Mo " + moment(this.state.monday_open,"h:mm a").format("HH:mm") + "-" + moment(this.state.monday_close,"h:mm a").format("HH:mm"));
        }
        if (!this.state.tuesday_closed) {
            openingHours.push("Tu " + moment(this.state.tuesday_open,"h:mm a").format("HH:mm") + "-" + moment(this.state.tuesday_close,"h:mm a").format("HH:mm"));
        }
        if (!this.state.wednesday_closed) {
            openingHours.push("We " + moment(this.state.wednesday_open,"h:mm a").format("HH:mm") + "-" + moment(this.state.wednesday_close,"h:mm a").format("HH:mm"));
        }
        if (!this.state.thursday_closed) {
            openingHours.push("Th " + moment(this.state.thursday_open,"h:mm a").format("HH:mm") + "-" + moment(this.state.thursday_close,"h:mm a").format("HH:mm"));
        }
        if (!this.state.friday_closed) {
            openingHours.push("Fr " + moment(this.state.friday_open,"h:mm a").format("HH:mm") + "-" + moment(this.state.friday_close,"h:mm a").format("HH:mm"));
        }
        if (!this.state.saturday_closed) {
            openingHours.push("Sa " + moment(this.state.saturday_open,"h:mm a").format("HH:mm") + "-" + moment(this.state.saturday_close,"h:mm a").format("HH:mm"));
        }
        if (!this.state.sunday_closed) {
            openingHours.push("Su " + moment(this.state.sunday_open,"h:mm a").format("HH:mm") + "-" + moment(this.state.sunday_close,"h:mm a").format("HH:mm"));
        }

        return openingHours;
    }
});

function formatSameAs(facebook, twitter, instagram, website, pinterest) {
    let sameAs = [];
    if (facebook) {
        sameAs.push(facebook);
    }
    if (twitter) {
        sameAs.push(twitter);
    }
    if (instagram) {
        sameAs.push(instagram);
    }
    if (website) {
        sameAs.push(website);
    }
    if (pinterest) {
        sameAs.push(pinterest)
    }

    return sameAs;
}


function stripHTML(string) {
    let div = document.createElement("div");
    div.innerHTML = string;
    return div.innerText;
}


module.exports = StoreSchema;