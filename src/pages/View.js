import React, { useState, useEffect } from 'react'
import PageContainer from '../components/PageContainer'
import PageHeader from '../components/PageHeader'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import ImageGallery from 'react-image-gallery';
import { useMediaQuery } from 'react-responsive'
import ListingCard from '../components/ListingCard';

const View = ({ general, ...props}) => {
    const history = useHistory()
    if(!props.match.params.id) {
        history.push('/')
    }
    const [categories, setCategories] = useState(general.categories);
    const [listing, setListing ] = useState()
    const [listings, setListings ] = useState(general.listings)
    const [images, setImages ] = useState([])
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })

    useEffect(() => {
        if(props.match.params.id) {
            setListing(listings?.find(({id}) => id == props.match.params.id))
        }
    }, [props.match, listings])

    useEffect(() => {
        setCategories(general.categories)
    }, [general.categories])

    useEffect(() => {
        getFeatureCategories()
    }, [categories])

    const getFeatureCategories = () => {
        const cats = categories.map(({icon, name}, key) => ({ icon, name, listing: listings.filter(({ businessCategory }) => ( businessCategory === name)).length })).sort((a, b) => (a.listing > b.listing) ? -1 : 1 )
        setFeaturedCategories(cats)
    }


    useEffect(() => {
        setListings(general.listings)
    }, [general.listings])

    useEffect(() => {
        if(listing?.businessImages) {
            setImages(
                listing.businessImages.map(({ file }) => {
                    return {
                        original: file,
                        thumbnail: file,
                    }
                })
            )
        } else {
            setImages([])
        }
    }, [listing])

    
    const getListIcon = (cat) => {
        return featuredCategories.find((feature) => feature.name === cat)?.icon
    }

    return (
        <PageContainer mainNav mainFooter>
            <PageHeader description={listing?.businessInfo} pageTitle={`${listing?.businessName || ''}`}></PageHeader>

            <section className="ftco-section bg-light">
                <div className="container">
                    {   listing && 
                        <div className="row listing">
                            <div 
                                className="col-md-6 col-sm-12 col-lg-6 mb-5"
                            >
                                <h3>Business Images</h3>
                                <ImageGallery items={images} />;
                            </div>

                            <div 
                                className="col-md-6 col-sm-12 col-lg-6"
                                style={{ paddingLeft: !isPhone ? '3rem' : '0' }}
                            >   <h3>Business Information</h3>
                                <p><span>Business Name: </span>{listing.businessName}</p>
                                <p><span>Business Description: </span>{listing?.businessInfo}</p>
                                <p><span>Business Category: </span>{listing.businessCategory}</p>
                                <p><span>Business Specialty: </span>{listing.businessSpecialty}</p>
                                <p><span>Business Email: </span>{listing.businessEmail}</p>
                                <p><span>Business Phone: </span>{listing.businessPhone}</p>
                                <p><span>Business Address: </span>{listing.businessAddress}</p>
                                <p><span>Business Location: </span>{listing.businessLocation}</p>
                                <p><span>ID Card: </span>{listing.nationalId ? 'Submitted' : 'N/A'}</p>
                                <p><span>BVN: </span>{listing.bvn ? 'Submitted' : 'N/A'}</p>
                                <p><span>Guarantor: </span>{listing.guarantorPhone || listing.guarantorAddress ? 'Submitted' : 'N/A'}</p>
                            </div>

                            <hr/>
                            
                            <div 
                                className="col-sm-12"
                                style={{ marginTop: '3rem' }}
                            >
                                <p style={{ textAlign: 'center' }}>
                                    Note: The company will not be liable for contacts who <b>did not</b> submit their <b>ID Card</b>, <b>BVN</b> and or <b>Guarantor</b>
                                </p>
                                <h3 style={{ textAlign:'center' }}>Contact Business Owner</h3>
                                <div className="d-flex justify-content-center contact-owner">
                                    <a href={`mailto:${listing.businessEmail}`} className="btn btn-primary">Email</a>
                                    <a href={`tel:${listing.businessPhone}`} className="btn btn-primary">Phone</a>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </section>

            <section className="ftco-section bg-light ftco-no-pt">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 heading-section text-center mb-5" data-aos="fade-up" data-aos-duration="1000">
                            <span className="subheading">Listings</span>
                            <h2 className="mb-4">Similar Listings</h2>
                        </div>
                    </div>
                    <div className="row">
                        {
                            listings.map((listing, key) => (
                                key < 4 && <div 
                                    className="col-lg-6 col-12 d-flex align-items-stretch"
                                    data-aos="fade-up" 
                                    data-aos-delay="100"
                                    data-aos-duration="1000"
                                    key={key}
                                >
                                    <ListingCard listing={listing} icon={getListIcon(listing.businessCategory)} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </PageContainer>
    )
}

const mapStateToProps = ({ general }) => ({ general })



export default connect(mapStateToProps, null)(View)
