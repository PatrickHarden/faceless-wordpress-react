// Packages
import React, { PropTypes, Component } from 'react';
import { ReactBootstrap } from 'react-bootstrap';
import $ from 'jquery';
import Slider from 'react-slick';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

import Loader from './Loader';

class DatesSlider extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            dates: '',
            day: false,
        }
    }

    componentWillMount(){
        let counter = 0;
        let dates = [];
        while(counter <= 6){
            let day = moment().add(counter, 'day').format('DDD');
            let weekday = moment().add(counter, 'day').format('dddd');
            let date = moment().add(counter, 'day').format('M/D');
            dates.push(
                <div
                    className="date font-color-setter"
                    data-date={day}
                    onClick={()=>{this.filterEvents(day)}}
                >
                    <h3>{weekday}</h3>
                    <h4>{date}</h4>
                </div>
            );
            counter++;
        }

        this.setState({
            data: true,
            dates: dates,
        });
    }

    filterEvents(day){

        $('.date-active').removeClass('date-active');
        $('.date[data-date="' + day + '"]').addClass('date-active');
        $('.event').addClass('hidden');
        $('.event').each(function(){

            let range = moment.range($(this).data('startdate'), $(this).data('enddate'));

            if(range.contains(parseInt(day))){
                $(this).removeClass('hidden');
            }
        });

        this.setState({
            day: day
        });
    }

    render(){
        if(this.state.data){
            const datesSettings = {
                dots: false,
                autoplay: false,
                draggable: true,
                infinite: true,
                slidesToShow: 7,
                slidesToScroll: 1,
                arrows: true,
                responsive: [
                    {breakpoint: 640,
                        settings: {
                            arrows: true,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        },
                    },
                    {breakpoint: 992,
                        settings: {
                            vertical: false,
                            arrows: true,
                            slidesToShow: 3,
                            slidesToScroll: 1,
                        }
                    },
                    {breakpoint: 1600,
                        settings: {
                            vertical: false,
                            arrows: true,
                            slidesToShow: 5,
                            slidesToScroll: 1,
                        }
                    }
                ]
            };

            return(
                <div className="date-filter-container">
                    <Slider
                        className={"date-filter"}
                        ref={a => this.slider = a }
                        {...datesSettings}
                    >
                        {this.state.dates}
                    </Slider>
                </div>
            );

        }
        return <Loader />;
    }
}

export default DatesSlider;