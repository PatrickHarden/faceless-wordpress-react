var React = require('react');
import {JSONLD, Generic} from 'react-structured-data';
let moment = require('moment');

var EventSchema = React.createClass({
    render: function () {
        return (
            <JSONLD>
                <Generic type="event" jsonldtype="Event" schema={{
                    name: this.props.title,
                    url: window.location.href,
                    description: stripHTML(this.props.description),
                    image: this.props.image,
                    startDate:this.getStartDate(),
                    endDate:this.getEndDate(),
                }}>
                    <Generic type="location" jsonldtype="Place">
                        <Generic type="address" jsonldtype="PostalAddress" schema={{
                            addressLocality: this.props.propertyOptions.acf.city,
                            addressRegion: this.props.propertyOptions.acf.state,
                            postalCode: this.props.propertyOptions.acf.zip,
                            streetAddress: this.props.propertyOptions.acf.address_1 + " " + this.props.propertyOptions.acf.address_2
                        }}/>
                    </Generic>
                </Generic>
            </JSONLD>
        )
    },
    getStartDate(){
        var startDate = this.props.startDate;
        var startTime = this.props.startTime;
        if(startTime){
            return moment(startDate + " " + startTime, "YYYYMMDD h:mm a").toISOString();
        }
        return moment(startDate, "YYYYMMDD").toISOString();
    },
    getEndDate(){
        var endDate = this.props.endDate;
        var endTime = this.props.endTime;

        if(endTime){
            return moment(endDate + " " + endTime, "YYYYMMDD h:mm a").toISOString();
        }
        return moment(endDate, "YYYYMMDD").toISOString();
    }
});

function stripHTML(string) {
    var div = document.createElement("div");
    div.innerHTML = string;
    return div.innerText;
}

module.exports = EventSchema;