import React, { useEffect, useState } from 'react';
import '../CssFolder/allposts.css';
import axios from 'axios';
import { Spinner, Card, Modal, Button } from 'react-bootstrap';
import { useToast } from '@chakra-ui/react';
import Navbar from './Navbar';
import { FcLike } from "react-icons/fc";

const MyPosts = () => {
    const [username, setUsername] = useState(""); // State to store username
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMyPost, setLoadingMyPost] = useState(false);
    const [activePostId, setActivePostId] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [selectedImageEdit, setSelectedImageEdit] = useState(null);
    const [picEdit, setPicEdit] = useState();
    const [userId, setUserId] = useState('');
    const [newComment, setNewComment] = useState('');
    const [currentPostId, setCurrentPostId] = useState(null);
    const [loadingComment, setLoadingComment] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    const toast = useToast();
    const [modalShow, setModalShow] = useState(false);

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-type": "application/json",
        },
    };

    const generateUserImgUrl = (firstName) => {
        return `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} &backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`;
    };

    const getAllPosts = async () => {
        try {
            const response = await axios.get('https://atgworld-3i5n.onrender.com/api/posts/myposts', config);
            const { userId, posts } = response.data;
            if (posts.length === 0) {
                setLoadingMyPost(true);
                toast({
                    title: "No Post Found.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                });
            } else {
                setLoadingMyPost(false);
                setUserId(userId);
                setPosts(posts);
            }
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingMyPost(false);
        }
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    const confirmDeletePost = (postId) => {
        setPostToDelete(postId);
        setModalShow(true);
    };

    const deletePost = async () => {
        setLoading(true);
        try {
            await axios.delete(`https://atgworld-3i5n.onrender.com/api/posts/deletepost/${postToDelete}`, config);
            toast({
                title: 'Post Deleted Successfully',
                status: 'success',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            getAllPosts();
            setModalShow(false);
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoading(false);
            setModalShow(false);
        }
    };

    const handleLikePost = async (id) => {
        try {
            await axios.put(`https://atgworld-3i5n.onrender.com/api/posts/addlike/${id}`, {}, config);
            getAllPosts();
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
        }
    };

    const handleComment = async (id) => {
        setCurrentPostId(id);
        try {
            const response = await axios.get(`https://atgworld-3i5n.onrender.com/api/comments/${id}/getallcomments`, config);
            const allComments = response.data;
            if (allComments.length === 0) {
                toast({
                    title: "No Comments Found.",
                    status: 'success',
                    duration: 500,
                    isClosable: true,
                    position: 'top',
                });
            } else {
                setComments(prevComments => ({
                    ...prevComments,
                    [id]: allComments
                }));
            }
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
        }
    };

    const handleAddComment = async () => {
        setLoadingComment(true);
        if (!newComment.trim()) {
            toast({
                title: "Add some comment text first",
                status: 'warning',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoadingComment(false);
            return;
        }

        try {
            await axios.post(`https://atgworld-3i5n.onrender.com/api/comments/addcomment`, { postId: currentPostId, text: newComment }, config);
            toast({
                title: "Comment added Successfully",
                status: 'success',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            handleComment(currentPostId);
            setNewComment('');
            setLoadingComment(false);
        } catch (error) {
            toast({
                title: error.response?.data?.message || "Error Occurred!",
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoadingComment(false);
        }
    };

    const handleFileInputChangeEdit = (picsEdit) => {
        setLoadingEdit(true);
        if (picsEdit === undefined) {
            toast({
                title: "Please select an Image!",
                status: 'warning',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoadingEdit(false);
            return;
        }

        if (picsEdit) {
            const readerEdit = new FileReader();
            readerEdit.onloadend = () => {
                setSelectedImageEdit(readerEdit.result); // Store selected image as base64 URL
            };
            readerEdit.readAsDataURL(picsEdit); // Convert file to base64 URL
        }
        if (picsEdit.type === "image/jpeg" || picsEdit.type === "image/png" || picsEdit.type === "image/jpg") {
            const data = new FormData();
            data.append("file", picsEdit);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dfh9c19ty");
            fetch("https://api.cloudinary.com/v1_1/dfh9c19ty/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPicEdit(data.url.toString());
                    setLoadingEdit(false);
                })
                .catch((err) => {
                    setLoadingEdit(false);
                });
        } else {
            toast({
                title: "Please select jpg/jpeg/png Image!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingEdit(false);
            return;
        }
    };

    const submitHandlerEdit = async () => {
        setLoadingEdit(true);
        try {
            await axios.put(`https://atgworld-3i5n.onrender.com/api/posts/updatepost/${postToEdit}`, { post: picEdit }, config);
            toast({
                title: "Post updated Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setSelectedImageEdit(null);
            setPicEdit(null);
            setLoadingEdit(false);
            getAllPosts();
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingEdit(false);
        }
    };

    const handleEditPost = (postId) => {
        setPostToEdit(postId);
        setModalShow(true);
    };

    const openPostModal = (post) => {
        setSelectedPost(post);
        setModalShow(true);
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid mt-4 " style={{"margin":"8rem"}}>
                
                   
                    <div className="col-md-10">
                        <div className="d-flex align-items-center " style={{justifyContent:"center",marginBottom:"4rem"}}>
                            <img src={generateUserImgUrl(selectedPost?.user.username)} className="user_img rounded-circle" style={{ height: "6rem" }} alt="User" />
                            <h1 className="mt-4 mx-4 mb-4 mx-4">{selectedPost?.user.username}</h1>
                            {/* <Button variant="primary" onClick={() => handleEditPost(selectedPost?._id)}>Edit Profile</Button> */}
                        </div>
                        {loadingMyPost ? (
                            <Spinner animation="border" variant="primary" className="d-block mx-auto my-5" />
                        ) : (
                            posts.length > 0 ? (
                                <div className="row">
                                    {posts.map(post => (
                                        <div className="col-md-3 mb-4" key={post._id}>
                                            <Card className="post_card" onClick={() => openPostModal(post)}>
                                                <Card.Img variant="top" src={post.post} alt="Post" />
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No posts found.</p>
                            )
                        )}

                        <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title> <div className='d-flex '><img src={generateUserImgUrl(selectedPost?.user.username)} className='rounded-circle mx-2' style={{"height":"100px"}} />{selectedPost?.user.username}</div></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="d-flex">
                                    <div className="w-50 ">
                                        <img src={selectedPost?.post} alt="Selected Post" className="img-fluid rounded p-3 rounded"/>
                                    </div>
                                    <div className="w-50 pl-3">
                                        <div className="comments_section">
                                            <h5>Comments</h5>
                                            {comments[selectedPost?._id]?.map((comment, index) => (
                                                <p key={index}><strong>{comment.user.username}:</strong> {comment.text}</p>
                                            ))}
                                        </div>
                                        <div className="mt-3">
                                            <h6>Add a Comment</h6>
                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            ></textarea>
                                            <Button
                                                className="mt-2"
                                                variant="primary"
                                                onClick={handleAddComment}
                                                disabled={loadingComment}
                                            >
                                                {loadingComment ? 'Adding...' : 'Add Comment'}
                                            </Button>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                            <div className="">
                                            <span className='d-flex m-1 '><strong> <FcLike style={{ fontSize: "1.5rem", marginRight: "0.5rem", marginRight: "100%" }} /> </strong> {selectedPost?.likes.length}</span>
                                        </div>
                                <Button variant="secondary" onClick={() => setModalShow(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            
        </>
    );
}

export default MyPosts;

