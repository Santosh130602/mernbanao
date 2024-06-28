import React, { useState } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [updatedpassword, setUpdatedPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [updatedPasswordVisible, setUpdatedPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingForgot, setLoadingForgot] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleUpdatedPasswordVisibility = () => {
        setUpdatedPasswordVisible(!updatedPasswordVisible);
    };

    //function to login user
    const handleSignin = async () => {
        setLoading(true);

        if (!username || !password) {
            toast({
                title: "Please fill all the fields",
                status: 'warning',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            
                const { data } = await axios.post('https://atgworld-3i5n.onrender.com/api/user/login', {
                username,
                password
            }, config);

            // Store the token in local storage
            localStorage.setItem('token', data.token);

            toast({
                title: "Login Successful",
                status: 'success',
                duration: 500,
                isClosable: true,
                position: 'top',
            });

            setLoading(false);
            setUserName(username);
            setPassword("");
            navigate('/posts');
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoading(false);
        }
    };

    const handleClear = () => {
        setEmail("");
        setUpdatedPassword("");
    }

    const handleUpdatePassword = async () => {
        setLoadingForgot(true);

        if (!email || !updatedpassword) {
            toast({
                title: "Please fill all the fields",
                status: 'warning',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoadingForgot(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.put('https://atgworld-3i5n.onrender.com/api/user/forgotpassword', {
                email,
                updatedpassword
            }, config);


            toast({
                title: "Password Updated Successfully",
                status: 'success',
                duration: 500,
                isClosable: true,
                position: 'top',
            });

            setLoadingForgot(false);
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoadingForgot(false);
        }
    };

    return (
        <div className='login-form-top d-flex flex-column align-items-center'>
            <div className="login-container d-flex flex-column align-items-center mt-5">
                <div className='mt-2 mb-5' style={{ fontSize: '30px' }}>Login</div>
                <div className="form-floating mb-3">
                    <input type="name" className="form-control" id="floatingInput" placeholder="" value={username} onChange={(e) => setUserName(e.target.value)} />
                    <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating mb-5">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        className="form-control"
                        id="floatingPassword"
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                    <span
                        className="position-absolute"
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        onClick={togglePasswordVisibility}
                    >
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                    </span>
                </div>
                <button className='login-button mt-3 mb-3' type="submit" onClick={handleSignin} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                </button>
                <div className="mb-5 forgot-text" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ cursor: 'pointer' }}>Forgot Password?</div>

                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Update Password</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClear}></button>
                            </div>
                            <div className="modal-body d-flex flex-column align-items-center">
                                <div className="form-floating mb-3">
                                    <input type="name" className="form-control" id="floatingInput" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <label htmlFor="floatingInput">Email</label>
                                </div>
                                <div className="form-floating">
                                    <input
                                        type={updatedPasswordVisible ? "text" : "password"}
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder=""
                                        value={updatedpassword}
                                        onChange={(e) => setUpdatedPassword(e.target.value)}
                                    />
                                    <label htmlFor="floatingPassword">Password</label>
                                    <span
                                        className="position-absolute"
                                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                        onClick={toggleUpdatedPasswordVisibility}
                                    >
                                        <FontAwesomeIcon icon={updatedPasswordVisible ? faEye : faEyeSlash} />
                                    </span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClear}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdatePassword} disabled={loadingForgot}>
                                    {loadingForgot ? <Spinner animation="border" size="sm" /> : 'Update Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='mt-3 mb-3 signup-text' >Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: "#0095f6", cursor: 'pointer' }}>Sign Up</span></div>
            
            </div>
           
        </div>
    )
}

export default Login