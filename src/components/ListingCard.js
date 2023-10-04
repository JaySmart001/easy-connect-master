import React from 'react'
import { useHistory } from 'react-router-dom'
import { Grid } from '@material-ui/core'

const ListingCard = ({ listing, icon, ...props }) => {
    const history = useHistory()
    const img = listing?.businessImages?.[0]?.file || ''

    const open = () => {
        history.push(`/view-listing/${listing.id}`)
    }
    return (
        <div className="listing-wrap listing">
            <Grid container>
                <Grid item xs={6}>
                    <a 
                        onClick={() => open()}
                        className="img img-property d-flex align-items-center justify-content-center glightbox"
                        style={{ backgroundImage: `url(${img})`, cursor: 'pointer' }}>
                        <div className="icon d-flex align-items-center justify-content-center">
                            <span className="fa fa-search"></span>
                        </div>
                    </a>
                </Grid>
                <Grid item xs={6}>
                    <div className="text">

                        <h3><a className="listing-name" onClick={() => open()}>{listing.businessName}</a></h3>
                        
                        <div className="d-flex align-items-center">
                            <div className="icon d-flex align-items-center justify-content-center">
                                <span className={'d-flex ' + icon} ></span>
                            </div>
                            <span style={{ marginLeft: '.1rem' }} className="subheading category-name">Category: {listing.businessCategory}</span>
                        </div>

                        <ul className="">
                            <li>
                                <p><span className="fa fa-th-list"></span>Specialization: {listing.businessSpecialty}</p>
                            </li>
                            <li>
                                <p><span className="fa fa-compass"></span>Location: {listing.businessAddress}</p>
                            </li>
                            <li>
                                <p><span className="fa fa-phone"></span>Phone: {listing.businessPhone}</p>
                            </li>
                        </ul>
                        <div className="info-wrap2 d-flex align-items-center">
                            <p className="review">
                                <span className="rev">Review: <small>{listing.businessRating ? `${listing.businessRating}/5` : 'N/A'}</small></span> 
                                {/* <span className="fa fa-star"></span><small>(100)</small> */}
                            </p>
                            <p className="review text-right">
                                <span onClick={() => open()} style={{ cursor: 'pointer' }} className="rev">Read More</span> 
                                {/* <span className="fa fa-star"></span><small>(100)</small> */}
                            </p>
                            {/* <p className="heart">
                                {/* <a href="#" className="d-flex align-items-center justify-content-center"><span
                                        className="ion-ios-heart-empty"></span></a>
                            </p> */}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default ListingCard
