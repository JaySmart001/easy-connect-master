import { Grid, CircularProgress, Checkbox } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import PageContainer from '../components/PageContainer'
import userApi from '../redux/api/user';
import { loginUser } from '../redux/actions/user'
import { connect } from 'react-redux'

const Login = ({ loginUser }) => {
    const history = useHistory()
    const defValue = {
        email: '',
        password: ''
    }
    const [ regForm, setRegForm ] = useState(defValue)
    const [ registering, setRegistering ] = useState(false)
    const [ error, setError ] = useState("")

    const passwordRef = useRef(null)

    const handleFormChange = ({name, value}) => {
        setRegForm({ ...regForm, [name]: value  })
    }

    const login = async () => {
        setError("")
        const { email, password} = regForm
        if(email && password ) {
            setRegistering(true)
            try{
                await loginUser(regForm)
                history.push("account")
            }
            catch (err) {
                setError(err.message)
            }
            finally{        
                setRegistering(false)
            }
        }
        else {
            setError("Both Fields are required")
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
                <title>Login | EasyConnect</title>
            </Helmet>
            <Grid container style={{ minHeight: '100vh', height: 'auto', display: 'flex', justifyContent: 'center', alignContent: 'center'}}  className="login hero-wrap header">
                <div className="overlay">
                </div>
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
                    <div className="spec-form">
                        
                        <div className="d-flex form-control">
                            <input 
                                type="email" name="email" 
                                onChange={({target}) => handleFormChange(target)}
                                value={regForm.email} 
                                className="form-control" placeholder="Email" 
                            />
                            <div className="icon"><span className="fa fa-envelope"></span></div>
                        </div>
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
                        <p className="error-text">
                            { error && error }
                        </p>
                        <div style={{ background: 'none', border: 0, padding: 0 }}>
                            <button
                                onClick={() => login()}
                                className="form-control btn btn-primary"
                            >
                                { registering ? <CircularProgress color="#fff" size={10} />  : 'Login' }
                            </button>
                        </div>
                        <p className="text-center">
                            <Link to="register">
                                Don't have an Account? Register
                            </Link>
                        </p>
                    </div>
                </Grid>
            </Grid>
        </PageContainer>
    )
}

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({ loginUser }, dispatch )
}
export default  connect(null, mapDispatchToProps)(Login)
