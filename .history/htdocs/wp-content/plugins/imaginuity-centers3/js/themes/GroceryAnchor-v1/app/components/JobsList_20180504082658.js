// Packages
import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
let moment = require('moment');
let momentRange = require('moment-range');
moment = momentRange.extendMoment(moment);
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();


class JobsList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            jobs: '',
            jobCount: 0,
        };
    }

    componentWillMount(){

        let jobCount = 0;

        let jobs = this.props.jobsData.map((job, i) => {

            let excerpt;
            if (job.acf.listing_copy) {
                var regex = /(<([^>]+)>)/ig;
                excerpt = entities.decode(job.acf.listing_copy).replace(regex, "").substr(0, 200) + "[...]";
                excerpt = excerpt.substr(0, excerpt.lastIndexOf(" ") + "[...]";
            }
            else {
                excerpt = false;
            }


            if(moment().diff(job.acf.end_date, 'days') <= 0 ){
                jobCount++;
                return(
                    <Col xs={12} md={6} className="job border-color-setter" key={i}>
                        <Col xs={12} sm={job.acf.featured_image ? 6 : 12}>
                            <div className="copy-container font-color-setter">
                                <h4><Link to={"/jobs/"+job.slug} key={job.id} >{entities.decode(job.title.rendered)}</Link></h4>
                                {job.acf.related_store &&
                                <Link className="store-link" key={job.acf.related_store.ID} to={'/stores/'+job.acf.related_store.post_name} storeID={job.acf.related_store.post_name}>
                                    {entities.decode(job.acf.related_store.post_title)}
                                </Link>
                                }
                                {excerpt &&
                                    <p>{excerpt}</p>
                                }
                            </div>
                        </Col>
                    </Col>
                );
            }
        });

        this.setState({
            data: true,
            jobs: jobs,
            jobCount: jobCount,
        });
    }

    categoryFilter(){
        $('.filter-item').addClass('hidden');
        let filterValue = $('#jobCategories-filter').val();
        console.log(filterValue);
        if(filterValue == 'all'){
            $('.filter-item').removeClass('hidden');
        }
        else{
            filterValue = parseInt(filterValue);
            $('.filter-item').each(function(){
                console.log($.inArray(filterValue, $(this).data('categories')) > -1);
                if($.inArray(filterValue, $(this).data('categories')) > -1){
                    console.log($(this).data('categories'));
                    $(this).removeClass('hidden');
                }
            });
        }
    }

    render(){
        if(this.state.data){
            return(
                <div className="jobs">
                    <Grid>
                        <Row>
                            {this.state.jobCount > 0 ? this.state.jobs : <h2>There are currently no jobs available</h2>}
                        </Row>
                    </Grid>
                </div>
            );
        }
        return null;
    }
}


export default JobsList;
