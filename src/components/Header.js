import { Divider, Drawer, List, ListItem, ListItemText } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import React from 'react'
import { connect } from 'react-redux'
import { Link }from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { logoutUser } from '../redux/actions/user'

const Header = ({ logoutUser, user, mainNav }) => {
    const [drawer, setDrawer] = React.useState(false);
    const links = [ 'home', 'listings', 'categories', 'about', 'contact' ]
    const toggleDrawer = () => {
        setDrawer(!drawer)
    };
    
    return (
        <div>
            <nav className={ mainNav ? 'navbar navbar-expand-lg ftco-navbar-light' : 'navbar navbar-expand-lg ftco-navbar-dark'}>
                <div className="container-xl">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <span className="flaticon flaticon-team"></span>
                        <span className="" style={{ marginLeft: '10px' }}>EasyConnect <small style={{ marginTop: '5px' }}>Business Directory and Listing</small></span>
                    </Link>
                    <button onClick={() => toggleDrawer()} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="fa fa-bars"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav m-auto mb-2 mb-lg-0">
                            <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/listings">Listings</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/categories">Categories</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                            { !user.authenticated && <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li> }
                            <li className="nav-item"><Link className="nav-link" to="/search"><Search /></Link></li>
                        </ul>
                        { user.authenticated ? 
                            <p className="mb-0"><Link to="/account" className="btn btn-primary rounded">Account</Link></p>
                            :
                            <p className="mb-0"><Link to="/register" className="btn btn-primary rounded">Register</Link></p>
                        }
                        </div>
                </div>
            </nav>
            <>
                <Drawer className="custom-menu" anchor='right' open={drawer} onClose={() => toggleDrawer()}>
                    <List>
                        {
                            links.map((link, key) => (
                                <div  key={key}>
                                    <ListItem>
                                        <Link to={`/${link}`} style={{ textTransform: 'capitalize', color: '#212529', fontWeight: '600' }}>
                                            {link}
                                        </Link>
                                    </ListItem>
                                    
                                    <Divider />
                                </div>
                            ))
                        }
                        <ListItem button>
                            <Link  style={{ textTransform: 'capitalize', color: '#212529', fontWeight: '600' }} to={`/${user.authenticated ? 'account' : 'login'}`}>
                                {user.authenticated ? 'Account' : 'Login'}
                            </Link>
                        </ListItem>
                    </List>
                </Drawer>
            </>
        </div>
    )
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)