import React from "react";
import { Link, matchPath } from "react-router-dom";
import Logo from "../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { useLocation } from "react-router-dom";

const Header = () => {
const location = useLocation()
  const matchRoute = (route) => {
    return matchPath ({path: route}, location. pathname);

  }
  return (
    <div className="d-flex h-14 align-items-center border-bottom justify-content-between">
      <div class="input-group search-box">
        <input type="text" className="border border text-aline-center" placeholder="Search" />
        <button className="border p-2 align-items-center">
          <IoMdSearch />
        </button>
      </div>


      <div className="d-flex align-items-center justify-content-between" style={{ "paddingBottom": "1rem", "marginRight": "2rem", "gap": "2rem" }}>
        <Link to='/login' className='d-inline-block mt-4'>
          <button className='btn btn-warning text-center text-black fw-semibold px-4 py-2 rounded'>
            Login
          </button>
        </Link>
        <Link to='/signup' className='d-inline-block mt-4 ms-2'>
          <button className='btn btn-warning text-center text-black fw-semibold px-4 py-2 rounded'>
            Signup
          </button>
        </Link>
      </div>
    </div>
  )
}
export default Header; 