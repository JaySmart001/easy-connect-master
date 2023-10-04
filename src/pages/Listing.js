import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import CategoryBlock from '../components/CategoryBlock';
import ListingCard from '../components/ListingCard';
import PageContainer from '../components/PageContainer';
import { useMediaQuery } from 'react-responsive'
import PageHeader from '../components/PageHeader';


const Listing = ({ general }) => {
    const [categories, setCategories] = useState(general.categories);
    const [listings, setListings] = useState(general.listings);
    const [featuredCategories, setFeaturedCategories] = useState([]);

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

    const getListIcon = (cat) => {
        return featuredCategories.find((feature) => feature.name === cat)?.icon
    }

    return (
        <PageContainer mainNav mainFooter marginTop>
            <PageHeader pageTitle="Listings" />

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 heading-section text-center mb-5" data-aos="fade-up" data-aos-duration="1000">
                            <span className="subheading">Our Listing</span>
                            <h2 className="mb-4">Popular Listing</h2>
                        </div>
                    </div>
                    <div className="row">
                        {
                            listings.map((listing, key) => (
                                <div 
                                    className="col-12 col-lg-6 d-flex align-items-stretch"
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

            <section className="ftco-section ftco-no-pt bg-light">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-md-12 services-wrap">
                            <div className="row justify-content-center">
                                <div className="col-md-8 heading-section text-center mb-5" data-aos="fade-up" data-aos-duration="1000">
                                    <span className="subheading">Categories</span>
                                    <h2 className="mb-4">Top Categories</h2>
                                </div>
                            </div>
                            <div className="row g-3">
                                {
                                    featuredCategories.map((cat, key) => ( key < 6 && <CategoryBlock key={key} category={cat} /> ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageContainer>
    )
}

const mapStateToProps = ({ general }) => ({ general })

export default connect(mapStateToProps, null)(Listing)
