import React from 'react'
import { useHistory } from 'react-router-dom'

const CategoryBlock = ({ category, ...props }) => {
    const history = useHistory()

    const search = () => {
        history.push('search', {
            location: '',
            category: category.name
        })
        window.scrollTo(0, 0);
    }


    return (
        <div 
            className="col-md-4 col-lg-2 text-center d-flex align-items-stretch" 
            data-aos="fade-up"
            data-aos-delay="100" data-aos-duration="1000"
        >
            <a href={category.link} className="services" onClick={() => search()}>
                <div className="icon"><span className={category.icon}></span></div>
                <div className="text">
                    <h2 style={{ textTransform: 'capitalize' }} className="category-name" >{category.name}</h2>
                    <p className="list listing-name"><span>{category.listing}</span> Listings</p>
                </div>
            </a>
        </div>
    )
}

export default CategoryBlock