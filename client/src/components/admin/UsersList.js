import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  allUsers,
  blockUser,
  unBlockUser,
  clearErrors,
 
} from "../../actions/userActions";
import Sidebar from "./Sidebar";
import {
  BLOCK_USER_RESET,
  UNBLOCK_USER_RESET,
} from "../../constants/userConstatnts";

const UsersList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, users } = useSelector((state) => state.allUsers);

  const { isBlocked } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isBlocked) {
      alert.success("User Blocked successfully");
      history.push("/admin/users");
      
    }

  }, [dispatch, alert, error, isBlocked, history]);
  const blockUserHandler = (id) => {
    if (window.confirm(`Block the user ?`)) {
      dispatch(blockUser(id));
     
    }
  };
  const unBlockUserHandler = (id) => {
    if (window.confirm(`Unblock the user ?`)) {
      dispatch(unBlockUser(id));
    }
  };

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
            {user.isBlocked ? (
              <button
                className="btn btn-success py-1 px-2 ml-2"
                onClick={() => unBlockUserHandler(user._id)}
              >
                Unblock
              </button>
            ) : (
              <button
                className="btn btn-danger py-1 px-2 ml-2"
                onClick={() => blockUserHandler(user._id)}
              >
                Block
              </button>
            )}
          </div>
        ),
      });
    });

    return data;
  };
  return (
    <div>
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
    </div>
  );
};

export default UsersList;
