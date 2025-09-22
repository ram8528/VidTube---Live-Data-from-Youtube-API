import React from "react";
import { auth } from "../../../firebase.jsx";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/authSlice.jsx";
import "./Logout.css";
function Logout() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return <button onClick={handleLogout} className="auth-button">Logout</button>;
}

export default Logout;
