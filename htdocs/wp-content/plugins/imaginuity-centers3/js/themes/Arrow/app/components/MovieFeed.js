// Packages
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import axios from 'axios';
import { ReactBootstrap, Grid, Row, Button, Modal, ResponsiveEmbed } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Radium, {StyleRoot} from 'radium';
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
// Wrap elements in Radium to allow for custom styles generated based on primary color
let Col = require('react-bootstrap').Col;
let CalendarIcon = require('react-icons/lib/fa/calendar-o');
let PhoneIcon = require('react-icons/lib/fa/phone');
let LocationIcon = require('react-icons/lib/fa/map-marker');
let SearchIcon = require('react-icons/lib/fa/search');
let PlayIcon = require('react-icons/lib/fa/play-circle');
Col = Radium(Col);
CalendarIcon = Radium(CalendarIcon);
PhoneIcon = Radium(PhoneIcon);
LocationIcon = Radium(LocationIcon);
SearchIcon = Radium(SearchIcon);
PlayIcon = Radium(PlayIcon);

// Components
import Loader from './Loader';

// Endpoints
const Geocode = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const GoogleAPIkey = 'AIzaSyBHF1GDBvLyW0iLTnwZnSbKRcIcx-FMOtg';

const iShowtimes = 'https://api.internationalshowtimes.com/v4/';
const iShowtimesAPIkey = '&apikey=ov84xqnaQRsPvEfIIg0EN0M0J9HGzzaS';
const lang = '&lang=en-US,en';

