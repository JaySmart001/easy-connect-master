import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import CategoryBlock from '../components/CategoryBlock';
import ListingCard from '../components/ListingCard';
import PageContainer from '../components/PageContainer';
import { states } from '../utils/utils'
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router-dom';

const Home = ({ general }) => {
    const history = useHistory()
    const [categories, setCategories] = useState(general.categories);
    const [listings, setListings] = useState(general.listings);
    const [processing, setProcessing] = useState(true);
    const [bg, setBg] = useState('bg1.jpg');
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const [ searchForm, setSearchForm ] = useState({
        location: '',
        category: ''
    })
    
    useEffect(() => {
        setCategories(general.categories)
    }, [general.categories])
    
    useEffect(() => {
        setListings(general.listings)
    }, [general.listings])

    useEffect(() => {
        if(listings?.length > 0) setProcessing(false)
    }, [listings])

    useEffect(() => {
        getFeatureCategories()
    }, [categories])

    const getFeatureCategories = () => {
        const cats = categories.map(({icon, name}, key) => ({ icon, name, listing: listings.filter(({businessCategory}) => (businessCategory === name)).length })).sort((a, b) => (a.listing > b.listing) ? -1 : 1 )
        setFeaturedCategories(cats)
    }

    const getListIcon = (cat) => {
        return featuredCategories.find((feature) => feature.name === cat)?.icon
    }

    const search = () => {
        history.push('search', searchForm)
    }

    const setBgImage = () => {
        setTimeout(() => {
            if(bg.indexOf('4') > -1){
                setBg('bg1.jpg')
            } else {
                setBg('bg' + (parseInt(bg.split('g')[1].split('.')[0]) + 1) + '.jpg')
            }
        }, 5000)
    }

    useEffect(() => {
        setBgImage()
    }, [bg])

    return (
        <PageContainer mainNav mainFooter processing={processing}>
            <section className="hero-wrap header" style={{ transition: 'ease-out 0.2s', backgroundImage: `url(${ process.env.PUBLIC_URL + '/assets/images/' + bg })` }}>
                <div className="overlay"></div>

                <div className="container">
                    <div className="row no-gutters slider-text align-items-center justify-content-center">
                        <div className="col-lg-8 text-center pb-5">
                            <div className="row justify-content-center">
                                <div className="col-lg-9">
                                    <h1 className="">Explore Businesses In Your City</h1>
                                    <p>Find great businesses around you.</p>
                                </div> 
                            </div>

                            <form action="#" className="search-property-1 mt-md-5">
                                <div className="row g-0">
                                    <div className="col-md d-flex">
                                        <div className="form-group p-3">
                                            <div className="form-field">
                                                <div className="select-wrap">
                                                    <div className="icon"><span className="fa fa-chevron-down"></span></div>
                                                    <select value={searchForm.category} onChange={({ target }) => setSearchForm({ ...searchForm, category: target.value })} style={{textTransform: 'capitalize'}} className="form-control">
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
                                                <select value={searchForm.location} onChange={({ target }) => setSearchForm({ ...searchForm, location: target.value })} style={{textTransform: 'capitalize'}} className="form-control">
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
                                                <a onClick={() => search()} className="btn btn-primary d-block w-100 d-flex align-items-center justify-content-center py-3"><span><i className="ion-ios-search"></i> Search</span></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section ftco-no-pt ftco-no-pb bg-light">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-md-12 services-wrap">
                            <div className="row g-3">
                                {
                                    featuredCategories.map((cat, key) => ( isPhone ? key < 6 && <CategoryBlock key={key} category={cat} />
                                        : key < 12 && <CategoryBlock key={key} category={cat} /> ))
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
                            <span className="subheading">Our Listing</span>
                            <h2 className="mb-4">Popular Listing</h2>
                        </div>
                    </div>
                    <div className="row">
                        {
                            listings
                            .map((listing, key) => (
                                <div 
                                    className="col-md-6 col-12 d-flex align-items-stretch"
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

            {/* <section class="ftco-section testimony-section bg-light">
                <div class="container-xl">
                    <div class="row justify-content-center pb-4">
                        <div class="col-md-7 text-center heading-section" data-aos="fade-up" data-aos-duration="1000">
                            <span class="subheading">Testimonial</span>
                            <h2 class="mb-3">Happy People</h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                            <div class="carousel-testimony">
                                <div class="item">
                                    <div class="testimony-wrap">
                                        <div class="icon d-flex align-items-center justify-content-center"><span
                                                class="fa fa-quote-left"></span></div>
                                        <div class="text">
                                            <p class="mb-4 msg">Far far away, behind the word mountains, far from the countries
                                                Vokalia and Consonantia, there live the blind texts.</p>
                                            <div class="d-flex align-items-center">
                                                <div class="user-img" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + 'images/person_1.jpg'})` }}></div>
                                                <div class="pl-3 tx">
                                                    <p class="name">Roger Scott</p>
                                                    <span class="position">Marketing Manager</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="testimony-wrap">
                                        <div class="icon d-flex align-items-center justify-content-center"><span
                                                class="fa fa-quote-left"></span></div>
                                        <div class="text">
                                            <p class="mb-4 msg">Far far away, behind the word mountains, far from the countries
                                                Vokalia and Consonantia, there live the blind texts.</p>
                                            <div class="d-flex align-items-center">
                                                <div class="user-img" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + 'images/person_1.jpg'})` }}></div>
                                                <div class="pl-3 tx">
                                                    <p class="name">Roger Scott</p>
                                                    <span class="position">Marketing Manager</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="testimony-wrap">
                                        <div class="icon d-flex align-items-center justify-content-center"><span
                                                class="fa fa-quote-left"></span></div>
                                        <div class="text">
                                            <p class="mb-4 msg">Far far away, behind the word mountains, far from the countries
                                                Vokalia and Consonantia, there live the blind texts.</p>
                                            <div class="d-flex align-items-center">
                                                <div class="user-img" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + 'images/person_1.jpg'})` }}></div>
                                                <div class="pl-3 tx">
                                                    <p class="name">Roger Scott</p>
                                                    <span class="position">Marketing Manager</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="testimony-wrap">
                                        <div class="icon d-flex align-items-center justify-content-center"><span
                                                class="fa fa-quote-left"></span></div>
                                        <div class="text">
                                            <p class="mb-4 msg">Far far away, behind the word mountains, far from the countries
                                                Vokalia and Consonantia, there live the blind texts.</p>
                                            <div class="d-flex align-items-center">
                                                <div class="user-img" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + 'images/person_1.jpg'})` }}></div>
                                                <div class="pl-3 tx">
                                                    <p class="name">Roger Scott</p>
                                                    <span class="position">Marketing Manager</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="testimony-wrap">
                                        <div class="icon d-flex align-items-center justify-content-center"><span
                                                class="fa fa-quote-left"></span></div>
                                        <div class="text">
                                            <p class="mb-4 msg">Far far away, behind the word mountains, far from the countries
                                                Vokalia and Consonantia, there live the blind texts.</p>
                                            <div class="d-flex align-items-center">
                                                <div class="user-img" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + 'images/person_1.jpg'})` }}></div>
                                                <div class="pl-3 tx">
                                                    <p class="name">Roger Scott</p>
                                                    <span class="position">Marketing Manager</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        
         */}
        </PageContainer>
    )
}

const mapStateToProps = ({ general }) => ({ general })

export default connect(mapStateToProps, null)(Home)
