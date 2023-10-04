import React, { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import PageContainer from '../components/PageContainer'
import CountUp from 'react-countup'
import { connect } from 'react-redux'

const About = ({ general }) => {
    const [ listings, setListings ] = useState(0)

    useEffect(() => {
        setListings(general.listings.length)
    }, [general.listings])

    return (
        <PageContainer mainNav mainFooter>
            <PageHeader pageTitle="About Us" />

                
            <section className="ftco-section ftco-about-section ftco-no-pb">
                <div className="container-xl">
                    <div className="row g-xl-5">
                        <div className="col-md-5 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="100"
                            data-aos-duration="1000">
                            <div className="img w-100" style={{ backgroundImage:  `url(${process.env.PUBLIC_URL+'/assets/images/baker.jpg'})`}}></div>
                        </div>
                        <div className="col-md-7 py-5 heading-section" data-aos="fade-up" data-aos-delay="200"
                            data-aos-duration="1000">
                            <div className="py-md-5">
                                <span className="subheading">Welcome to Easy Connect</span>
                                <h2 className="mb-4">Easy Connect Business Directory &amp; Listing</h2>
                                <p>
                                    Easy Connect is a market place where you can find, connect and contact business and vendors of your need, within and outside Nigeria and also help business owners to expand, gain more visibility and reach more customers/clients in and out of their place of business.
                                </p>
                                <p></p>
                                <div className="row py-5 g-2">
                                    <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
                                        <div className="counter-wrap" data-aos="fade-up" data-aos-duration="1000">
                                            <div className="text">
                                                <span className="d-block number gradient-text">
                                                    <CountUp end={5} duration={3} />
                                                </span>
                                                <p>Years of Experience</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
                                        <div className="counter-wrap" data-aos="fade-up" data-aos-delay="100"
                                            data-aos-duration="1000">
                                            <div className="text">
                                                <span className="d-block number gradient-text">
                                                    <CountUp end={listings} duration={3} />
                                                </span>
                                                <p>Total Listing</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
                                        <div className="counter-wrap" data-aos="fade-up" data-aos-delay="200"
                                            data-aos-duration="1000">
                                            <div className="text">
                                                <span className="d-block number gradient-text">
                                                    <CountUp end={5} duration={3} />
                                                </span>
                                                <p>Company Staff</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
                                        <div className="counter-wrap" data-aos="fade-up" data-aos-delay="300"
                                            data-aos-duration="1000">
                                            <div className="text">
                                                <span className="d-block number gradient-text">
                                                    <CountUp end={100} duration={3} />K+
                                                </span>
                                                <p>Happy People</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </PageContainer>
    )
}

const mapStateToProps = ({ general }) => ({ general })

export default connect(mapStateToProps, null)(About)
