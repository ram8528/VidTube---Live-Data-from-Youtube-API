import React from "react";
import { auth, provider } from "../../../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";
import { signInWithPopup } from "firebase/auth";
import "./Login.css";
function Login() {
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch(
        setUser({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );
    } catch (error) {
      console.log("Login Error:", error);
    }
  };

  return <button onClick={handleLogin} className="auth-button">Login</button>;
}

export default Login;
