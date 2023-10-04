import React, { useState } from 'react'
import PageContainer from '../components/PageContainer'
import PageHeader from '../components/PageHeader'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Contact = () => {
    const def = {
        name: '',
        email: '',
        subject: '',
        message: ''
    }
    const [ form, setForm ] = useState(def)
    const [ formError, setFormError ] = useState(false)
    const [ formSuccess, setFormSuccess ] = useState(false)
    const [ sending, setSending] = useState(false)

    const handleChange  = ({ name, value }) => {
        setForm({ ...form, [name]: value })
    }

    const sendMail = async () => {
        setFormSuccess(false)
        setSending(true)
        setFormError(false)
        try {
            await axios.post('https://easyconnect.ng/mail.php', form)
            setFormSuccess(true)
        }
        catch(err) {
            console.log(err)
            setFormError(true)
        }
        finally {
            setSending(false)
        }
    }

    return (
        <PageContainer mainFooter mainNav>
            <PageHeader pageTitle="Contact Us" />
            <section className="ftco-section ftco-no-pt ftco-no-pb">
                <div className="container-xl-fluid">
                    <div className="row no-gutters justify-content-center">
                        <div className="col-md-12">
                            <div className="wrapper">
                                <div className="row g-0">
                                    <div className="col-lg-6">
                                        <div className="contact-wrap w-100 p-md-5 p-4">
                                            <h3>Contact us</h3>
                                            <p className="mb-4">We're open for any suggestion or just to have a chat</p>
                                            <div className="row mb-4">
                                                <div className="col-md-4">
                                                    <div className="dbox w-100 d-flex align-items-start">
                                                        <div className="text">
                                                            <p>
                                                                <span>Address:</span>
                                                                203 Street, Sapele,
                                                                Warri, Delta State, Nigeria.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="dbox w-100 d-flex align-items-start">
                                                        <div className="text">
                                                            <p>
                                                                <span>Email:</span> 
                                                                <a href="mailto:contact@easyconnect.ng">
                                                                    contact@easyconnect.ng
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="dbox w-100 d-flex align-items-start">
                                                        <div className="text">
                                                            <p><span>Phone:</span> <a href="tel:+2348141582309">+234 814 158 2309</a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div name="contactForm" className="contactForm">
                                                <div className="row">
                                                    { 
                                                        !formSuccess ? 
                                                        <>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <input onChange={(e) => handleChange(e.target)} value={form.name} type="text" className="form-control" name="name"
                                                                        placeholder="Name" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <input onChange={(e) => handleChange(e.target)} value={form.email}  type="email" className="form-control" name="email" id="email"
                                                                        placeholder="Email" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <input onChange={(e) => handleChange(e.target)} value={form.subject}  type="text" className="form-control" name="subject" id="subject"
                                                                        placeholder="Subject" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <textarea onChange={(e) => handleChange(e.target)} value={form.message}  name="message" className="form-control" id="message" cols="30"
                                                                        rows="4" placeholder="Create a message here"></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <button disabled={sending} onClick={(e)=>sendMail()} className="btn btn-primary">
                                                                        {
                                                                            sending ?
                                                                            'Sending...' : 'Send message'
                                                                        }
                                                                    </button>
                                                                    <div className="submitting"></div>
                                                                </div>
                                                            </div>
                                                        
                                                        </>
                                                        :
                                                        <>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <p>Message sent Successfully. We would get back to you soon.</p>
                                                                    <Link style={{ marginRight: '1rem' }} to="/" className="btn btn-primary">Go Home</Link>

                                                                    <button onClick={() => { setForm(def); setFormSuccess(false) }} className="btn btn-primary">Send a new message</button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div className="w-100 social-media mt-5">
                                                <h3>Follow us here</h3>
                                                <p>
                                                    <a href="#">Facebook</a>
                                                    <a href="#">Twitter</a>
                                                    <a href="#">Instagram</a>
                                                    <a href="#">Dribbble</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 d-flex align-items-stretch">
                                        <div className="img w-100"
                                            style={{ backgroundImage:  `url(${process.env.PUBLIC_URL+'/assets/images/doc.jpg'})` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageContainer>
    )
}

export default Contact
