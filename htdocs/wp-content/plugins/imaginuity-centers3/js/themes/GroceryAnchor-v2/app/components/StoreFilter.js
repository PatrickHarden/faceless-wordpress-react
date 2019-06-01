// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
let moment = require('moment');
let momentRange = require('moment-range/dist/moment-range.js');
moment = momentRange.extendMoment(moment);

class StoreFilter extends Component{
    constructor(props){
        super(props);

        this.state = {
            printableDirectory: this.props.optionsData.acf.printable_directory,
            categoryData: this.props.categoryData,
            categoryItems: '',
            catFilterVal: 'all'
        }
    }

    componentDidMount(){

        let categoriesItems = this.state.categoryData.map(function(data){
            return(
                <option key={data.id} value={data.id}>{entities.decode(data.name)}</option>
            );
        });
        this.setState({
            categoryItems: categoriesItems
        });
    }

    categoryFilter(e){
        e.preventDefault();

        var filterVal = e.target.value;

        if (filterVal != 'all') {
            $('.store').hide();

            $('.store').each(function(i){
                var storeCategories = $(this).data('category');

                for (var k in storeCategories) {
                    if (!storeCategories.hasOwnProperty(k)) continue;
                    if (storeCategories[k] == filterVal) {
                        $(this).fadeIn('slow');
                    }
                }
            });
        } else {
            $('.store').hide().fadeIn('slow');
        }
        this.setState({ catFilterVal: filterVal });
    }

    alphaFilter(e){
        e.preventDefault();
        var filterVal = e.target.dataset.filter;
        $('.active-filter').removeClass('active-filter');
        $(this).addClass('active-filter');
        if (filterVal != 'all') {
            $('.store').hide();
            $('.store[data-filter="' + filterVal + '"]').fadeIn('slow');
        } else {
            $('.store').hide().fadeIn('slow');
        }
    }

    render(){
        return (
            <Grid>
                <Row className="store-filter background-color-setter-lighter">
                    <Col xs={6} md={2}>
                        <label for="category-filter">
                            <span className="sr-only">category filter</span>
                            <select title="Category Filter" id="category-filter" value={this.state.catFilterVal} onChange={this.categoryFilter}>
                                <option value="all"> Filter </option>
                                {this.state.categoryItems}
                            </select>
                        </label>
                    </Col>
                    <Col md={8} className="hidden-xs hidden-sm alphabet-col">
                        <ul title="Alphabetical Filter" id="alphabet-filter">
                            <li onClick={this.alphaFilter} className="active-filter"><a data-filter="all" href="#">All</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="A" href="#">A</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="B" href="#">B</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="C" href="#">C</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="D" href="#">D</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="E" href="#">E</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="F" href="#">F</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="G" href="#">G</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="H" href="#">H</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="I" href="#">I</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="J" href="#">J</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="K" href="#">K</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="L" href="#">L</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="M" href="#">M</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="N" href="#">N</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="O" href="#">O</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="P" href="#">P</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="Q" href="#">Q</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="R" href="#">R</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="S" href="#">S</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="T" href="#">T</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="U" href="#">U</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="V" href="#">V</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="W" href="#">W</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="X" href="#">X</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="Y" href="#">Y</a></li>
                            <li onClick={this.alphaFilter} ><a data-filter="Z" href="#">Z</a></li>
                        </ul>
                    </Col>
                    <Col xs={6} md={2}>
                        {this.state.printableDirectory &&
                            <div className="icon-container">
                                <a href={this.state.printableDirectory} className="pull-right print" target="_blank">
                                    <span className="sr-only">Printable Directory</span>
                                    <svg>
                                        <title>Printable Directory</title>
                                        <path className="cls-1 " d="M37.32,25h2"/>
                                        <path className="cls-1 " d="M34.05,25h2"/>
                                        <path className="cls-1 " d="M30.78,25h2"/>
                                        <path className="cls-1 " d="M40,40.78h3.43A2.56,2.56,0,0,0,46,38.23h0V20.29a2.56,2.56,0,0,0-2.56-2.56H39.67m-21.87,0H14.12a2.56,2.56,0,0,0-2.56,2.56h0V38.23a2.56,2.56,0,0,0,2.56,2.56h3.54"/>
                                        <path className="cls-1 " d="M17.69,30V47.75H39.87V30Z"/>
                                        <path className="cls-1 " d="M17.69,9.56V20.77H39.87V9.56Z"/>
                                        <line className="cls-1 " x1="21.89" y1="34.67" x2="34.97" y2="34.67"/>
                                        <line className="cls-1 " x1="21.89" y1="38.76" x2="34.97" y2="38.76"/>
                                        <line className="cls-1 " x1="21.89" y1="42.85" x2="30.06" y2="42.85"/>
                                    </svg>
                                </a>
                            </div>
                        }
                        <div className="icon-container">
                            <a href="/interactive-map" className="pull-right map">
                                <span className="sr-only">Interactive Map</span>
                                <svg>
                                    <title>Interactive Map</title>
                                    <path className="cls-1 " d="M31.28,5.6a5.16,5.16,0,0,0-5.16,5.16c0,2.84,4.87,10.8,5.16,10.8s5.16-8,5.16-10.8A5.16,5.16,0,0,0,31.28,5.6Zm0,7.17a2,2,0,1,1,2-2,2,2,0,0,1-2,2Z"/>
                                    <path className="cls-1 " d="M29.61,37.25A38.92,38.92,0,0,0,30,29.33c-.08-1.11-.69-2-1.64-2a1.3,1.3,0,0,0-.92.38h0a2,2,0,0,0-3-1.67,2,2,0,0,0-3.08-1.4V20a1.73,1.73,0,0,0-3.45,0V31.79a13.75,13.75,0,0,0-1.15-1.5c-.86-.86-2.36-1.5-3.3-1-.75.45-.32,1.33.25,2.34.9,1.6,1.43,4.47,2.51,6A6.13,6.13,0,0,0,17.9,39.3a7.89,7.89,0,0,0,.57,1,.63.63,0,0,0,0,.13v4.29a.8.8,0,0,0,.5.75,17,17,0,0,0,9.46,0,.64.64,0,0,0,.41-.71c-.23-1.35-.45-2.76-.68-4.22C28.74,40.22,29.16,39.18,29.61,37.25Z"/>
                                    <polyline className="cls-1 " points="28.41 40.58 39.18 38.62 39.18 13.22 35.57 13.88"/>
                                    <polyline className="cls-1 " points="27.49 15.02 17.62 13.22 6.83 15.19 6.83 40.58 17.62 38.62"/>
                                </svg>
                            </a>
                        </div>

                    </Col>
                </Row>
            </Grid>
        )
    }
}

module.exports = StoreFilter;