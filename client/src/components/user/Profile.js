import React, { Fragment,useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { getUserDetails,  showReferralCode,
  showWalletBalance, } from "../../actions/userActions";
const Profile = ({ history}) => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.user);
  const {refer} = useSelector((state) => state.referralId)

console.log(refer);
  const wallet = useSelector((state) => state.wallet)
  const { data } = wallet
useEffect(() => {


 dispatch(showReferralCode())
 dispatch(showWalletBalance())

  if (user && user.isBlocked === true){
    history.push('/login')
  }
 

},[history])

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Profile"} />

          <h2 className="mt-5 ml-5">My Profile</h2>
          <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-3">
              <figure className="avatar avatar-profile">
                <img
                  className="rounded-circle img-fluid"
                  src={user.avatar.url}
                  alt={user.name}
                />
              </figure>
              <Link
                to="/me/update"
                id="edit_profile"
                className="btn btn-primary btn-block my-5"
              >
                Edit Profile
              </Link>
            </div>

            <div className="col-12 col-md-5">
              <h4>Full Name</h4>
              <p>{user.name}</p>

              <h4>Email Address</h4>
              <p>{user.email}</p>

              {/* <h4>Joined On</h4>
              <p>{String(user.createdAt).substring(0, 10)}</p> */}
            
            <h4>My Wallet</h4>
              <p>Balance: Rs {data && data}/-</p>

       {refer ?  <div>     
            <h4>My Referral Id</h4>
              <p>{refer && refer.referralId} </p>
              </div>:(<div></div>)
       }
                <Link to="/address/me" className="btn btn-danger btn-block mt-5">
                  Manage Shipping Details
                </Link>
         

              <Link
                to="/password/update"
                className="btn btn-primary btn-block mt-3"
              >
                Change Password
              </Link>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
