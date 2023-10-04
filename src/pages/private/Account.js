import { Grid, Container } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PageContainer from '../../components/PageContainer'
import PageHeader from '../../components/PageHeader';
import { logoutUser } from '../../redux/actions/user';
import { fetchListings } from '../../redux/actions/general';
import moment from 'moment'
import { useHistory } from 'react-router'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import generalApi from '../../redux/api/general'

const Account = ({ user, general, logoutUser, fetchListings }) => {
    const history = useHistory()
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })

    const [listings, setListings] = useState([])
    const [userData, setUserData] = useState(user.userData)
    const [analytics, setAnalytics] = useState([])
    const [processing, setProcessing] = useState(false);

    const [myBusinesses, setMyBusinesses] = useState([])

    const [userCount, setUserCount] = useState(0)

    useEffect(() => {
        setListings(general?.listings)
    }, [general?.listings])

    useEffect(() => {
        setMyBusinesses(listings.filter((listing) => listing.ownerId == user?.userData?.email ))
    }, [listings])

    useEffect(() => {
        setUserData(user.userData)
    }, [user])

    const fetchUserCount = async () => {
        try {
            setProcessing(true)
            const res = await generalApi.fetchUsersCount();
            setUserCount(res || 0)
        } catch (err) {
            console.log(err)
        }
        finally {
            setProcessing(false)
        }
    }

    useEffect(() => {
        fetchUserCount()
    }, [])

    useEffect(() => {
        setAnalytics([
            { label: 'Users', icon: 'flaticon-employee', value: userCount || 0 },
            { label: 'Listings', icon: 'flaticon-office-building', value: general?.listings?.length || 0 },
            { label: 'Free Listings', icon: 'flaticon-maintenance', value: general?.listings?.filter(({ plan }) => (plan === 'starter' || !Boolean(plan)))?.length || 0 },
            { label: 'Paid Listings', icon: 'flaticon-exchange', value: general?.listings?.filter(({ plan }) => (plan === 'premium' || plan === 'gold'))?.length || 0 },
        ])
    }, [general, userCount])


    const logout = async () => {
        await logoutUser();
    }
    return (
        <PageContainer mainNav mainFooter processing={processing}>
            <PageHeader pageTitle="Account" />
            <Container style={{ margin: '5rem auto' }}>
                <Grid container >
                    <Grid item xs={12} md={6} container>
                        <Grid item xs={12} md={6}  style={{ padding: '.5rem' }}>
                            <a style={{ margin: '.2rem'}} onClick={() => history.push('account/add-business')} className="services dash-let account custom">
                                <div className="icon"><span className="flaticon-suitcase"></span></div>
                                <div className="text">
                                    <h2 style={{ textTransform: 'capitalize' }} >
                                            Add your business
                                        </h2>
                                    {/* <p className="list"><span>{category.listing}</span> Listings</p> */}
                                </div>
                            </a>
                        </Grid>

                        { 
                            (myBusinesses.length > 0) && 
                            <Grid style={{ padding: '.5rem' }} item xs={12} md={6}>
                                <a style={{ margin: '.2rem' }} onClick={() => history.push('account/all-business')} className="services account custom dash-let">
                                    <div className="icon"><span className="flaticon-suitcase"></span></div>
                                    <div className="text">
                                        <h2 style={{ textTransform: 'capitalize' }} >
                                            View all Businesses
                                        </h2>
                                    </div>
                                </a>
                            </Grid>
                        }
                    </Grid>

                    <Grid item xs={12} md={6} style={{ padding: '2rem 1rem' }}>
                        <p>First Name: {user.userData.firstName}</p>
                        <p>Last Name: {user.userData.lastName}</p>
                        <p>Gender: {user.userData.gender}</p>
                        <p>Phone: {user.userData.phone}</p>
                        <p>Date of Birth: {moment(user.userData.dob).format('dddd, MMM DD, YYYY')}</p>
                        <p>Registered: {moment(user.userData.registered).format('dddd, MMM DD, YYYY')}</p>
                        <p>Email: {user.userData.email}</p>
                        <button
                            onClick={() => history.push('/account/edit-account')}
                            className="btn btn-primary"
                        >
                            Edit Account
                        </button>
                        <button
                            onClick={() => logout()}
                            style={{ marginLeft: '1rem' }}
                            className="btn btn-primary"
                        >
                            Logout
                        </button>
                    </Grid>

                </Grid>

                {
                    Boolean(userData?.admin) &&
                    <Grid container spacing={3} style={{ marginTop: '3rem' }}>
                        <Grid item xs={12}><h4 className="pageTitle">Admin Dashboard</h4></Grid>

                        {
                            analytics.map((analytic, key) => (
                                <Grid xs={12} md={6} lg={3} key={key} container justifyContent="center" style={{ padding: '.5rem' }} alignItems="center">
                                    <Link to="#" className="services dash-let account">
                                        <div className="icon mt-1"><span className={analytic.icon}></span></div>
                                        <div className="text">
                                            <h2 style={{ textTransform: 'capitalize' }} className="category-name" >{analytic.label}</h2>
                                            <p className=" listing-name"><span>{analytic.value}</span> </p>
                                        </div>
                                    </Link>
                                </Grid>
                            ))
                        }
                    </Grid>
                }
            </Container>
        </PageContainer>
    )
}
const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutUser, fetchListings }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
