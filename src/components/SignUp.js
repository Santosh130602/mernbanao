import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const SignUp = () => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    //function to handle registration
    const handleSignup = async () => {
        setLoading(true);

        if (!username || !email || !password || !confirmpassword) {
            toast({
                title: "Please fill all the fields",
                status: 'warning',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoading(false)
            return;
        }

        if (password !== confirmpassword) {
            toast({
                title: "Passwords do not Match",
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
                const { data } = await axios.post('https://atgworld-3i5n.onrender.com/api/user/register', {
                username,
                email,
                password
            }, config);

            toast({
                title: "Registration Successful",
                status: 'success',
                duration: 500,
                isClosable: true,
                position: 'top',
            });

            setLoading(false);
            navigate('/login');
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

    return (
        <div className='login-form-top d-flex flex-column align-items-center'>
            <div className="login-container d-flex flex-column align-items-center mt-5">
                <div className='mt-2 mb-5' style={{ fontSize: '30px' }}>Sign Up</div>
                <div className="form-floating mb-3">
                    <input type="name" className="form-control" id="floatingInput" placeholder="" value={username} onChange={(e) => setUserName(e.target.value)} />
                    <label className='floatingInput' htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label className='floatingInput' htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        className="form-control"
                        id="floatingPassword"
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className='floatingInput' htmlFor="floatingPassword">Password</label>
                    <span
                        className="position-absolute"
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        onClick={togglePasswordVisibility}
                    >
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                    </span>
                </div>
                <div className="form-floating mb-5">
                    <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className="form-control"
                        id="floatingPassword"
                        placeholder=""
                        value={confirmpassword}
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <label className='floatingInput' htmlFor="floatingPassword">ConfirmPassword</label>
                    <span
                        className="position-absolute"
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        onClick={toggleConfirmPasswordVisibility}
                    >
                        <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} />
                    </span>
                </div>
                <button className='login-button mb-5' type="submit" onClick={handleSignup} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
                </button>
                <div className='mt-3 mb-3 login-text' >Have an account? <span onClick={() => navigate('/login')} style={{ color: "#0095f6", cursor: 'pointer' }}>Log in</span></div>

            </div>
        </div>
    )
}

export default SignUp