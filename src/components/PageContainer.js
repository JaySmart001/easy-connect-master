import React from 'react'
import Header from './Header'
import Footer from './Footer';
import Loader from './Loader';

function PageContainer({ children, mainNav, mainFooter, subscribe, testimonies, processing }) {
    return (
        <>
            { processing && <Loader />}
            { mainNav && <Header mainNav /> }

            {children}

            { mainFooter && <Footer subscribe={subscribe} testimonies={testimonies} /> }
        </>
    )
}

export default PageContainer
