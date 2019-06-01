// Packages
import React, { Component } from 'react';

class PixelTrackingCode extends Component{
    constructor(props){
        super(props);

        this.state = {
            pixelCode: this.props.pixelCode
        }
    }

    componentWillReceiveProps(){
        this.setState({
            pixelCode: this.props.pixelCode
        })
    }

    render(){
        return <img src={this.state.pixelCode} alt="pixel tracking code" style={{position: 'absolute'}} className="hidden"/>
    }
}

export default PixelTrackingCode;