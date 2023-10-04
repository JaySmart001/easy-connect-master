import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

const Footer = ({ user, general, subscribe, testimonies }) => {
    const [categories, setCategories] = useState(general.categories);
    const [listings, setListings] = useState(general.listings);
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const history = useHistory()

    const search = (category) => {
        history.push('/search', {
            location: '',
            category
        })
        window.scrollTo(0, 0);
    }

    
    useEffect(() => {
        setCategories(general.categories)
    }, [general.categories])

    useEffect(() => {
        getFeatureCategories()
    }, [categories])
    
    const getFeatureCategories = () => {
        const cats = categories.map(({icon, name}, key) => ({ icon, name, listing: listings.filter(({businessCategory}) => (businessCategory === name)).length })).sort((a, b) => (a.listing > b.listing) ? -1 : 1 )
        setFeaturedCategories(cats)
    }

    return (
        <>
            {
                testimonies &&
                <section class="ftco-section testimony-section bg-light">
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
                                                    <div class="user-img" style={{ backgroundImage: `url(${process.env.PUBLIC_URL+'/assets/images/bg_3.jpg'})` }} ></div>
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
                                                    <div class="user-img" style={{ backgroundImage: `url(${process.env.PUBLIC_URL+'/assets/images/bg_3.jpg'})` }} ></div>
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
            }
            {/* <section class="ftco-intro bg-light">
                <div class="container">
                    <div class="row g-0">
                        <div class="col-md-4 d-flex align-items-stretch">
                            <div class="img w-100" style={{ backgroundImage:  `url(${process.env.PUBLIC_URL+'/assets/images/intro.jpg'})` }} >
                            </div>
                        </div>
                        <div class="col-md-8 aside-stretch aside">
                            <div class="row py-md-4">
                                <div class="col-md-8 d-flex align-items-center ">
                                    <div class="text pt-5 pb-md-5 pb-3 pl-md-5 px-4">
                                        <div class="subheading">Special Offers</div>
                                        <h2>We Have Special Offers Every Now and Then</h2>
                                    </div>
                                </div>
                                <div class="col-md-4 d-flex align-items-center">
                                    <div class="px-4 px-md-0 pb-4 pb-md-0">
                                        <p><a href="#" class="btn btn-darken py-3 px-4">Show Special Offers</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            <footer className="ftco-footer" style={{ padding: '4rem 2rem' }}>
                <div className="container-xl">
                    <div className="row mb-5 pb-5 justify-content-between">
                        <div className="col-md-6 col-lg">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2 logo d-flex">
                                    <Link className="navbar-brand d-flex align-items-center" to="/">                        
                                        <span className="flaticon flaticon-team"></span>
                                        <span  style={{ marginLeft: '10px' }} className="">EasyConnect <small style={{ marginTop: '5px' }}>Business Directory and Listing</small></span>
                                    </Link>
                                </h2>
                                <p>
                                    {/* A small river named Duden flows by their place and supplies it with the necessary. */}
                                </p>
                                <ul className="ftco-footer-social list-unstyled mt-2">
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">Explore</h2>
                                <ul className="list-unstyled">
                                    <li><Link to="/about"><span className="fa fa-chevron-right mr-2"></span>About Us</Link></li>
                                    <li>
                                        {
                                            user.authenticated ?
                                            <Link to="/account"><span className="fa fa-chevron-right mr-2"></span>Account</Link>
                                            :
                                            <Link to="/login"><span className="fa fa-chevron-right mr-2"></span>Login</Link>
                                        }
                                    </li>
                                    <li><Link to="/listings"><span className="fa fa-chevron-right mr-2"></span>Listings</Link></li>
                                    <li><Link to="/pricing"><span className="fa fa-chevron-right mr-2"></span>Pricing</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">Quick Links</h2>
                                <ul className="list-unstyled">
                                    <li><Link to="/contact"><span className="fa fa-chevron-right mr-2"></span>Contact Us</Link></li>
                                    <li><Link to="/terms-conditions"><span className="fa fa-chevron-right mr-2"></span>Terms &amp; Conditions</Link>
                                    </li>
                                    <li><Link to="/"><span className="fa fa-chevron-right mr-2"></span>Privacy</Link></li>
                                    <li><Link to="/"><span className="fa fa-chevron-right mr-2"></span>Feedbacks</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">Categories</h2>
                                <ul className="list-unstyled">
                                    {
                                        featuredCategories.map(({ name }, key) => (
                                            key < 5 && <li key={key}><a onClick={() => search(name)} style={{ textTransform: 'capitalize', cursor: 'pointer' }}><span className="fa fa-chevron-right mr-2"></span>{name}</a></li>
                                        ))

                                    }
                                    
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">Have Link Questions?</h2>
                                <div className="block-23 mb-3">
                                    <ul>
                                        <li>
                                            <span className="icon fa fa-map marker"></span>
                                            <span className="text">
                                                203 Street, Sapele,
                                                Warri, Delta State, Nigeria.
                                            </span>
                                        </li>
                                        <li>
                                            <a href="tel:+2348141582309">
                                                <span className="icon fa fa-phone"></span>
                                                <span className="text">+234 814 158 2309</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="mailto:contact@easyconnect.ng">
                                                <span className="icon fa fa-paper-plane pr-4"></span>
                                                <span className="text">
                                                    contact@easyconnect.ng
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid px-0 py-5 bg-darken">
                    <div className="container-xl">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <p className="mb-0" style={{color: 'rgba(255,255,255,.5)', fontSize: '13px'}}>
                                    Copyright &copy; { new Date().getFullYear() + ". " }
                                    All rights reserved | Developed by {' '}
                                    <a href="https://api.whatsapp.com/send?phone=2348147385542" target="_blank" rel="nofollow noopener">Noukaan Innovations</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

const mapStateToProps = ({ user, general }) => ({ user, general })

export default connect(mapStateToProps, null)(Footer)
