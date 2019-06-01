import axios from "axios";

const SiteURL = 'http://' + document.location.hostname;
var Stores = SiteURL + '/wp-json/wp/v2/stores/';
var Events = SiteURL + '/wp-json/wp/v2/events/';
var Jobs = SiteURL + '/wp-json/wp/v2/jobs/';
var Pages = SiteURL + '/wp-json/wp/v2/pages/';
var Posts = SiteURL + '/wp-json/wp/v2/posts/';

export function allStores() {
    axios.get(Stores)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

export function allEvents() {
    axios.get(Events)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

export function allJobs() {
    axios.get(Jobs)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

export function allPages() {
    axios.get(Pages)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

export function allPosts() {
    axios.get(Posts)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
}

