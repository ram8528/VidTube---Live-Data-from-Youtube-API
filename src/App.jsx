import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Pages/Home/Home.jsx";
import Video from "./Pages/Video/Video.jsx";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "../firebase.jsx"
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./redux/authSlice.jsx";

const App = () => {
  const [sidebar, setSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // const [category, setCategory] = useState(0);
  const dispatch = useDispatch();

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe(); // clean up
  }, [dispatch]);



  return (
    <>
      <Navbar
        setSidebar={setSidebar}
        setSearchTerm={setSearchTerm}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              sidebar={sidebar}
              searchTerm={searchTerm}
            />
          }
        />

        <Route path="/video/:categoryId/:videoId" element={<Video />} />
      </Routes>
    </>
  );
};

export default App;
