import React from 'react';
import { Link, Route} from 'react-router-dom';

import "../../App.css"
import Search from './Search';
const Header = () => {

  return( <div>
 <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to="/">
          <img src="/images/logo.png" />
          <p className="title mt-3">Shop<span className='title1'>IN</span></p>
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">

     <Route render={({history}) => <Search history={history}/> } />

     
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <button className="btn" id="login_btn">Login</button>

        <span id="cart" className="ml-3">Cart</span>
        <span className="ml-1" id="cart_count">2</span>
      </div>
    </nav>

  </div>
  )
}

export default Header;
