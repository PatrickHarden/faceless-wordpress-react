var React = require('react');
var $ = require('jquery');
import {JSONLD, Generic} from 'react-structured-data';

let moment = require('moment');
let momentRange = require('moment-range/dist/moment-range.js');
moment = momentRange.extendMoment(moment);

var MallSchema = React.createClass({
    getInitialState: function () {
        return {
            propertyOptions: this.props.propertyOptions,
        }
    },

    componentDidMount: function () {

            var data = this.state.propertyOptions;

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
        },
        render: function () {
            return (
                <JSONLD>
                    <Generic type="shoppingcenter" jsonldtype="ShoppingCenter" schema={{
                        name: this.props.siteName,
                        url: window.location.href,
                        description: stripHTML(this.state.propertyOptions.acf.meta_description),
                        telephone: this.state.propertyOptions.acf.phone,
                        image: this.state.propertyOptions.acf.logo,
                        openingHours: this.getOpeningHoursSchema(),
                        sameAs: formatSameAs(this.state.propertyOptions.acf.facebook_url, this.state.propertyOptions.acf.twitter_url, this.state.propertyOptions.acf.instagram_url, this.state.propertyOptions.acf.pinterest_url)
                    }}>
                        <Generic type="address" jsonldtype="PostalAddress" schema={{
                            addressLocality: this.state.propertyOptions.acf.city,
                            addressRegion: this.state.propertyOptions.acf.state,
                            postalCode: this.state.propertyOptions.acf.zip,
                            streetAddress: this.state.propertyOptions.acf.address_1 + " " + this.state.propertyOptions.acf.address_2
                        }}/>
                    </Generic>
                </JSONLD>
            )
        },
        getOpeningHoursSchema() {

            var openingHours = [];
            if (!this.state.monday_closed) {
                openingHours.push("Mo " + moment(this.state.monday_open, "h:mm a").format("HH:mm") + "-" + moment(this.state.monday_close, "h:mm a").format("HH:mm"));
            }
            if (!this.state.tuesday_closed) {
                openingHours.push("Tu " + moment(this.state.tuesday_open, "h:mm a").format("HH:mm") + "-" + moment(this.state.tuesday_close, "h:mm a").format("HH:mm"));
            }
            if (!this.state.wednesday_closed) {
                openingHours.push("We " + moment(this.state.wednesday_open, "h:mm a").format("HH:mm") + "-" + moment(this.state.wednesday_close, "h:mm a").format("HH:mm"));
            }
            if (!this.state.thursday_closed) {
                openingHours.push("Th " + moment(this.state.thursday_open, "h:mm a").format("HH:mm") + "-" + moment(this.state.thursday_close, "h:mm a").format("HH:mm"));
            }
            if (!this.state.friday_closed) {
                openingHours.push("Fr " + moment(this.state.friday_open, "h:mm a").format("HH:mm") + "-" + moment(this.state.friday_close, "h:mm a").format("HH:mm"));
            }
            if (!this.state.saturday_closed) {
                openingHours.push("Sa " + moment(this.state.saturday_open, "h:mm a").format("HH:mm") + "-" + moment(this.state.saturday_close, "h:mm a").format("HH:mm"));
            }
            if (!this.state.sunday_closed) {
                openingHours.push("Su " + moment(this.state.sunday_open, "h:mm a").format("HH:mm") + "-" + moment(this.state.sunday_close, "h:mm a").format("HH:mm"));
            }
            return openingHours;
        }
    })
;

function formatSameAs(facebook, twitter, instagram, pinterest) {
    var sameAs = [];
    if (facebook) {
        sameAs.push(facebook);
    }
    if (twitter) {
        sameAs.push(twitter);
    }
    if (instagram) {
        sameAs.push(instagram);
    }
    if (pinterest) {
        sameAs.push(pinterest)
    }

    return sameAs;
}


function stripHTML(string) {
    var div = document.createElement("div");
    div.innerHTML = string;
    return div.innerText;
}


module.exports = MallSchema;