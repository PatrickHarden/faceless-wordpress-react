// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';
import {ReactBootstrap, Grid, Row, Col, Button} from 'react-bootstrap';

let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
// let Entities = require('html-entities').AllHtmlEntities;

// let entities = new Entities();

class ImageGrid extends Component {
    constructor(props) {
        super(props);

        console.log(this.props.images);

        this.state = {
            mergeCounter: 1,
            images: this.props.images,
            image_group_1: "",
            image_group_2: "",
            image_group_3: "",
            image_group_4: "",
            image_group_5: "",
            image_group_6: "",
            image_group_7: "",
            image_group_8: ""
        }
    }

    componentDidMount() {
        this.startSliderEffect();
    }

    startSliderEffect() {
        let component = this;
        //animate last image in each group, move to top of group
        $('.image-group').each(function () {
            let randomNumber = component.randomNumber();
            let group = $(this);
            component.sliderTimer(randomNumber, group); //set the interval for this group
        });
    }

    sliderTimer(randomNumber, group) {
        let component = this;
        let randomTimeout = component.randomNumber() * 1000;

        let sliderEffect = function () {
            let figure = group.find('figure').last(); //find current last figure to animate

            if (randomNumber % 2 === 0) {
                $(figure).animate({
                    left: "-100%",
                }, 500).promise().done(function () {
                    figure.prependTo(group.children().first());
                    figure.css('left', '0');
                });
            }
            else {
                $(figure).animate({
                    top: "-100%",
                }, 500).promise().done(function () {
                    figure.prependTo(group.children().first());
                    figure.css('top', '0');
                });
            }

        };
        setInterval(sliderEffect, randomTimeout);
    }

    randomNumber() {
        return 5 + Math.floor(Math.random() * 10)
    }

    mapImageArrays(imageArray) {
        return imageArray.map((image, index) =>
            <figure key={index} style={{backgroundImage: 'url(' + image.image.url + ')'}}/>
        );
    }

    render() {
        return (
            <div className="image-grid-container">
                <div className="module image_grid">

                    <div className="col-1 row-1 image-group image-group-1">
                        <div>
                            {this.mapImageArrays(this.state.images.image_group_1)}
                        </div>
                    </div>

                    <div className="col-2">
                        <div className="row-1 image-group image-group-2">
                            <div>
                                {this.mapImageArrays(this.state.images.image_group_2)}
                            </div>
                        </div>
                        <div className="row-2 image-group image-group-3">
                            <div>
                                {this.mapImageArrays(this.state.images.image_group_3)}
                            </div>
                        </div>
                    </div>

                    <div className="col-3">
                        <div className="row-1">
                            <div className="col-1 image-group image-group-4">
                                <div>
                                    {this.mapImageArrays(this.state.images.image_group_4)}
                                </div>
                            </div>
                            <div className="col-2 image-group image-group-5">
                                <div>
                                    {this.mapImageArrays(this.state.images.image_group_5)}
                                </div>
                            </div>
                        </div>
                        <div className="row-2">
                            <div className="col-1 image-group image-group-6">
                                <div>
                                    {this.mapImageArrays(this.state.images.image_group_6)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-4 image-group image-group-7">
                        <div>
                            {this.mapImageArrays(this.state.images.image_group_7)}
                        </div>
                    </div>

                    <div className="col-5 image-group image-group-8">
                        <div>
                            {this.mapImageArrays(this.state.images.image_group_8)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageGrid;