import React, { useEffect, useState } from 'react';
import AddPost from './AddPost';
import MyPosts from './MyPosts';
import AllPosts from './AllPosts';
import { FcAddImage } from "react-icons/fc";
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const Posts = () => {
    const [activeIcon, setActiveIcon] = useState(null);
    const [showAddPost, setShowAddPost] = useState(false);
    const [showMyPost, setShowMyPost] = useState(false);
    const [showAllPost, setShowAllPost] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false); // New state for showing/hiding image upload form

    const toast = useToast();
    const token = localStorage.getItem('token');

    const handleHomeClick = () => {
        setActiveIcon('home');
        setShowAddPost(false);
        setShowMyPost(false);
        setShowAllPost(true);
    };

    const handleAddClick = () => {
        setActiveIcon('add');
        setShowImageUpload(true); // Show image upload form
        setShowMyPost(false);
        setShowAllPost(false);
    };

    const handleUserClick = () => {
        setActiveIcon('user');
        setShowAddPost(false);
        setShowAllPost(false);
        setShowMyPost(true);
    };

    const handleFileInputChange = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please select an Image!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

        if (pics) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // Store selected image as base64 URL
            };
            reader.readAsDataURL(pics); // Convert file to base64 URL
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dfh9c19ty");
            fetch("https://api.cloudinary.com/v1_1/dfh9c19ty/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select jpg/jpeg/png Image!",
                status: 'warning',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = async () => {
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(`https://atgworld-3i5n.onrender.com/api/posts/addPost`, { post: pic }, config);
            toast({
                title: "Post added Successfully",
                status: 'success',
                duration: 500,
                isClosable: true,
                position: 'top',
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setSelectedImage(null);
            setPic(null);
            setLoading(false);
            setSubmitSuccess(true);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        handleHomeClick();
    }, []);

    useEffect(() => {
        if (submitSuccess) {
            handleAddClick(); // Call handleAddClick immediately
            setTimeout(() => {
                handleHomeClick(); // Call handleHomeClick after 2 seconds delay
            }, 500);
            setSubmitSuccess(false); // Reset the flag
        }
    }, [submitSuccess]);

    return (
        <div className='posts-top-container'>
            <div className="d-flex" style={{ height: '100vh'}}>
                {/* Left Column - Icons */}
                <div className="d-flex flex-column justify-content-between" style={{"background":"rgb(220, 220, 240)","width":"4rem"}}>
                    <div className={`footer-icon ${activeIcon === 'home' ? 'active' : ''}`} onClick={handleHomeClick}>
                        <i className={`fas fa-home ${activeIcon === 'home' ? 'active-icon' : ''}`}></i> {/* Home Icon */}
                    </div>
                    <div className={`footer-icon ${activeIcon === 'user' ? 'active' : ''}`} onClick={handleUserClick}>
                        <i className={`fas fa-user ${activeIcon === 'user' ? 'active-icon' : ''}`}></i> {/* User Icon */}
                    </div>
                    <div className='footer-icon footer-icon-add' onClick={handleAddClick}>
                        <i className='fas fa-plus'></i> {/* Add Icon */}
                    </div>
                </div>
                <hr style={{"height":"100vh"}}></hr>

                {/* Right Column - Main Content */}
                <div className="flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
                    <div className="renderPages" style={{ marginBottom: '60px' }}>
                        {showAddPost && <AddPost />}
                        {showMyPost && <MyPosts />}
                        {showAllPost && <AllPosts />}

                        {/* Image Upload Modal */}
                        {/* <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true"> */}
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content" style={{"width":"300px","justifyContent":"center","alignItems":"center","gap":"1rem"}}>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Create new post</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"  onClick={() => (setSelectedImage(null), setPic(null), setShowImageUpload(false))}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="d-flex justify-content-center">
                                            {selectedImage ? <img src={selectedImage} alt="Selected" className="selected-image" /> : (
                                                <label htmlFor="file-upload" className="add-image-icon-label">
                                                    <FcAddImage className="add-image-icon" />
                                                    {/* Hidden file input */}
                                                    <input type="file" accept='image/*' id="file-upload" className="visually-hidden" onChange={(e) => handleFileInputChange(e.target.files[0])} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {selectedImage ? <button type="button" className="btn btn-primary" onClick={() => (setSelectedImage(null), setPic(null), setShowImageUpload(false))}>Discard</button> : null}
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => (setSelectedImage(null), setPic(null), setShowImageUpload(false))}>Close</button>
                                        {selectedImage ? <button type="button" className="btn btn-primary" onClick={submitHandler} disabled={loading}>
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Add'}
                                        </button> : null}
                                    </div>
                                </div>
                            </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Posts;

