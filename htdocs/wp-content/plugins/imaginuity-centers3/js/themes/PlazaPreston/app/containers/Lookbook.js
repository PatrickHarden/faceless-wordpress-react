// Packages
import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {ReactBootstrap, ResponsiveEmbed} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();

// Components
import Helmet from 'react-helmet';
import Masonry from 'react-masonry-component';
import EventCTA from '../components/EventCTA';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';
const Images = SiteURL + "/wp-content/plugins/imaginuity-centers3/js/themes/PlazaPreston/lib/img/";

class Lookbook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
        };
    }

    componentWillMount() {
        const component = this;

        axios.all([
            axios.get(SiteURL + '/wp-json'),
            axios.get(Pages + '?slug=lookbook'),
            axios.get(PropertyOptions),
        ])
            .then(axios.spread(function (site, page, options) {

                let looks = page.data[0].acf.looks.map((look, i) => {

                    let stores;

                    if (look.stores) {
                        stores = look.stores.map((store, s) => {
                            return (
                                <Link
                                    to={'/store/' + store.post_name}
                                    key={s}
                                >
                                    {entities.decode(store.post_title)} >
                                </Link>
                            )
                        });
                    }

                    return (
                        <div className="look" key={i}>
                            <img src={look.image.url} alt={look.image.alt ? look.image.alt : 'lookbook item ' + i}/>
                            {stores}
                        </div>
                    )
                })


                component.setState({
                    data: true,
                    siteData: site.data,
                    pageData: page.data[0],
                    optionsData: options.data,
                    looks: looks,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    //on click of image, hide & autoplay video
    playVideo = (e) => {
        $(e.target).parents('.video-container').addClass('show-video');
        var symbol = $(e.target).siblings('.embed-responsive').find('iframe')[0].src.indexOf("?") > -1 ? "&" : "?";
        $(e.target).siblings('.embed-responsive').find('iframe')[0].src += symbol + "autoplay=1";
    }

    showLooks = () => {
        $('.masonry-container').addClass('expanded');
        $('.view-more').hide();
    }

    render() {
        if (this.state.data) {

            let masonryOptions = {
                transitionDuration: 200,
                horizontalOrder: true,
            };

            return (
                <div className="template-lookbook">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {
                                'name': 'description',
                                'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)
                            },
                        ]}
                    />
                    <div className="header">
                        <h1>The Plaza at Preston Center</h1>
                        <img className="lookbook-logo" src={Images + 'LOOKBOOK.png'} alt="LOOKBOOK"/>
                    </div>
                    <div className="video-wrapper">
                        <img className="sculpture" src={Images + 'yellow-sculpture.png'} alt="yellow metal sculpture"/>
                        <img className="foliage " src={Images + 'background-foliage.png'} alt="foliage"/>
                        <div className="youtube-embed">
                            <div onClick={this.playVideo} className="video-container container">
                                {this.state.pageData.acf.video_overlay_image &&
                                <img className="video-overlay" src={this.state.pageData.acf.video_overlay_image.url}
                                     alt={this.state.pageData.acf.video_overlay_image.alt}/>
                                }
                                {this.state.pageData.acf.video_embed_link &&
                                <ResponsiveEmbed a16by9>
                                    <iframe id="video-frame" src={this.state.pageData.acf.video_embed_link}
                                            frameborder="0"></iframe>
                                </ResponsiveEmbed>
                                }
                                {this.state.pageData.acf.video_embed_link &&
                                <img className="playbutton" src={Images + 'plaza-playbutton.png'} alt="playbutton"/>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="lookbook">
                        <h2>See all the looks</h2>
                        <div className="masonry-container">
                            <Masonry
                                className={"looks"}
                                options={masonryOptions}
                                ref={function (c) {
                                    this.masonry = this.masonry || c.masonry;
                                }.bind(this)}
                            >
                                {this.state.looks}
                            </Masonry>
                        </div>
                        <div className="view-more">
                            <p onClick={this.showLooks}>Show me more looks</p>
                            <img
                                src={Images + 'down-arrow.png'}
                                alt="view more"
                                onClick={this.showLooks}
                            />
                        </div>
                    </div>
                    <EventCTA/>
                </div>
            );
        }
        return <Loader/>;
    }
}


export default Lookbook;
