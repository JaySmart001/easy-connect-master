import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import CategoryBlock from '../components/CategoryBlock';
import ListingCard from '../components/ListingCard';
import PageContainer from '../components/PageContainer';
import { useMediaQuery } from 'react-responsive'
import PageHeader from '../components/PageHeader';


const Categories = ({ general }) => {
    const [categories, setCategories] = useState(general.categories);
    const [listings, setListings] = useState(general.listings);
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })

    useEffect(() => {
        setCategories(general.categories)
    }, [general.categories])

    useEffect(() => {
        setListings(general.listings)
    }, [general.listings])

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
            <PageHeader pageTitle="Categories" />
            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-md-12 services-wrap">
                            <div className="row justify-content-center">
                                <div className="col-md-8 heading-section text-center mb-5" data-aos="fade-up" data-aos-duration="1000">
                                    <span className="subheading">Categories</span>
                                    <h2 className="mb-4">All Categories</h2>
                                </div>
                            </div>
                            <div className="row g-3">
                                {
                                    featuredCategories.map((cat, key) => (<CategoryBlock key={key} category={cat} /> ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 heading-section text-center mb-5" data-aos="fade-up" data-aos-duration="1000">
                            <span className="subheading">Listings</span>
                            <h2 className="mb-4">Popular Listings</h2>
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
        </PageContainer>
    )
}

const mapStateToProps = ({ general }) => ({ general })

export default connect(mapStateToProps, null)(Categories)
