import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as initActions from '../actions/home-actions';

import HomeData from '../components/HomeData.js';

class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            people: []
        };
    }

    render(){

        const {people} = this.props;
        return(
            <div>
                <HomeData />
            </div>
        );
    }
}

Home.propTypes = {
    people: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
    return {
        people: state.people
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(initActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
