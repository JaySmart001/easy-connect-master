import React from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'

const PageHeader = ({ pageTitle, description }) => {
    return (
        <section className="page-header hero-wrap hero-wrap-2" style={{ backgroundImage: `url(${process.env.PUBLIC_URL+'/assets/images/bg_3.jpg' })`, }}>
            <div className="overlay"></div>
            <Helmet>
                <title>{pageTitle + ' | Easy Connect'}</title>
            </Helmet>
            <div className="container">
                <div className="row no-gutters slider-text align-items-center justify-content-center">
                    <div className="col-md-9 pt-5 text-center">
                        <p className="breadcrumbs">
                            <span className="mr-2">
                                <Link to="/">
                                    Home {' '}
                                    <i className="fa fa-chevron-right"></i>
                                </Link>
                            </span>
                            <span>{pageTitle} <i className="fa fa-chevron-right"></i></span>
                        </p>
                        <h1 className="mb-0 bread">{pageTitle}</h1>
                        <p className="mb-0">{description}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PageHeader
