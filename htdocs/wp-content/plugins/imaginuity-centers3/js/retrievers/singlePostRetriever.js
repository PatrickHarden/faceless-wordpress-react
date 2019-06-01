import axios from "axios";

const SiteURL = 'http://' + document.location.hostname;
var Stores = SiteURL + '/wp-json/wp/v2/stores/';
var Events = SiteURL + '/wp-json/wp/v2/events/';
var Jobs = SiteURL + '/wp-json/wp/v2/jobs/';
var Pages = SiteURL + '/wp-json/wp/v2/pages/';
var Posts = SiteURL + '/wp-json/wp/v2/posts/';

export function allStores(id) {
    axios.get(Stores + id)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

export function allEvents(id) {
    axios.get(Events + id)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

export function allJobs(id) {
    axios.get(Jobs + id)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

export function allPages(id) {
    axios.get(Pages + id)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

export function allPosts(id) {
    axios.get(Posts + id)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

