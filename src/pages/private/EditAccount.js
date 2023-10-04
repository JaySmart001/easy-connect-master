import PageContainer from '../../components/PageContainer';
import PageHeader from '../../components/PageHeader';
import { Grid, CircularProgress, Checkbox } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { updateUser } from '../../redux/actions/user'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const EditAccount = ({ updateUser, user }) => {
    const defValue = {
        firstName: '', lastName: '', phone: '',
        gender: '', dob: '', email: ''
    }
    const [ userDetails, setUserDetails ] = useState(user.userData)
    const [ updateForm, setUpdateForm ] = useState(defValue)
    const [ updating, setUpdating ] = useState(false)
    const [ error, setError ] = useState("")
    const [ successMessage, setSuccessMessage ] = useState("")

    const handleFormChange = ({name, value}) => {
        setUpdateForm({ ...updateForm, [name]: value  })
    }

    const update = async () => {
        setUpdating(true)
        setError("")
        setSuccessMessage("")
        const { firstName, lastName, phone, gender, dob, email } = updateForm
        if( firstName && lastName && phone && gender && dob && email ) {
            try{
                await updateUser(updateForm)
                setSuccessMessage("Account Updated Successfully.")
            }
            catch (err) {
                setError(err.message)
            }
            finally{        
                setUpdating(false)
            }
        }
        else {
            setError("All Fields are required")
        }

    }

    useEffect(() => {
        if(user.userData) { 
            setUserDetails(user.userData)
            setUpdateForm({
                firstName: userDetails.firstName || '', lastName: userDetails.lastName || '', phone: userDetails.phone || '',
                gender: userDetails.gender || '', dob: userDetails.dob || '', email: userDetails.email || ''
            })
        }
    }, [user])

    return (
        <PageContainer mainNav mainFooter>
            <PageHeader pageTitle="Edit Account" />
            <Grid container style={{ minHeight: '100vh', height: 'auto', display: 'flex', justifyContent: 'center', alignContent: 'center'}}  className="header">
                
                <Grid item md={4} sm={12} xs={12}>
                    <div className="spec-form">
                        <label>First Name:</label>
                        <div className="d-flex form-control">
                            <input 
                                type="text" name="firstName" 
                                onChange={({target}) => handleFormChange(target)}
                                value={updateForm.firstName} 
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
                                value={updateForm.lastName} 
                                className="form-control" placeholder="Last Name" 
                            />
                            <div className="icon"><span className="fa fa-user"></span></div>
                        </div>
                        
                        <label>Email:</label>
                        <div className="d-flex form-control">
                            <input 
                                disabled
                                type="email" name="email" 
                                onChange={({target}) => handleFormChange(target)}
                                value={userDetails.email} 
                                className="form-control" placeholder="Email" 
                            />
                            <div className="icon"><span className="fa fa-envelope"></span></div>
                        </div>
                        <small style={{ margin: '-15px auto 15px', display: 'block' }}>(cannot be changed)</small>
                        
                        <label>Phone Number:</label>
                        <div className="d-flex form-control">
                            <input 
                                type="tel" name="phone" 
                                onChange={({target}) => handleFormChange(target)}
                                value={updateForm.phone} 
                                className="form-control" placeholder="Phone" 
                            />
                            <div className="icon"><span className="fa fa-mobile-alt"></span></div>
                        </div>
                        
                        <label>Gender:</label>
                        <div className="d-flex form-control">
                            <select 
                                type="text" name="gender" 
                                onChange={({target}) => handleFormChange(target)}
                                value={updateForm.gender} 
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
                                value={updateForm.dob} 
                                className="form-control" placeholder="Date of Birth" 
                            />
                        </div>
                        
                        { successMessage }

                        <p className="error-text">
                            { error && error }
                        </p>
                        { 
                            successMessage !== '' && 
                            <p style={{ color: 'green', textAlign: 'center' }}>
                                { successMessage }
                            </p>
                        }

                        <div style={{ background: 'none', border: 0, padding: 0 }}>
                            <button
                                onClick={() => update()}
                                disabled={updating}
                                className="form-control btn btn-primary" placeholder="Confirm Password" 
                            >
                                { updating ? <CircularProgress style={{ color: '#FFF' }} size={10} />  : 'Update' }
                            </button>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </PageContainer>
    )
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateUser }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditAccount)
