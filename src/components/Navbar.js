
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../assets/logo.png";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { FaUserAlt } from "react-icons/fa";

const Navbar = ({ username }) => {
    const navigate = useNavigate();
    const toast = useToast();

   
    const token = localStorage.getItem('token');
    if (token) {
    const tokenParts = token.split('.');    
    const encodedPayload = tokenParts[1];
    const decodedPayload = atob(encodedPayload); 
    const { username, userId } = JSON.parse(decodedPayload);
    console.log('Username:', username);
    console.log('User ID:', userId);
} else {
    console.log('Token not found in localStorage');
}


    const logOutUser = () => {
        toast({
            title: 'Logged Out Successfully',
            status: 'success',
            duration: 500,
            isClosable: true,
            position: 'top',
        });
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <div className='d-flex justify-content-center align-items-center' id='main-nav-box' style={{ height: '95px', width: '100%' }}>
                <div className="fog" />
                <div className="d-flex  w-100 max-w-100 align-items-center justify-content-between">
                    <Link to="/Posts">
                        <img src={Logo} alt="Logo" style={{ "height": "4rem", "padding": "1rem", "marginLeft": "17%" }} />
                    </Link>
                </div>

                <div className='d-flex justify-content-center align-items-center logout-icon' style={{ "flex": "1", "marginRight": "10%", "justifyContent": "space-between" }}>
                    <MdLogout style={{ cursor: 'pointer',fontSize:'2rem',marginRight:'1rem' }} onClick={logOutUser} />
                    Logout
                </div>
                
            </div >
        </>
    )
}

export default Navbar;


