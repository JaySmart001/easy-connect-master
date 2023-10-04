import { Button, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PageContainer from '../../components/PageContainer'
import PageHeader from '../../components/PageHeader';
import { fetchListings } from '../../redux/actions/general';
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { Edit } from '@material-ui/icons';
import { useHistory } from 'react-router'

import { useMediaQuery } from 'react-responsive'
const AllBusinesses = ({ general, user, fetchListings }) => {
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const history = useHistory();
    const [myBusinesses, setMyBusinesses] = useState([])
    const [listings, setListings] = useState([])
    useEffect(() => {
        fetchListings()
    }, [])

    useEffect(() => {
        setMyBusinesses(listings.filter((listing) => listing.ownerId == user?.userData?.email ))
    }, [listings])

    
    useEffect(() => {
        setListings(general?.listings)
    }, [general?.listings])

    const editBusiness = (business) => {
        history.push('/account/edit-business', { business })
    }


    return (
        <PageContainer mainNav mainFooter>
            <Helmet>
                <title>Add Your Business | EasyConnect</title>
            </Helmet>
            <PageHeader pageTitle="All My Businesses" />

            <section className="ftco-section bg-light">
                <div className="container">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell width="70px">SN</TableCell>
                                <TableCell width="100px">Image</TableCell>
                                <TableCell >Name</TableCell>
                                { !isPhone && <TableCell>Added</TableCell>}
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { 
                                myBusinesses.map((business, key) => (
                                    <TableRow key={key}>
                                        <TableCell>{key + 1}</TableCell>
                                        <TableCell ><img src={business.businessImages[0]?.file} style={{width: "50px", objectFit: 'cover', height: "50px"  }} /></TableCell>
                                        <TableCell>{business.businessName}</TableCell>
                                        { !isPhone && <TableCell>{moment(business.created).format('DD MMMM, YYYY')}</TableCell> }
                                        <TableCell>
                                            <Button onClick={() => editBusiness(business)} variant="outlined" startIcon={<Edit />}>
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </section>
        </PageContainer>
    )
}


const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({fetchListings}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AllBusinesses)