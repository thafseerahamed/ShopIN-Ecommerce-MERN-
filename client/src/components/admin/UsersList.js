import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { allUsers , clearErrors} from "../../actions/userActions";
import Sidebar from "./Sidebar";

const UsersList = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
  
    const {
      loading,
      error,
     users,
    } = useSelector((state) => state.allUsers);
    

  
  
    useEffect(() => {
      dispatch(allUsers());
  
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
     
        
  
    }, [dispatch, alert, error]);
  
    
    const setUsers = () => {
      const data = {
        columns: [
          {
            label: " User ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "Name",
            field: "name",
            sort: "asc",
          },
          {
            label: "Email",
            field: "email",
            sort: "asc",
          },
          {
            label: "Role",
            field: "role",
            sort: "asc",
          },
          {
            label: "Actions",
            field: "actions",
          },
        ],
        rows: [],
      };
  
      users.forEach((user) => {
        data.rows.push({
          id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
        
          actions: (
            <div>
              <Link
                to={`/admin/user/${user._id}`}
                className="btn btn-primary py-1 px-2 "
              >
                <i className="fa fa-eye"></i>
              </Link>
             
            </div>
          ),
        });
      });
  
      return data;
    };
  return <div>


<MetaData title={"All Users"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <div>
            <h1 className="my-5"> All Users</h1>
            {loading ? (
              <Loader />
            ) : (
              <div>
                <MDBDataTable
                  data={setUsers()}
                  className="px-3"
                  bordered
                  striped
                  hover
                />
              </div>
            )}
          </div>
        </div>
      </div>
  </div>;
};

export default UsersList;
