// Packages
import React, { Component } from 'react';
import axios from 'axios';

// Components
import Sunny from 'react-icons/lib/io/android-sunny';
import PartlyCloudy from 'react-icons/lib/io/ios-partlysunny-outline';
import Cloudy from 'react-icons/lib/io/ios-cloudy-outline';
import Rainy from 'react-icons/lib/io/ios-rainy-outline';
import Thunder from 'react-icons/lib/io/ios-thunderstorm-outline';
import Snow from 'react-icons/lib/io/ios-snowy';

// Endpoints
let Weather = window.location.protocol + '//api.apixu.com/v1/current.json?key=cc936ae24694419b9b6192205183010&q=';

class NavWeather extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    componentWillMount(){

        let component = this;

        axios.get(Weather + this.props.optionsData.acf.zip)
            .then((response) => {

                let currentCondition = 'Partly Cloudy';
                let icon = <PartlyCloudy size={40} />;
                let weatherCode = response.data.current.condition.code;

                // match character codes for weather conditions, choose one of our icons to match
                let sunny = [1000];
                let partlyCloudy = [1003,];
                let cloudy = [1006,1009,1135];
                let rainy = [1030,1063,1150,1180,1183,1186,1189,1192,1195,1240,1243,1246,];
                let thunder = [1087,1273,1276,1279,1282];
                let snow = [1066,1069,1072,1114,1117,1147,1171,1198,1201,1204,1207,1210,1213,1216,1219,1222,1225,1237,1255,1258,1261,1264,];

                let conditionCodes = [
                    {
                        'display': 'Sunny',
                        'codes': sunny
                    },
                    {
                        'display': 'Partly Cloudy',
                        'codes': partlyCloudy
                    },
                    {
                        'display': 'Cloudy',
                        'codes': cloudy
                    },
                    {
                        'display': 'Rainy',
                        'codes': rainy
                    },
                    {
                        'display': 'Thunder',
                        'codes': thunder
                    },
                    {
                        'display': 'Snow',
                        'codes': snow
                    },
                ];

                conditionCodes.map((condition) => {
                    if(condition.codes.indexOf(weatherCode) > -1){
                        currentCondition = condition.display;

                        switch(currentCondition){
                            case 'Sunny':
                                icon = <Sunny size={40} />;
                                break;
                            case 'Partly Cloudy':
                                icon = <PartlyCloudy size={40} />;
                                break;
                            case 'Cloudy':
                                icon = <Cloudy size={40} />;
                                break;
                            case 'Rainy':
                                icon = <Rainy size={40} />;
                                break;
                            case 'Thunder':
                                icon = <Thunder size={40} />;
                                break;
                            case 'Snow':
                                icon = <Snow size={40} />;
                                break;
                            default:
                                icon = <PartlyCloudy size={40} />;
                                break;
                        }
                    }
                })

                component.setState({
                    data: true,
                    currentCondition: currentCondition,
                    icon: icon,
                });

                // switch(response)
            })
    }

    render(){
        if(this.state.data){
            return(
                <div className="weather">
                    {this.state.icon}
                    <p>{this.state.currentCondition}</p>
                </div>
            );
        }
        return null;
    }
}

export default NavWeather;