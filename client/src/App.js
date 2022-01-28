import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer1 from "./components/layout/Footer1";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import store from "./store";
import { loaduser } from "./actions/userActions";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/route/ProtectedRoute";
import ProfileUpdate from "./components/user/ProfileUpdate";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import Cart from "./components/cart/Cart";

function App() {
  useEffect(() => {
    store.dispatch(loaduser());
  }, []);

  return (
    <Router>
      <Header />
      <div className="container container-fluid">
        <Route path="/" component={Home} exact />
        <Route path="/search/:keyword" component={Home} />
        <Route path="/product/:id" component={ProductDetails} exact />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/password/forgot" component={ForgotPassword} exact />
        <Route path="/password/reset/:token" component={NewPassword} exact />
        <Route path="/cart" component={Cart} />
        <ProtectedRoute path="/me" component={Profile} exact />
        <ProtectedRoute path="/me/update" component={ProfileUpdate} exact />
        <ProtectedRoute
          path="/password/update"
          component={UpdatePassword}
          exact
        />
      </div>
      <Footer1 />
    </Router>
  );
}

export default App;
