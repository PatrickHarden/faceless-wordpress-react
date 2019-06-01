import axios from "axios";

const SiteURL = 'http://' + document.location.hostname;
var PropertyOptions = SiteURL + '/wp-json/acf/v2/options/?option_id=property_options';

export function propertyOptions() {
    axios.get(PropertyOptions)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}
