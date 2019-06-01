// Dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from './store/store';

import './css/main.scss';
import 'jquery';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.min.js';
//import 'bootstrap/fonts/glyphicons-halflings-regular.ttf';

import Root from './containers/Root';

const store = configureStore();

ReactDOM.render(
    <Root store={store} />,
    document.getElementById('root')
);