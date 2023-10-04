import { Grid, Stepper, Step, StepLabel, Button, Typography, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PageContainer from '../../components/PageContainer'
import PageHeader from '../../components/PageHeader';
import generalApi from '../../redux/api/general';
import { fetchListings } from '../../redux/actions/general';
import { Link, useHistory } from 'react-router-dom'
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { Delete, Edit } from '@material-ui/icons';
import { states } from '../../utils/utils'

import { useMediaQuery } from 'react-responsive'

const EditBusiness = ({ general, user, fetchListings, ...props}) => {
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const history = useHistory()
    if(!props.location?.state?.hasOwnProperty('business')) {
        window.location.href = '/'
    }
    const [ business, setBusiness ] = useState(props.location?.state?.business)
    const [show, setShow ] = useState(false)

    const [categories, setCategories] = useState(general.categories);
    const [userData, setUserData] = useState(user?.userData);
    const [ imageToUpload, setImageToUpload ] = useState(0)
    const [ idToUpload, setIDToUpload ] = useState('')
    const [ businessID, setBusinessID ] = useState(business?.id)
    const imageUpload = useRef(null)
    const idUpload = useRef(null)
    const defValue = {
        ownerId: user.userData.email,
        businessName: business?.businessName || '',
        businessPhone: business?.businessPhone || '',
        businessInfo: business?.businessInfo || '',
        businessEmail: business?.businessEmail || '',
        businessAddress: business?.businessAddress || '',
        businessCategory: business?.businessCategory || '',
        businessSpecialty: business?.businessSpecialty || '',
        businessLocation: business?.businessLocation || '',
        businessImages: [ ...business?.businessImages, ...new Array(5 - business?.businessImages?.length).fill('', 0)] || [ ...new Array(5).fill('', 0)],
        bvn: business?.bvn || '',
        guarantorId: business?.guarantorId || '',
        guarantorAddress: business?.guarantorAddress || '',
        guarantorPhone: business?.guarantorPhone || '',
        nationalId: business?.nationalId || ''
    }
    const [ businessRegForm, setBusinessRegForm ] = useState({ ...defValue})
    const [ submitting, setSubmitting ] = useState(null)

    const [ error, setError ] = useState("")
    const [ errorMore, setErrorMore ] = useState("")
    const [ planError, setPlanError ] = useState("")
    
    const handleFormChange = ({name, value}) => {
        setBusinessRegForm({ ...businessRegForm, [name]: value  })
    }

    useEffect(() => {
        if( props.location?.state?.hasOwnProperty('business')) {
            setBusiness(props.location?.state?.business) 
            setBusinessID(props.location?.state?.business.id)
        } 
        else { 
            history.push('/')
            setBusiness(null)
            setBusinessID('')

        }
    }, [props.location])

    useEffect(() => {
        const buz = general.listings.find((listing) => (business?.id === listing?.id))
        setBusiness(buz)
        setBusinessID(business?.id)
    }, [general?.listings])


    useEffect(() => {
        setUserData(user?.userData)
    }, [user?.userData])

    const handleUpload = ({ files }) => {
        if(files.length > 0) {
            var newImages = [ ...businessRegForm.businessImages ]
            newImages[imageToUpload] = files[0]

            handleFormChange({ name: 'businessImages', value: newImages})
        }
    }

    const handleIDUpload = ({ files }) => {
        if(files.length > 0 && idToUpload) {
            handleFormChange({ name: idToUpload, value: files[0]})
        }
    }


    const checkDisabled = (step) => {
        switch(step) {
            case 1: 
                return (
                    !businessRegForm.businessName ||
                    !businessRegForm.businessPhone ||
                    !businessRegForm.businessEmail ||
                    !businessRegForm.businessInfo ||
                    !businessRegForm.businessAddress ||
                    !businessRegForm.businessCategory ||
                    !businessRegForm.businessSpecialty ||
                    !businessRegForm.businessLocation ||
                    businessRegForm.businessImages.length === 0 ||
                    submitting === 1
                ) ? true : false
            case 3: 
                return (
                    businessRegForm.bvn ||
                    businessRegForm.nationalId ||
                    businessRegForm.guarantorAddress ||
                    businessRegForm.guarantorId ||
                    businessRegForm.guarantorPhone ||
                    (submitting !== 3)
                ) ? false : true
            default:
                break
        }
    }

    useEffect(() => {
        setCategories(general.categories)
    }, [general.categories])

    const submit = async () => {
        setSubmitting(1)
        try {
            await generalApi.updateBusiness(businessID, businessRegForm)
            setShow(true)
            await fetchListings();
        }
        catch(err) {
            setError(err.message || "An error Occurred, please try again")
        }
        finally {
            setSubmitting(null)
        }
    }
 
    const config = {
        public_key: 'FLWPUBK-ed1b35bf35d148980b1e66045cd4461b-X',
        tx_ref: Math.floor(Math.random() * Date.now()),
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: userData.email,
          phonenumber: userData.phone,
          name: `${userData.lastName} ${userData.firstName}`,
        },
        customizations: {
          title: 'Easy Connect',
          description: 'Payment',
        },
    };


    const fwConfig = {
        ...config,
        callback: (response) => {
            updatePlan(config.tx_ref, response.amount)
            closePaymentModal()
        },
        onClose: () => {},
    };

    const updatePlan = async (ref = "", amount = 0) => {
        setPlanError("")
        setSubmitting(2);
        try {
            await generalApi.paid(businessID, ref, amount)
            await fetchListings();
            setShow(true)
        } 
        catch(err) {
            setPlanError(err.message || "An error Occurred, please try again")
        }
        finally {
            setSubmitting(null)
        }
    }

    const updateGuarantorRecord = async () => {
        setErrorMore("")
        try {
            setSubmitting(3);
            const { bvn, guarantorId, guarantorAddress, guarantorPhone, nationalId } = businessRegForm
            await generalApi.updateGuarantorInfo(businessID, { bvn, guarantorId, guarantorAddress, guarantorPhone, nationalId })
            await fetchListings();
            setShow(true)
        } 
        catch(err) {
            setErrorMore(err.message || "An error Occurred, please try again")
        }
        finally {
            setSubmitting(null)
        }
    }

    const navigate = () => {
        fetchListings();
        history.push('/account/all-business')
    }

    const deleteImage = (key) => {
        var newImages = [ ...businessRegForm.businessImages ]
        newImages[key] = ''

        handleFormChange({ name: 'businessImages', value: newImages})
    }


    // console.log(business)
    

    return (
        <PageContainer mainNav mainFooter>
            <Helmet>
                <title>Add Your Business | EasyConnect</title>
            </Helmet>
            <PageHeader pageTitle="Edit Business" />

            <section className="ftco-section bg-light">
                <div className="container">
                    <Typography style={{ textAlign: 'center', margin: '1rem 0 0' }} variant="h4">
                        Edit Business Information
                    </Typography>
                    <Typography style={{ textAlign: 'center', margin: '1rem 0 0' }} variant="body1">
                        All fields are required
                    </Typography>
                    <Grid container style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                        
                        <Grid item xs={12}>
                            <div className="spec-form row">
                                
                                <div className="form-group col-12 col-md-6">
                                    <label>Business Name:</label>
                                    <div className="d-flex form-control">
                                        <input 
                                            type="text" name="businessName" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.businessName} 
                                            className="form-control" placeholder="Enter business name" 
                                        />
                                        <div className="icon"><span className="fa fa-user"></span></div>
                                    </div>
                                </div>
                                
                                <div className="form-group col-12 col-md-6">
                                    <label>Business Category:</label>
                                    <div className="d-flex form-control textarea">
                                        <select 
                                            name="businessCategory" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.businessCategory} 
                                            className="form-control"
                                            style={{ textTransform: 'capitalize' }}
                                        >
                                            <option value="" defaultValue>Select business category</option>
                                            {
                                                categories.map(({ name }, key) => (
                                                    <option key={key} style={{textTransform: 'capitalize'}} value={name}>
                                                        {name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                        <div className="icon"><span className="fa fa-bars"></span></div>
                                    </div>
                                </div>

                                <div className="form-group col-12 col-md-6">
                                    <label>Business Specialty:</label>
                                    <div className="d-flex form-control textarea">
                                        <input 
                                            type="text" name="businessSpecialty" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.businessSpecialty} 
                                            className="form-control" placeholder="Enter business specialty" 
                                        />
                                        <div className="icon"><span className="fa fa-bookmark"></span></div>
                                    </div>
                                </div>
                                

                                <div className="form-group col-12 col-md-6">
                                    <label>Business Information:</label>
                                    <div className="d-flex form-control textarea">
                                        <textarea 
                                            type="text" name="businessInfo" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.businessInfo} 
                                            className="form-control" placeholder="Enter business information" 
                                        />
                                        <div className="icon"><span className="fa fa-info-circle"></span></div>
                                    </div>
                                </div>

                                <div className="form-group col-12 col-md-6">
                                    <label>Business Email:</label>
                                    <div className="d-flex form-control">
                                        <input 
                                            type="email" name="businessEmail" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.businessEmail} 
                                            className="form-control" placeholder="Enter business email" 
                                        />
                                        <div className="icon"><span className="fa fa-envelope"></span></div>
                                    </div>
                                </div>
                                
                                <div className="form-group col-12 col-md-6">
                                    <label>Business Phone:</label>
                                    <div className="d-flex form-control">
                                        <input 
                                            type="text" name="businessPhone" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.businessPhone} 
                                            className="form-control" placeholder="Enter business phone" 
                                        />
                                        <div className="icon"><span className="fa fa-phone"></span></div>
                                    </div>
                                </div>

                                <div className="form-group col-12 col-md-6">
                                    <label>Business Address:</label>
                                    <div className="d-flex form-control textarea">
                                        <textarea 
                                            type="text" name="businessAddress" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.businessAddress} 
                                            className="form-control" placeholder="Enter business address" 
                                        />
                                        <div className="icon"><span className="fa fa-map-marker"></span></div>
                                    </div>
                                </div>

                                <div className="form-group col-12 col-md-6">
                                    <label>Business Location:</label>
                                    <div className="d-flex form-control textarea">
                                        <select value={businessRegForm.businessLocation} name="businessLocation" 
                                            onChange={({target}) => handleFormChange(target)}
                                            style={{textTransform: 'capitalize'}} className="form-control">
                                            <option value="">Select a location</option>
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
                        </Grid>
                    
                        <Grid item sm={12} xs={12}>

                            <Typography style={{ textAlign: 'center', margin: '1rem 0 0' }} variant="body1">
                                At least one image is required
                            </Typography>
                            <input hidden onChange={({target}) => handleUpload(target)} ref={imageUpload} type="file" accept="image/*" />


                            <div className="spec-form">
                                <Grid container>
                                    {
                                        businessRegForm.businessImages.map((val, key) => (
                                            <Grid item xs={12} md={4} key={key}>
                                                <div 
                                                    className="text-center d-flex align-items-center images"
                                                >
                                                    <p className="services">
                                                        <a onClick={() => { setImageToUpload(key); imageUpload.current.click()}}>
                                                            { 
                                                                !val ? 
                                                                <><div className="icon"><span className="fa fa-camera"></span></div>
                                                                <div className="text">
                                                                    <h2>Add Business Image</h2>
                                                                </div></>
                                                                :
                                                                Boolean(val?.hasOwnProperty('file')) ? <img src={val.file} /> : <img src={URL.createObjectURL(val)} />
                                                            }
                                                        </a>
                                                        { val !== '' && (businessRegForm.businessImages.filter(img => img !== '').length > 1) && <Delete className="image-delete-btn" onClick={()=>deleteImage(key)} /> }
                                                    </p>
                                                </div>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                                <p className="error-text">
                                    { error && error }
                                </p>
                                <div style={{ background: 'none', border: 0, padding: 0 }}>
                                    <button
                                        onClick={() => submit()}
                                        className="form-control btn btn-primary"
                                        disabled={checkDisabled(1)}
                                    >
                                        { submitting === 1 ? <CircularProgress size={20} color="inherit" /> :'Update'}
                                    </button>
                                </div>
                            </div>
                        </Grid>
                        <>
                            <div>
                                <Typography style={{ textAlign: 'center', margin: '1rem 0 0' }} variant="h4">
                                    Upgrade Plan
                                </Typography>
                                <Typography style={{ textAlign: 'center', margin: '1rem 0 0', textTransform: 'capitalize' }} variant="body1">
                                    Current Plan: {`${business?.plan} Plan` || 'Starter Plan'} <br/>
                                    { business?.paid && `Last payment: ${moment(business?.paid).format('DD MMMM, YYYY')}`}
                                </Typography>
                            </div>
                            <Grid item xs={12} sm={12}>
                                <Grid container style={{ marginTop: '2rem' }} className="pricing-container">
                                    <Grid item xs={12} md={4}>
                                        <div className="card pricing">
                                            <h3>Starter Plan</h3>
                                            <h5>FREE</h5>
                                            <p>Free Account</p>
                                            <p>Search List</p>
                                            <p>-</p>
                                            <p>-</p>
                                            <p>-</p>

                                            <Button onClick={() => updatePlan('free')} className="btn btn-primary flutter-btn">
                                                { submitting === 2 ? <CircularProgress color="inherit" size={20} /> : business?.plan === 'starter' ? 'Renew Plan' : 'Select Plan' }
                                            </Button> 
                                        </div>

                                    </Grid>
                                    
                                    <Grid item xs={12} md={4}>
                                        <div className="card pricing">
                                            <h3>Premium Plan</h3>
                                            <h5><span>&#8358;</span>10,000</h5>
                                            <p>Free Account</p>
                                            <p>Rank Top in Search</p>
                                            <p>-</p>
                                            <p>-</p>
                                            <p>-</p>
                                            <FlutterWaveButton className="btn btn-primary flutter-btn" { ...{ ...fwConfig, amount: 10000,
                                                text: business?.plan === 'premium' ? 'Renew Plan' : 'Select Plan',      
                                                }} 
                                            />

                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <div className="card pricing">
                                            <h3>Golden Plan</h3>
                                            <h5><span>&#8358;</span>30,000</h5>
                                            <p>Free Account</p>
                                            <p>Rank Top in Search</p>
                                            <p>Home Page Display/Banner Ad</p>
                                            <p>Verified Trusted Brand Badge</p>
                                            <p>Access to Referrals Services</p>
                                            <FlutterWaveButton className="btn btn-primary flutter-btn" { ...{ ...fwConfig, 
                                                text: business?.plan === 'gold' ? 'Renew Plan' : 'Select Plan',        
                                                amount: 30000 }} 
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            
                            </Grid>
                        </>


                    </Grid>
                    <>
                        <Grid item sm={12} xs={12}>
                            
                            <Typography style={{ textAlign: 'center', margin: '3rem 0 0' }} variant="h4">
                                More Information (optional)
                            </Typography>
                            <Typography style={{ textAlign: 'center', margin: '0' }} variant="body1">
                                Note: This section is not compulsory but it will likely affect your rating, our accountability for you and your level of reliability
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <input hidden onChange={({target}) => handleIDUpload(target)} ref={idUpload} type="file" accept="image/*" />

                            <div className="spec-form">
                                <div className="form-group">
                                    <label>BVN:</label>
                                    <div className="d-flex form-control">
                                        <input 
                                            type="number" name="bvn" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.bvn} 
                                            className="form-control" placeholder="Enter BVN" 
                                        />
                                        <div className="icon"><span className="fa fa-user"></span></div>
                                    </div>
                                </div>

                                <Grid container>
                                    <Grid item xs={12} md={6}>
                                        <div 
                                            className="text-center d-flex align-items-center images"
                                        >
                                            <p className="services" >
                                                <a onClick={() => { setIDToUpload('nationalId'); idUpload.current.click()}}>
                                                    {   
                                                        !businessRegForm.nationalId ? 
                                                        <>
                                                            <div className="icon"><span className="fa fa-camera"></span></div>
                                                            <div className="text">
                                                                <h2>Add National ID</h2>
                                                            </div>
                                                        </>
                                                        :
                                                        Boolean(typeof(businessRegForm.nationalId) == 'string') ? <img src={businessRegForm.nationalId} /> : <img src={URL.createObjectURL(businessRegForm.nationalId)} />
                                                    }
                                                </a>
                                                { businessRegForm.nationalId !== '' && <Delete className="image-delete-btn" onClick={() => handleFormChange({ name: 'nationalId', value: ''})} /> }
                                            </p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div 
                                            className="text-center d-flex align-items-center images"
                                        >   
                                            <p className="services">
                                                <a onClick={() => { setIDToUpload('guarantorId'); idUpload.current.click()}}>
                                                    {   
                                                        !businessRegForm.guarantorId ?
                                                        <>
                                                            <div className="icon"><span className="fa fa-camera"></span></div>
                                                            <div className="text">
                                                                <h2>Add Guarantor ID</h2>
                                                            </div>
                                                        </>
                                                        :
                                                        Boolean(typeof(businessRegForm.guarantorId) == 'string') ? <img src={businessRegForm.guarantorId} /> : <img src={URL.createObjectURL(businessRegForm.guarantorId)} />
                                                    }
                                                </a>
                                                { businessRegForm.guarantorId !== '' && <Delete className="image-delete-btn" onClick={() => handleFormChange({ name: 'guarantorId', value: ''})} /> }
                                            </p>
                                        </div>
                                    </Grid>
                                </Grid>

                                <div className="form-group">
                                    <label>Guarantor Phone:</label>
                                    <div className="d-flex form-control">
                                        <input 
                                            type="text" name="guarantorPhone" 
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.guarantorPhone} 
                                            className="form-control" placeholder="Enter Guarantor Phone" 
                                        />
                                        <div className="icon"><span className="fa fa-user"></span></div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Guarantor Address:</label>
                                    <div className="d-flex form-control textarea">
                                        <textarea 
                                            type="text" name="guarantorAddress" 
                                            rows={3}
                                            onChange={({target}) => handleFormChange(target)}
                                            value={businessRegForm.guarantorAddress} 
                                            className="form-control" placeholder="Enter Guarantor Address" 
                                        ></textarea>
                                        <div className="icon"><span className="fa fa-user"></span></div>
                                    </div>
                                </div>

                                <p className="error-text">
                                    { errorMore && errorMore }
                                </p>
                                <div style={{ background: 'none', border: 0, padding: 0 }}>
                                    <button
                                        onClick={() => updateGuarantorRecord()}
                                        className="form-control btn btn-primary"
                                        disabled={checkDisabled(3)}
                                    >
                                        { submitting === 3 ? <CircularProgress color="#fff" size={10} />  : 'Update More Information' }
                                    </button>
                                </div>
                            </div>
                        </Grid>
                    </>
                </div>
            </section>

            <Dialog open={show}>
                <DialogContent style={{ padding: '2rem' }}>
                    <Typography align="center" variant="h5" style={{ fontWeight: '900' }}>Successful</Typography>
                    <Typography align="center" variant="body1" style={{ margin: '.5rem 0' }}>Update was successful</Typography>
                    <DialogActions>
                        <button className="btn btn-outline btn-primary" onClick={() => setShow(false)}>Close</button>
                        <button className="btn btn-primary" onClick={() => navigate()}>View Business</button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </PageContainer>
    )
}


const mapStateToProps = ({ general, user }) => ({ general, user })
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({fetchListings}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditBusiness)