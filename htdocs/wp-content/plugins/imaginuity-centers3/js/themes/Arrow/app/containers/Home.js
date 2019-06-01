import React, {Component} from 'react';

import HomeData from '../components/HomeData.js';

class Home extends Component{
    constructor(props) {
        super(props);

    }

    render(){
        return(
            <div data-page="home">
                <HomeData />
            </div>
        );
    }
}


export default Home;
