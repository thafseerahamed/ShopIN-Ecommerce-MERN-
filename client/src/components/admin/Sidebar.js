import React from 'react';
import { Link} from "react-router-dom"

const Sidebar = () => {
  return <div>
  <div className="sidebar-wrapper ">
                <nav id="sidebar">
                    <ul className="list-unstyled components">
                    <li>
                        <Link to="/dashboard"><i className="fa fa-tachometer"></i> Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/admin/report"><i className="fa fa-tachometer"></i> Sales Report</Link>
                    </li>
                    <li>
                        <a href="#productSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-product-hunt"></i> Products</a>
                        <ul className="collapse list-unstyled" id="productSubmenu">
                            <li>
                            <Link to="/admin/products"><i className="fa fa-clipboard"></i> All</Link>
                            </li>
            
                            <li>
                            <Link to="/admin/product"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/admin/orders"><i className="fa fa-shopping-basket"></i> Orders</Link>
                    </li>

                    <li>
                        <Link to="/admin/users"><i className="fa fa-users"></i> Users</Link>
                    </li>
                    <li>
                        <a href="#productSubmen" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-product-hunt"></i> Categories</a>
                        <ul className="collapse list-unstyled" id="productSubmen">
                            <li>
                            <Link to="/admin/categories"><i className="fa fa-clipboard"></i> All</Link>
                            </li>
            
                            <li>
                            <Link to="/admin/category"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#productSubme" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-plus-square"></i> Offers</a>
                        <ul className="collapse list-unstyled" id="productSubme">
                            <li>
                            <Link to="/admin/offers"><i className="fa fa-clipboard"></i> All</Link>
                            </li>
            
                            <li>
                            <Link to="/admin/offer"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                        </ul>
                    </li>
            
                </ul>
                </nav>
            </div>
  </div>;
};

export default Sidebar;
