import React, { useState } from "react";
import "./Navbar.css";
import {
  logo,
  search,
  menu,
  more,
  notification,
  upload,
} from "../../assets/assets.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../../Auth/Logout/Logout.jsx";
import Login from "../../Auth/Login/Login.jsx";

const Navbar = ({ setSidebar, setSearchTerm }) => {
  const user = useSelector((state) => state.auth.user);
  const [inputValue, setInputValue] = useState("");

  const handleSearchSubmit = () => {
    if (inputValue.trim() === "") return;
    setSearchTerm(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <nav className="flex-div">
      {/* Left Section */}
      <div className="nav-left flex-div">
        <img
          className="menu-icon"
          src={menu}
          onClick={() => setSidebar((prev) => !prev)}
          alt="menu"
        />
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>
      </div>

      <div className="nav-middle flex-div">
        <div className="search-box flex-div">
          <input
            type="text"
            placeholder="Search videos..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <img
            src={search}
            alt="search"
            onClick={inputValue.trim() ? handleSearchSubmit : undefined}
            className={inputValue.trim() ? "clickable" : "disabled"}
          />
        </div>
      </div>

      <div className="nav-right flex-div">
        <img src={upload} alt="upload" />
        <img src={more} alt="more" />
        <img src={notification} alt="notification" />

        {user ? (
          <>
            <img src={user.photoURL} alt={user.name} className="user-icon" />
            <Logout />
          </>
        ) : (
          <Login />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
