// Packages
import React, {PropTypes, Component} from 'react';
import Loading from 'react-loading';

class Loader extends Component {
    constructor(props){
        super(props);

        this.state = {
            loaderStyles: {
                width: '100%',
                height: '35vh',
            },
            iconStyles: {
                position: 'relative',
                left: '50%',
                marginLeft: '-32px',
                top: '35%',
                display: 'inline-block',
            }
        };
    }

    render() {
        return (
            <div className="loader"
                 style={(this.props.loaderStyles ? this.props.loaderStyles : this.state.loaderStyles)}>
                <div style={this.state.iconStyles} className="loading-container">
                    <Loading type={(this.props.type ? this.props.type : 'spinningBubbles')}
                             color={(this.props.color ? this.props.color : '#327785')}/>
                </div>
            </div>
        );
    }
}

export default Loader;