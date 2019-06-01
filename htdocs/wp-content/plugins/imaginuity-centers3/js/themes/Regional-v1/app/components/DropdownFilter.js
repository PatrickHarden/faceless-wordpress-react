// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

class DropdownFilter extends Component{
    constructor(props) {
        super(props);

        let filterItems;

        let sortedFilterItems = this.props.filterItems.sort();

        switch(this.props.filterType){
            case 'stores':
                filterItems = sortedFilterItems.map((item, i) => {
                    return(
                        <option
                            value={item}
                            id={i}
                        >
                            {item}
                        </option>
                    )
                });
                break;
            case 'eventCategories':
                filterItems = sortedFilterItems.map((item, i) => {
                    return(
                        <option
                            value={item.id}
                            id={i}
                        >
                            {entities.decode(item.name)}
                        </option>
                    );
                });
                break;
        }

        this.state = {
            data: true,
            filterItems: filterItems
        };
    }


    render(){
        if(this.state.data){
            return(
                <Row className="dropdown-filter-container">
                    <Col xs={12} sm={4} className="label background-color-setter">
                        <p>Sort by {this.props.label}:</p>
                    </Col>
                    <Col xs={12} sm={8} className="dropdown background-color-setter-lighter">
                        <label for="dropdown-filter">
                            <span className="sr-only">{this.props.filterType}</span>
                            <select
                                name="dropdown-filter"
                                id={this.props.filterType + '-filter'}
                                onChange={this.props.filter}
                                value={this.state.dropdownValue}
                                className="font-color-setter"
                            >
                                <option value="all">All</option>
                                {this.state.filterItems}
                            </select>
                        </label>
                    </Col>
                </Row>
            );
        }
        return null;
    }
}


export default DropdownFilter;
