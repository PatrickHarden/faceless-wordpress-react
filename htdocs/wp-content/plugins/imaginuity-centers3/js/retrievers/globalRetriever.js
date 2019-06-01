import axios from "axios";

const SiteURL = 'http://' + document.location.hostname;
const centralSite = SiteURL + '/wp-json/ic3/v1/sites/1';

export function fetchClient(id) {
    var clientData = axios.get(centralSite)
        .then((response) => {
            response.data.clients.map((client) => {
                if(client.id == id){
                    clientData = {
                        'name': client.name,
                        'id': client.id,
                        'header_code': client.settings.header_code,
                        'copyright': client.settings.copyright,
                        'footer_logo': client.settings.footer_logo,
                        'footer_code': client.settings.footer_code,
                        'google_analytics_code': client.settings.google_analytics_code,
                    };
                }
            })
            return clientData;
        })
        .catch((err) => {
            console.log(err);
        })
    return clientData;
}

export function fetchStore(id) {
    var storeData = axios.get(centralSite)
        .then((response) => {
            response.data.global_stores.map((store) => {
                if(store.id == id){
                    storeData = {
                        'name': store.name,
                        'id': store.id,
                        'logo_color': store.settings.logo_color,
                        'logo_monochrome': store.settings.logo_monochrome,
                        'featured_image': store.settings.featured_image,
                        'store_copy': store.settings.store_copy,
                        'website': store.settings.website,
                        'featured_video': store.settings.featured_video,
                        'facebook': store.settings.facebook,
                        'twitter': store.settings.twitter,
                        'pinterest': store.settings.pinterest,
                        'instagram': store.settings.instagram,
                    };
                }
            })
            return storeData;
        })
        .catch((err) => {
            console.log(err);
        })
    return storeData;
}

export function testCall(){
    return function(dispatch){
        axios.get(centralSite)
            .then((response) => {
                dispatch({type: "FETCH_CLIENTS_FULFILLED", payload: response.data})
            })
            .catch((err) => {
                dispatch({type: "FETCH_CLIENTS_REJECTED", payload: err})
            })
    }
}
// ToDo: abstract all AJAX calls