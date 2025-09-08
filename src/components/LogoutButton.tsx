import React, { useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { removeAuthUser } from "../utils/storage";

const LogoutButton: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('inside logout')
    logout();
    removeAuthUser();
    // delete window.localStorage["authUser"]; // optional redundant clear
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="btn btn-link">
      Logout
    </button>
  );
};

export default LogoutButton;
