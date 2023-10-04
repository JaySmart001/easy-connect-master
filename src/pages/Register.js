import { Grid, CircularProgress, Checkbox } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory } from 'react-router-dom'
import RegisterImage from '../assets/images/bg1.jpg'
import PageContainer from '../components/PageContainer'
import { PRIMARY_COLOR } from '../styles/colors'
import moment from 'moment'
import userApi from '../redux/api/user'
import AlertDialog from '../components/AlertDialog'

const Register = () => {
    const history = useHistory()
    const defValue = {
        email: '', firstName: '', lastName: '', phone: '',
        gender: '', dob: '', terms: false,
        password: '', conPassword: ''
    }
    const [ regForm, setRegForm ] = useState(defValue)
    const [ registering, setRegistering ] = useState(false)
    const [ error, setError ] = useState("")
    const [ message, setMessage ] = useState("")
    const [ openDialog, setOpenDialog ] = useState(false)

    const dateRef = useRef(null)
    const passwordRef = useRef(null)
    const conPasswordRef = useRef(null)

    const handleFormChange = ({name, value}) => {
        setRegForm({ ...regForm, [name]: value  })
    }

    const register = async () => {
        setError("")
        const { email, firstName, lastName, phone, gender, dob, terms, password, conPassword } = regForm
        if(email && firstName && lastName && phone && gender && dob && terms && password && password === conPassword ) {
            setRegistering(true)
            try{
                await userApi.registerUser(regForm)
                setMessage("Registration Successful, Kindly visit your mailbox to verify you email address and then login")
                setOpenDialog(true)
            }
            catch (err) {
                setError(err.message)
            }
            finally{        
                setRegistering(false)
            }
        }
        else if( password !== conPassword ) {
            setError("Password Fields must match")
        }
        else {
            setError("All Fields are required")
        }

    }

    const handlePasswordSee = (ref) => {
        if(ref.current.type === 'password'){
            ref.current.type = 'text';
        }
        else {
            ref.current.type = 'password'
        }
        document.getElementById(ref.current.name).classList.toggle('fa-eye')
        document.getElementById(ref.current.name).classList.toggle('fa-eye-slash')
    }

    return (
        <PageContainer mainFooter>
            <Helmet>
                <title>Register | EasyConnect</title>
            </Helmet>
            <Grid container style={{ minHeight: '100vh', height: 'auto', display: 'flex', justifyContent: 'center', alignContent: 'center'}}  className="register hero-wrap header">
                <div className="overlay">
                </div>
                {/* <div className="overlay">
                </div> */}
                <Grid item sm={12} style={{  margin: '50px 0 20px'  }}>
                    <Link className="navbar-brand d-flex align-items-center justify-content-center" to="/">
                        <span className="flaticon flaticon-compass"></span>
                        <span className="" style={{ marginLeft: '10px' }}>
                            EasyConnect 
                            <small style={{ marginTop: '5px', }}>Business Directory and Listing</small>
                        </span>
                    </Link>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                    <div className="spec-form reg-form">
                        <label>First Name:</label>
                        <div className="d-flex form-control">
                            <input 
                                type="text" name="firstName" 
                                onChange={({target}) => handleFormChange(target)}
                                value={regForm.firstName} 
                                className="form-control" placeholder="First Name"
                                autocomplete="off"
                            />
                            <div className="icon"><span className="fa fa-user"></span></div>
                        </div>
                        
                        <label>Last Name:</label>
                        <div className="d-flex form-control">
                            <input 
                                type="text" name="lastName" 
                                onChange={({target}) => handleFormChange(target)}
                                value={regForm.lastName} 
                                className="form-control" placeholder="Last Name" 
                            />
                            <div className="icon"><span className="fa fa-user"></span></div>
                        </div>
                        
                        <label>Email:</label>
                        <div className="d-flex form-control">
                            <input 
                                type="email" name="email" 
                                onChange={({target}) => handleFormChange(target)}
                                value={regForm.email} 
                                className="form-control" placeholder="Email" 
                            />
                            <div className="icon"><span className="fa fa-envelope"></span></div>
                        </div>
                        
                        <label>Phone Number:</label>
                        <div className="d-flex form-control">
                            <input 
                                type="tel" name="phone" 
                                onChange={({target}) => handleFormChange(target)}
                                value={regForm.phone} 
                                className="form-control" placeholder="Phone" 
                            />
                            <div className="icon"><span className="fa fa-mobile-alt"></span></div>
                        </div>
                        
                        <label>Gender:</label>
                        <div className="d-flex form-control">
                            <select 
                                type="text" name="gender" 
                                onChange={({target}) => handleFormChange(target)}
                                value={regForm.gender} 
                                className="form-control"
                            >
                                <option value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <div className="icon"><span className="fa fa-transgender"></span></div>
                        </div>
                        
                        <label>Date of Birth:</label>
                        <div className="d-flex form-control">
                            <input 
                                name="dob"
                                type="date"
                                onChange={({target}) => { handleFormChange(target) }}
                                value={regForm.dob} 
                                className="form-control" placeholder="Date of Birth" 
                            />
                        </div>
                        
                        <label>Password:</label>
                        <div className="d-flex form-control">
                            <input 
                                type="password" name="password" 
                                onChange={(e) => handleFormChange(e.target)}
                                value={regForm.password} 
                                ref={passwordRef}
                                className="form-control" placeholder="Password" 
                            />
                            <div className="icon"><span id="password" onClick={() => handlePasswordSee(passwordRef)} className="fa fa-eye"></span></div>
                        </div>
                        
                        <label>Confirm Password:</label>
                        <div className="d-flex form-control">
                            <input 
                                type="password" name="conPassword" 
                                onChange={(e) => handleFormChange(e.target)}
                                value={regForm.conPassword} 
                                ref={conPasswordRef}
                                className="form-control" placeholder="Confirm Password" 
                            />
                            <div className="icon"><span onClick={() => handlePasswordSee(conPasswordRef)} id="conPassword" className="fa fa-eye"></span></div>
                        </div>
                        
                        <div className="d-flex form-control">
                            <input type="checkbox" checked={regForm.terms} name="terms" onChange={() => handleFormChange({ name: 'terms', value: !regForm.terms })} />
                            <span for="terms" style={{ marginLeft: 10 }}>
                                I have read and agreed with the {' '}
                                <a target="_blank" href="https://easyconnect.ng/terms-and-conditions/">Terms of Use</a>
                            </span>
                        </div>
                        
                        <p className="error-text">
                            { error && error }
                        </p>
                        <div style={{ background: 'none', border: 0, padding: 0 }}>
                            <button
                                onClick={() => register()}
                                className="form-control btn btn-primary" placeholder="Confirm Password" 
                            >
                                { registering ? <CircularProgress style={{ color: '#FFF' }} size={10} />  : 'Register' }
                            </button>
                        </div>
                        <p className="text-center">
                            <Link to="login">
                                Have an Account? Login
                            </Link>
                        </p>
                    </div>
                </Grid>
            </Grid>

            <AlertDialog open={openDialog} handleClose={() => { setOpenDialog(!openDialog); history.push('login')} } message={message} />
        </PageContainer>
    )
}

export default Register