class MovieFeed extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: false,
            error: false,
            address1: this.props.optionsData.acf.address_1 + '+',
            address2: this.props.optionsData.acf.address_2 + '+',
            address3: this.props.optionsData.acf.city + '+' + this.props.optionsData.acf.state + '+' + this.props.optionsData.acf.zip,
            multipleCinemas: false,
            amenities: this.props.pageData.acf.amenities,
            cinemaCount: 0,
            cinemaButtons: [],
            activeCinema: {
                id: 0,
                name: '',
                amenities: this.props.pageData.acf.amenities ? this.props.pageData.acf.amenities[0].amenities_entry : '',
                address1: '',
                address2: '',
                phone: '',
            },
            movies: [],
            startDate: moment().format('YYYY-MM-DD'),
            searchFilter: '',
            trailerTitle: '',
            trailerSource: '',
        }

        this.handleDate = this.handleDate.bind(this);
        this.movieNameFilter = this.movieNameFilter.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillMount(){
        this.retrieveMovieListings();
    }

    retrieveMovieListings(){
        let component = this;
        let activeCinema;
        let cinemaButtons;
        let moviesData = [];
        let cinemaLength = 0;

        let cinemasList = [];
        let moviesQueries = [];
        let showtimesQueries = [];

        axios.all([
            axios.get(
                Geocode +
                this.state.address1 +
                (this.state.address2 ? this.state.address2 : '') +
                this.state.address3 +
                "&key=" + GoogleAPIkey
            )
        ])
            .then(axios.spread(function(geo){

                let coordinates;
                let startDate = component.state.startDate;
                let multipleCinemas =  false;

                if(component.props.pageData.acf.single_theater_or_multiple_theaters === 'multiple'){
                    multipleCinemas = true;
                    coordinates = {
                        lat: parseFloat(component.props.pageData.acf.primary_theater_selection.latitude),
                        lon: parseFloat(component.props.pageData.acf.primary_theater_selection.longitude),
                    }
                }
                else{
                    coordinates = {
                        lat: geo.data.results[0].geometry.location.lat,
                        lon: geo.data.results[0].geometry.location.lng,
                    }
                }

                // Get cinemas in radius of coordinates
                axios.get(
                    iShowtimes +
                    'cinemas?' +
                    'location=' + coordinates.lat + ',' + coordinates.lon +
                    '&limit=5' +
                    '&distance=0.4' +
                    lang +
                    iShowtimesAPIkey
                )
                    .then((cinemas) => {

                        if(component.props.pageData.acf.single_theater_or_multiple_theaters === 'multiple'){
                            cinemaButtons = cinemas.data.cinemas.map((cinema) => {
                                return(
                                    <h2 data-cinema={cinema.name} onClick={component.switchCinema.bind(component)}>{cinema.name}</h2>
                                )
                            })
                        }

                        if(!component.state.activeCinema.name){
                            let cinemaAddress1 = cinemas.data.cinemas[0].location.address.house + ' ' + cinemas.data.cinemas[0].location.address.street;
                            let cinemaAddress2 = cinemas.data.cinemas[0].location.address.city + ', ' + cinemas.data.cinemas[0].location.address.state + ' ' + cinemas.data.cinemas[0].location.address.zipcode;
                            let cinemaPhone = cinemas.data.cinemas[0].telephone;

                            activeCinema = {
                                name: cinemas.data.cinemas[0].name,
                                amenities: component.props.pageData.acf.amenities ? component.props.pageData.acf.amenities[0].amenities_entry : '',
                                address1: cinemaAddress1,
                                address2: cinemaAddress2,
                                phone: cinemaPhone,
                            };
                        }

                        cinemaLength = cinemas.data.cinemas.length;

                        // Loop through cinemas queried
                        cinemas.data.cinemas.map((cinema, i) => {

                            cinemasList[i] = {
                                'title': cinema.name,
                                'id': cinema.id,
                            }

                            // Get all movies in the cinema
                            moviesQueries.push(
                                axios.get(
                                    iShowtimes +
                                    'movies?' +
                                    'cinema_id=' + cinema.id +
                                    '&time_from=' + (moment(startDate).startOf('day').toISOString()) +
                                    '&time_to=' + (moment(startDate).endOf('day').toISOString()) +
                                    '&all_fields=true' +
                                    lang +
                                    iShowtimesAPIkey
                                )
                            )
                        });

                        axios.all(moviesQueries)
                            .then((cinemaData) => {
                                cinemaData.map((cinema, i) => {

                                    moviesData[i] = {
                                        'title': cinemasList[i].title,
                                        'id': cinemasList[i].id,
                                        'movies': [],
                                    }

                                    // Build array of cinema showtime promises
                                    cinema.data.movies.map((movie, j) => {

                                        let ageLimits = false;

                                        if(movie.age_limits){
                                            if(movie.age_limits['US']){
                                                ageLimits = movie.age_limits['US'];
                                            }
                                        }

                                        moviesData[i].movies[j] = {
                                            'age_limits': ageLimits,
                                            'cinema_id': cinemasList[i].id,
                                            'genres': movie.genres ? movie.genres : false,
                                            'id': movie.id,
                                            'poster_image_thumbnail': movie.poster_image_thumbnail ? movie.poster_image_thumbnail : false,
                                            'runtime': movie.runtime,
                                            'slug': movie.slug,
                                            'showtimes': [],
                                            'synopsis': movie.synopsis,
                                            'title': movie.title,
                                            'trailer': movie.trailers ? movie.trailers[0] : false,
                                        };

                                        showtimesQueries.push(
                                            axios.get(
                                                iShowtimes +
                                                'showtimes?' +
                                                'movie_id=' + movie.id +
                                                '&cinema_id=' + cinemasList[i].id +
                                                '&time_from=' + (moment(startDate).startOf('day').toISOString()) +
                                                '&time_to=' + (moment(startDate).endOf('day').toISOString()) +
                                                lang +
                                                iShowtimesAPIkey
                                            )
                                        )

                                        axios.all(showtimesQueries)
                                            .then((showtimesData) => {

                                                showtimesQueries = [];

                                                showtimesData.map((showtimes, k) => {

                                                    let x=0;

                                                    showtimes.data.showtimes.map((showtime, l) => {
                                                        if(showtime.cinema_id == cinemasList[i].id && moviesData[i].movies[j]){
                                                            moviesData[i].movies[j].showtimes[l] =
                                                                {
                                                                    'booking_link': showtime.booking_link,
                                                                    'cinema_id': showtime.cinema_id,
                                                                    'language': showtime.language,
                                                                    'title': showtime.cinema_movie_title,
                                                                    'id': showtime.id,
                                                                    'is_3d': showtime.is_3d,
                                                                    'is_imax': showtime.is_imax,
                                                                    'start_at': showtime.start_at,
                                                                    'start_at_readable': moment(showtime.start_at, 'YYYY-MM-DDTHH:mm').format('h:mma'),
                                                                    'subtitle_language': showtime.subtitle_language,
                                                                };
                                                        }
                                                    })
                                                })
                                                component.setState({
                                                    data: true,
                                                    moviesData: moviesData,
                                                    multipleCinemas: multipleCinemas,
                                                    cinemaButtons: cinemaButtons,
                                                    cinemasData: cinemas.data.cinemas,
                                                    activeCinema: !component.state.activeCinema.name ? activeCinema : component.state.activeCinema,
                                                    cinemaCount: cinemaLength,
                                                }, () => {
                                                    component.buildMovies(moviesData, component.state.activeCinema.name);
                                                })
                                            })
                                            .catch((err) => {
                                                console.log('Error in showtimes queries');
                                                component.handleAxiosError(err);
                                            });
                                    });

                                })
                            })
                            .catch((err) => {
                                console.log('Error in movies queries');
                                component.handleAxiosError(err);
                            });
                    })
                    .catch((err) => {
                        console.log('Error in cinema radius query');
                        component.handleAxiosError(err);
                    });
            }))
            .catch((err) => {
                console.log('Error in Geocoding call');
                component.handleAxiosError(err);
            })
    }

    handleAxiosError(error){
        console.log(error);
        if(error.response){
            console.log(error.response);
            console.log(error.response.status);
        }
        this.setState({
            error: true
        })
    }

    handleDate(date){
        if(moment(date, "YYYY-MM-DD").format('YYYY-MM-DD') !== this.state.date){
            this.setState({
                data: false,
                startDate: moment(date, "YYYY-MM-DD").format('YYYY-MM-DD'),
                movies: [],
                moviesData: [],
                cinemasData: [],
            })
            this.retrieveMovieListings(this.state.activeCinema.name);
        }
    }

    handleSummary = (e) => {
        $(e.target).closest('.summary').toggleClass('expanded');
    }

    movieNameFilter = (e) => {

        this.setState({
            searchFilter: e.target.value,
        });

        let filterValue = e.target.value.toLowerCase();
        let movieValue;

        if(filterValue) {
            $('#movie-submit').addClass('active');
        } else {
            $('#movie-submit').removeClass('active');
        }

        $('.movie-listing').each(function(){
            movieValue = $(this).data('movie').toLowerCase();
            if(movieValue.indexOf(filterValue) === -1){
                $(this).hide();
            }
            else{
                $(this).show();
            }
        });
    }

    clearMovieNameFilter = (e) => {
        e.preventDefault();

        $('#movie-submit').removeClass('active');
        $('#movie-name').val('');

        $('.movie').each(function(){
            $(this).show();
        });
        this.setState({
            searchFilter: '',
        });
    }

    switchCinema = (e) => {
        let component = this;

        let selectedCinema = e.target.dataset.cinema;
        let cinema = this.state.cinemasData.map((cinema, i) => {
            if(selectedCinema === cinema.name){
                component.setState({
                    activeCinema: {
                        id: i,
                        name: cinema.name,
                        amenities: component.state.amenities ? component.state.amenities[i].amenities_entry : '',
                        address1: cinema.location.address.house + ' ' + cinema.location.address.street,
                        address2: cinema.location.address.city + ', ' + cinema.location.address.state + ' ' + cinema.location.address.zipcode,
                        phone: cinema.telephone,
                    }
                }, () => {
                    console.log('Cinema switch');
                });

            }
        });

        $('.movie-listing').each(function(){
            $(this).addClass('movie-hidden');
            cinema = $(this).data('cinema');

            if(cinema === selectedCinema){
                $(this).removeClass('movie-hidden');
            }
        })
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow(e) {
        let trailer = e.target.dataset.trailer;
        let movie = e.target.dataset.movie;

        this.setState({
            show: true,
            trailerTitle: movie,
            trailerSource: trailer,
        });
    }

    buildMovies(moviesData, activeCinema){

        let playButtonStyles = {
            fill: this.props.optionsData.acf.primary_color,
            marginRight: '5px',
            marginBottom: '3px',
        }

        let movies = [];
        moviesData.map((cinema, i) => {

            let genres = false;
            cinema.movies.map((movie, j) => {

                if(movie.genres){
                    genres = movie.genres.map((genre, k) => {
                        return genre.name + ((movie.genres.length - 1) > k ? ', ' : '');
                    });
                }

                // sort showtimes by start time
                let showtimesSorted = movie.showtimes.sort(function(a,b) {return (a.start_at > b.start_at) ? 1 : ((b.start_at > a.start_at) ? -1 : 0)});

                let showtimes = [];
                let imaxShowtimes = [];
                let threeDShowtimes = [];

                showtimesSorted.map((showtime, k) => {

                    let _showtime =
                        <Button
                            disabled={moment(showtime.start_at).isSameOrBefore(moment())}
                            className="pull-left background-color-setter"
                            href={showtime.booking_link}
                            target="_blank"
                            data-start={showtime.start_at_readable}
                        >
                            {showtime.start_at_readable}
                        </Button>;

                    if(showtime.is_imax){
                        imaxShowtimes.push(_showtime);
                    }
                    else if(showtime.is_3d){
                        threeDShowtimes.push(_showtime);
                    }
                    else{
                        showtimes.push(_showtime);
                    }
                })

                let trailer = false;
                let trailerSource;
                if(movie.trailer){
                    if(movie.trailer.trailer_files[0].format === 'youtube'){
                        trailer = true;
                        let youtubeID = movie.trailer.trailer_files[0].url.substr(movie.trailer.trailer_files[0].url.indexOf('=') + 1, movie.trailer.trailer_files[0].url.length);
                        trailerSource = 'https://www.youtube.com/embed/' + youtubeID;
                    }
                }

                movies.push(
                    <Col
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        data-cinema={cinema.title}
                        data-movie={movie.title}
                        className={"movie-listing" + (cinema.title !== activeCinema ? ' movie-hidden' : '')}
                    >
                        {movie.poster_image_thumbnail &&
                            <div className="movie-poster">
                                <img src={movie.poster_image_thumbnail} alt={movie.title + ' poster'} className="img-responsive" />
                            </div>
                        }
                        <div className="content">
                            <h2>{movie.title}</h2>
                            <p className="rating">Rating: {movie.age_limits ? movie.age_limits : 'NA'}</p>
                            <p className="duration">Runtime: {movie.runtime ? movie.runtime + ' minutes' : 'NA'}</p>
                            <p className="genre">Genre: {genres.length > 0 ? genres : 'NA'}</p>
                            {trailer ?
                                <a
                                    data-toggle="modal"
                                    data-target={'#trailer-modal'}
                                    data-trailer={trailerSource}
                                    data-movie={movie.title}
                                    onClick={this.handleShow}
                                    className="trailer">
                                    <PlayIcon size={20} style={playButtonStyles}/>
                                    Trailer
                                </a>
                                : ''}
                            <div className="summary hidden-xs">
                                <p onClick={this.handleSummary.bind(this)}><span>Summary: <span className="summary-caret font-color-setter">{entities.decode('&#x25BC;')}</span></span><br/>{movie.synopsis}</p>
                            </div>
                        </div>
                        <div className="visible-xs summary-mobile summary">
                            <p onClick={this.handleSummary.bind(this)}><span>Summary: <span className="summary-caret font-color-setter">{entities.decode('&#x25BC;')}</span></span><br/>{movie.synopsis}</p>
                        </div>
                        <div className="movie-showtimes">
                            {movie.quals ? <p className="amenities">{movie.quals}</p> : ''}
                            <div className="standard">
                                {showtimes}
                            </div>
                            {imaxShowtimes.length > 0 &&
                                <div className="imax">
                                    <h3>IMAX</h3>
                                    {imaxShowtimes}
                                </div>
                            }
                            {threeDShowtimes.length > 0 &&
                                <div className="3d">
                                    <h3>3D</h3>
                                    {threeDShowtimes}
                                </div>
                            }
                        </div>
                    </Col>
                );
            });
        });
        if(this.state.data){
            this.setState({
                movies: movies
            })
        }
    }

    render(){
        if(this.state.data){
            let showtimeDateStyles = {
                backgroundColor: this.props.optionsData.acf.primary_color,
                '@media screen and (min-width: 640px)': {
                    backgroundColor: this.props.optionsData.acf.primary_color,
                },
            }

            let cinemaPhoneStyles = {
                '@media screen and (min-width: 640px)': {
                    backgroundColor: this.props.optionsData.acf.primary_color,
                    color: 'white',
                },
                svg: {
                    fill: this.props.optionsData.acf.primary_color,
                    '@media screen and (min-width: 640px)': {
                        fill: 'white'
                    }
                }
            }

            let cinemaAddressStyles = {
                '@media screen and (min-width: 992px)': {
                    backgroundColor: this.props.optionsData.acf.primary_color,
                    color: 'white',
                },
                svg: {
                    fill: this.props.optionsData.acf.primary_color,
                }
            }

            let movieFilterStyles = {
                '@media screen and (min-width: 992px)': {
                    backgroundColor: this.props.optionsData.acf.primary_color,
                    color: 'white',
                },
                input: {
                    borderColor: this.props.optionsData.acf.primary_color,
                    '::placeholder': {
                        color: this.props.optionsData.acf.primary_color,
                    },
                    '@media screen and (min-width: 992px)': {
                        borderColor: 'white',
                    }
                },
                svg: {
                    fill: this.props.optionsData.acf.primary_color,
                }
            }
            
            let iconSize = 30;
            let searchIconSize = 25;

            return(
                <StyleRoot>
                <div className="movie-feed">
                    <Modal id="trailer-modal" show={this.state.show} onHide={this.handleClose.bind(this)}>
                        <Modal.Header closeButton>
                            <Modal.Title id="trailer-title">
                                {this.state.trailerTitle}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="youtube-embed">
                                <ResponsiveEmbed a16by9>
                                    <iframe id="trailer-frame" src={this.state.trailerSource} frameborder="0"></iframe>
                                </ResponsiveEmbed>
                            </div>
                        </Modal.Body>
                    </Modal>
                    <div className={"header cinema-count-" + this.state.cinemaCount}>
                        <h1>{this.state.activeCinema.name}</h1>
                        {this.state.amenities &&
                        <p dangerouslySetInnerHTML={{__html:this.state.activeCinema.amenities}}></p>
                        }
                        {this.state.multipleCinemas ? this.state.cinemaButtons : ''}
                    </div>
                    <Grid>
                        <Row className="info-bar">
                            <Col xs={12} sm={6} md={3} className="showtime-date info-item" style={showtimeDateStyles}>
                                <div className="picker-container">
                                    <CalendarIcon size={iconSize}/>
                                    <span className="date-icon-fill">{moment(this.state.startDate).format('D')}</span>
                                    <p>Show movies for:</p>
                                    <DatePicker
                                        selected={moment(this.state.startDate)}
                                        onChange={this.handleDate.bind(this)}
                                        dateFormat="M-D"
                                        minDate={moment()}
                                        placeholderText="Weeks start on Monday"// + moment().format('M/D')}
                                    />
                                </div>
                            </Col>

                            {this.state.activeCinema.phone &&
                            <Col xs={12} sm={6} md={3} className="cinema-phone info-item" style={cinemaPhoneStyles}>
                                <PhoneIcon size={iconSize}  style={cinemaPhoneStyles.svg} />
                                <a href={'tel:' + this.state.activeCinema.phone}>{this.state.activeCinema.phone}</a>
                            </Col>
                            }

                            <Col xs={12} sm={this.state.activeCinema.phone ? 6 : 12} md={3} className="cinema-address info-item" style={cinemaAddressStyles}>
                                <div className="cinema-address-container">
                                    <a href={'https://www.google.com/maps/place/' + this.state.activeCinema.address1 + '+' + this.state.activeCinema.address2} target="_blank">
                                        <LocationIcon size={iconSize} style={cinemaAddressStyles.svg} />
                                        <p>{this.state.activeCinema.address1}<br/>{this.state.activeCinema.address2}</p>
                                    </a>
                                </div>
                            </Col>

                            <Col xs={12} sm={6} md={3} className="movie-filter info-item" style={movieFilterStyles}>
                                <form action="" id="movie-search" onSubmit={this.clearMovieNameFilter.bind(this)}>
                                    <label for="movie-name" className="movie-name-label">
                                        <span className="sr-only">Movie Name</span>
                                        <input
                                            type="text"
                                            placeholder="search"
                                            id="movie-name"
                                            value={this.state.searchFilter}
                                            onChange={this.movieNameFilter.bind(this)}
                                            style={movieFilterStyles.input}
                                        />
                                    </label>
                                    <label for="movie-submit">
                                        <span className="sr-only">Search Movie</span>
                                        <input type="submit" id="movie-submit" style={movieFilterStyles.input} />
                                        <SearchIcon size={searchIconSize} style={movieFilterStyles.svg}/>
                                    </label>
                                </form>
                            </Col>
                        </Row>
                        <Row className="movie-list">
                            {this.state.movies ? this.state.movies : "There are no showtimes currently available"}
                        </Row>
                    </Grid>
                </div>
                </StyleRoot>
            )
        }
        else if(this.state.error){
            return(
                <div className="movie-feed">
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <h3 className="error">There is an error with the data feed for movie showtimes. Please try again later. If this problem continues, please <Link to="/contact-us/">contact us</Link> and report this issue.</h3>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
        return <Loader/>;
    }
}

export default Radium(MovieFeed);