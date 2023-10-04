import React, { useEffect } from "react";
import Home from '../pages/Home';
import { BrowserRouter as Router, Switch, Route, useHistory, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/user";
import { fetchAll } from "../redux/actions/general";
import firebase from '../redux//api/config'
import { bindActionCreators } from "redux";
import AOS from 'aos';
import Register from "../pages/Register";
import Login from "../pages/Login";
import Categories from "../pages/Categories";
import Account from "../pages/private/Account";
import AddBusiness from "../pages/private/AddBusiness";
import AllBusinesses from "../pages/private/AllBusinesses";
import Listing from "../pages/Listing";
import Search from "../pages/Search";
import View from "../pages/View";
import About from "../pages/About";
import Contact from "../pages/Contact";
import EditAccount from "../pages/private/EditAccount";
import Terms from "../pages/Terms";
import EditBusiness from "../pages/private/EditBusiness";

const ScrollToTop = () => {
  const history = useHistory();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history.location.pathname]);

  return null;
};

const ResetScroll = withRouter(ScrollToTop);

const Routes = ({ user, logoutUser, fetchAll }) => {
    const history = useHistory();
    const init = async () => {
        AOS.init()
        await fetchAll();
    }

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history])

  const logOut = async () => {
    await logoutUser();
    window.location.href = "/login";
  }

  const PrivateRoute = ({ component: Component, exact, ...rest }) => {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        logOut();
      }
    })
    const authenticated =  user.authenticated;
    return (
      <Route
        {...rest}
        render={(props) =>
          authenticated ? <Component {...props} /> : <Redirect to="/login" />
        }
        exact={exact}
      />
    );
  };

  return (
    <Router>
      <ResetScroll />
      <Switch>
        <Route exact path="/home">
          <Redirect to={`/`} />
        </Route>
        <Route exact path="/" component={Home} />
        <Route exact path="/categories" component={Categories} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/listings" component={Listing} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/terms-conditions" component={Terms} />
        <Route exact path="/view-listing/:id" component={View} />
        <Route exact path="/login" component={Login} />
        {/* <Route exact path="/404" component={NotFound} /> */}
        <PrivateRoute exact path="/account" component={Account} />
        <PrivateRoute exact path="/account/add-business" component={AddBusiness} />
        <PrivateRoute exact path="/account/all-business" component={AllBusinesses} />
        <PrivateRoute exact path="/account/edit-account" component={EditAccount} />
        <PrivateRoute exact path="/account/edit-business" component={EditBusiness} />
        <Route path="*">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({logoutUser, fetchAll }, dispatch)
}

export default connect(({ user }) => ({ user }), mapDispatchToProps)(Routes);
