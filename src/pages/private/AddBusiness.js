import { Grid, Stepper, Step, StepLabel, Button, Typography, CircularProgress } from '@material-ui/core'
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
import { useMediaQuery } from 'react-responsive'
import { states } from '../../utils/utils'
import { Delete } from '@material-ui/icons';

const AddBusiness = ({ general, user, fetchListings }) => {
    const [categories, setCategories] = useState(general.categories);
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const history = useHistory()
    const [userData, setUserData] = useState(user?.userData);
    const [ activeStep, setActiveStep ] = useState(0)
    const [ imageToUpload, setImageToUpload ] = useState(0)
    const [ idToUpload, setIDToUpload ] = useState('')
    const [ businessID, setBusinessID ] = useState('')
    const imageUpload = useRef(null)
    const idUpload = useRef(null)
    const defValue = {
        ownerId: user.userData.email,
        businessName: '',
        businessInfo: '',
        businessPhone: '',
        businessEmail: '',
        businessAddress: '',
        businessCategory: '',
        businessSpecialty: '',
        businessLocation: '',
        businessImages: [ ...new Array(5).fill('', 0)],
        bvn: '',
        guarantorId: '',
        guarantorAddress: '',
        guarantorPhone: '',
        nationalId: ''
    }
    const [ businessRegForm, setBusinessRegForm ] = useState({ ...defValue})
    const [ submitting, setSubmitting ] = useState(false)
    const [ error, setError ] = useState("")
    
    const handleFormChange = ({name, value}) => {
        setBusinessRegForm({ ...businessRegForm, [name]: value  })
    }

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
                    !businessRegForm.businessInfo ||
                    !businessRegForm.businessEmail ||
                    !businessRegForm.businessAddress ||
                    !businessRegForm.businessCategory ||
                    !businessRegForm.businessSpecialty ||
                    !businessRegForm.businessLocation
                ) ? true : false
            default:
                break
        }
    }

    useEffect(() => {
        setCategories(general.categories)
    }, [general.categories])

    const submit = async () => {
        setSubmitting(true)
        await generalApi.addBusiness(businessRegForm).then((id) => { setBusinessID(id); setActiveStep(2)}).finally(() => {
            setSubmitting(false)
        })
    }
 
    const config = {
        public_key: 'FLWPUBK-ed1b35bf35d148980b1e66045cd4461b-X',
        tx_ref: Math.floor(Math.random() * Date.now()),
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: userData.email,
          phone_number: userData.phone,
          name: `${userData.lastName} ${userData.firstName}`,
        },
        customizations: {
          title: 'Easy Connect',
          description: 'Payment',
        },
    };


    const fwConfig = {
        ...config,
        text: 'Pay now',
        callback: (response) => {
            updatePlan(config.tx_ref, response.amount)
            closePaymentModal()
        },
        onClose: () => {},
    };

    const updatePlan = async (ref = "", amount = 0) => {
        setSubmitting(true)
        try {
            await generalApi.paid(businessID, ref, amount)
            if(amount === 30000) {
                setActiveStep(3)
            } else {
                navigate()
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setSubmitting(false)
        }
    }

    const updateGuarantorRecord = async (businessID, ref, amount) => {
        const { bvn, guarantorId, guarantorAddress, guarantorPhone, nationalId } = businessRegForm
        await generalApi.updateGuarantorInfo(businessID, { bvn, guarantorId, guarantorAddress, guarantorPhone, nationalId })
        navigate()
    }

    const navigate = () => {
        fetchListings();
        history.push('/account')
    }

    const deleteImage = (key) => {
        var newImages = [ ...businessRegForm.businessImages ]
        newImages[key] = ''

        handleFormChange({ name: 'businessImages', value: newImages})
    }

    return (
        <PageContainer mainNav mainFooter>
            <PageHeader pageTitle="Become a seller" />

            <section className="ftco-section bg-light">
                <div className="container">
                    <Stepper activeStep={activeStep} style={{ margin: '-2rem 0 1.5rem' }}>
                        <Step>
                            <StepLabel>{ !isPhone && 'Section A' }</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>{ !isPhone && 'Section B' }</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>{ !isPhone && 'Section C' }</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>{ !isPhone && 'Section D' }</StepLabel>
                        </Step>
                    </Stepper>

                    <Grid container style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                    

                        { (activeStep == 0) && 
                            <Grid item md={8} sm={12} xs={12}>
                                
                                <Typography style={{ textAlign: 'center', margin: '1rem 0 0' }} variant="h4">
                                    Business Information
                                </Typography>
                                <Typography style={{ textAlign: 'center', margin: '-.3rem 0 0' }} variant="body1">
                                    All fields are required to proceed
                                </Typography>


                                <div className="spec-form">
                                    
                                    <div className="form-group">
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
                                    
                                    <div className="form-group">
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

                                    <div className="form-group">
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


                                    <div className="form-group">
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

                                    <div className="form-group">
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
                                    
                                    <div className="form-group">
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

                                    <div className="form-group">
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


                                    <div className="form-group">
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

                                    <p className="error-text">
                                        { error && error }
                                    </p>
                                    <div style={{ background: 'none', border: 0, padding: 0 }}>
                                        <button
                                            onClick={() => setActiveStep(1)}
                                            disabled={checkDisabled(1)}
                                            className="form-control btn btn-primary"
                                        >
                                            Proceed
                                        </button>
                                    </div>
                                </div>
                            </Grid>
                        }
                        { (activeStep == 1) && 
                            <Grid item sm={12} xs={12}>
                                
                                <Typography style={{ textAlign: 'center', margin: '1rem 0 0' }} variant="h4">
                                    Business Images
                                </Typography>
                                <Typography style={{ textAlign: 'center', margin: '-.3rem 0 0' }} variant="body1">
                                    Upload at least one image, images must be less than 700kb.
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
                                                        <p className="services" >
                                                            <a onClick={() => { setImageToUpload(key); imageUpload.current.click()}}>
                                                                {
                                                                    !val ? 
                                                                    <><div className="icon"><span className="fa fa-camera"></span></div>
                                                                    <div className="text">
                                                                        <h2>Add Business Image</h2>
                                                                    </div></>
                                                                    :
                                                                    <img src={URL.createObjectURL(val)} />
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
                                            disabled={ businessRegForm.businessImages.filter((val) => typeof(val) != 'string' ).length == 0 || submitting}
                                        >
                                            { submitting ? <CircularProgress size={20} color="inherit" /> : 'Proceed' }
                                        </button>
                                    </div>
                                </div>
                            </Grid>
                        }
                        { (activeStep == 2) && 
                        <>
                            <Grid item sm={12} xs={12}>
                                
                                <Typography style={{ textAlign: 'center', margin: '1rem 0 0' }} variant="h4">
                                    Congratulations!!!
                                </Typography>
                                <Typography style={{ textAlign: 'center', margin: '0' }} variant="body1">
                                    Your business has been saved, proceed to make payment to activate your business and make it visible on our platform
                                </Typography>
                            </Grid>

                            <Grid item md={9} xs={12} sm={12}>
                                <Grid container style={{ marginTop: '2rem' }} className="pricing-container">
                                    <Grid item xs={12} md={4}>
                                        <div className="card pricing">
                                            <div>
                                                <h3>Starter Plan</h3>
                                                <h5>FREE</h5>
                                                <p>Free Account</p>
                                                <p>Search List</p>
                                                <p>-</p>
                                                <p>-</p>
                                                <p>-</p>
                                            </div>

                                            <Button onClick={() => updatePlan()} className="btn btn-primary flutter-btn">
                                                { submitting ? <CircularProgress size={20} color="inherit" /> : 'Proceed' }
                                            </Button> 
                                        </div>

                                    </Grid>
                                    
                                    <Grid item xs={12} md={4}>
                                        <div className="card pricing">
                                            <div>
                                                <h3>Premium Plan</h3>
                                                <h5><span>&#8358;</span>10,000</h5>
                                                <p>Free Account</p>
                                                <p>Rank Top in Search</p>
                                                <p>-</p>
                                                <p>-</p>
                                                <p>-</p>
                                            </div>
                                            <FlutterWaveButton className="btn btn-primary flutter-btn" { ...{ ...fwConfig, amount: 10000 }} />

                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <div className="card pricing">
                                            <div>
                                                <h3>Golden Plan</h3>
                                                <h5><span>&#8358;</span>30,000</h5>
                                                <p>Free Account</p>
                                                <p>Rank Top in Search</p>
                                                <p>Home Page Display/Banner Ad</p>
                                                <p>Verified Trusted Brand Badge</p>
                                                <p>Access to Referrals Services</p>
                                            </div>
                                            <FlutterWaveButton className="btn btn-primary flutter-btn" { ...{ ...fwConfig, amount: 30000 }} />
                                        </div>
                                    </Grid>
                                </Grid>
                            

                            </Grid>
                        </>
                        }
                        { (activeStep == 3) && 
                        <>
                            <Grid item sm={12} xs={12}>
                                
                                <Typography style={{ textAlign: 'center', margin: '1rem 0 0' }} variant="h4">
                                    More Information
                                </Typography>
                                <Typography style={{ textAlign: 'center', margin: '0' }} variant="body1">
                                    Note: This section is not compulsory but it will likely affect your rating, our accountability for you and your level of reliability
                                </Typography>
                            </Grid>

                            <Grid item md={8} xs={12} sm={12}>
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
                                                <p className="services">
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
                                                            <img src={URL.createObjectURL(businessRegForm.nationalId)} />
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
                                                            <img src={URL.createObjectURL(businessRegForm.guarantorId)} />
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
                                        { error && error }
                                    </p>
                                    <div style={{ background: 'none', border: 0, padding: 0 }}>
                                        <button
                                            onClick={() => updateGuarantorRecord()}
                                            className="form-control btn btn-primary"
                                        >
                                            { submitting ? <CircularProgress style={{ color: '#FFF' }} size={20} />  : 'Submit' }
                                        </button>
                                    </div>
                                </div>
                            </Grid>
                        </>
                        }
                    </Grid>
                </div>
            </section>
        </PageContainer>
    )
}


const mapStateToProps = ({ general, user }) => ({ general, user })
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({fetchListings}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddBusiness)