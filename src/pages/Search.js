import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import CategoryBlock from '../components/CategoryBlock';
import ListingCard from '../components/ListingCard';
import PageContainer from '../components/PageContainer';
import { useMediaQuery } from 'react-responsive'
import PageHeader from '../components/PageHeader';
import { states } from '../utils/utils'

const Search = ({ general, ...props }) => {
    const [listings, setListings] = useState(general.listings);
    const [categories, setCategories] = useState(general.categories);

    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');

    const [featuredCategories, setFeaturedCategories] = useState([]);

    const [searchResults, setSearchResults] = useState([]);
    
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })

    useEffect(() => {
        if(props.location.state) {
            setKeyword(props.location.state.keyword || '')
            setLocation(props.location.state.location || '')
            setCategory(props.location.state.category || '')
        }
    }, [props.location])

    useEffect(() => {
        search();
    }, [listings, location, category, keyword])

    useEffect(() => {
        setCategories(general.categories)
    }, [general.categories])

    useEffect(() => {
        setListings(general.listings)
    }, [general.listing])

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

    const search = () => {
        const list = [ ...listings ].filter((lst) => (location ? lst.businessLocation == location : true)).filter((lst) => (category ? lst.businessCategory == category : true))
        setSearchResults(list)
    }

    return (
        <PageContainer mainNav mainFooter marginTop>
            <PageHeader pageTitle="Search" />

            <section className="ftco-section bg-light" style={{ paddingBottom: (searchResults.length > 0) ? '7em' : '0' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 mb-5 pb-md-3 heading-section">
                            <div className="text-center w-100">
                                <h2 className="mb-3">Let's Explore Your Awesome City</h2>
                            </div>
                            <form action="#" className="search-property-1 mt-md-4">
                                <div className="row g-0">
                                    <div className="col-md d-flex">
                                        <div className="form-group p-3 border-0">
                                            <div className="form-field">
                                                <div className="icon"><span className="fa fa-search"></span></div>
                                                <input value={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" className="form-control" placeholder="What are you looking for?" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md d-flex">
                                        <div className="form-group p-3">
                                            <div className="form-field">
                                                <div className="select-wrap">
                                                    <div className="icon"><span className="fa fa-chevron-down"></span></div>
                                                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{textTransform: 'capitalize'}} className="form-control">
                                                        <option value="">All Categories</option>
                                                        {
                                                            categories.map(({ name }, key) => (
                                                                <option key={key} style={{textTransform: 'capitalize'}} value={name}>
                                                                    {name}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md d-flex">
                                        <div className="form-group p-3">
                                            <div className="form-field">
                                                <div className="icon"><span className="fa fa-chevron-down"></span></div>
                                                <select value={location} onChange={({ target }) => setLocation(target.value)} style={{textTransform: 'capitalize'}} className="form-control">
                                                    <option value="">All Location</option>
                                                    {
                                                        states.map((state, key) => (
                                                            <option key={key} style={{textTransform: 'capitalize'}} value={state}>
                                                                {state}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md d-flex">
                                        <div className="form-group d-flex w-100 border-0">
                                            <div className="form-field w-100 align-items-center d-flex align-items-stretch">
                                                <a onClick={() => search()}
                                                    className="btn btn-primary d-block w-100 d-flex align-items-center justify-content-center py-3"><span><i
                                                            className="ion-ios-search"></i> Search</span></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="row">
                        {
                            searchResults.length > 0 ? searchResults.map((listing, key) => (
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
                            :
                            <h4 style={{ textAlign: 'center', margin: '-3rem auto 3rem', fontWeight: 'bold' }}>No Result Found</h4>
                        }
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
                                (key < 11) &&  
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

export default connect(mapStateToProps, null)(Search)
