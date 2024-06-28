import React, { useEffect, useState } from 'react';
import '../CssFolder/allposts.css';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { useToast } from '@chakra-ui/react';
import { FaRegHeart, FaRegComment } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import Navbar from './Navbar';

const AllPosts = () => {
    const [username, setUserName] = useState("");
    const [userImg, setUserImg] = useState("");
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [loadingPost, setLoadingPost] = useState(false);
    const [loadingComment, setLoadingComment] = useState(false);
    const [userId, setUserId] = useState('');
    const [newComment, setNewComment] = useState('');
    const [currentPostId, setCurrentPostId] = useState(null);

    const toast = useToast();

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-type": "application/json",
        },
    };

    const getAllPosts = async () => {
        setLoadingPost(true);
        try {
            const response = await axios.get('https://atgworld-3i5n.onrender.com/api/posts/posts', config);
            const { userId, posts } = response.data;
            setUserId(userId);
            setPosts(posts);
            setLoadingPost(false);
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top',
            });
            setLoadingPost(false);
        }
    };

    useEffect(() => {
        getAllPosts();
    }, []);

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
            setComments(prevComments => ({
                ...prevComments,
                [id]: allComments,
            }));
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

    const generateUserImgUrl = (firstName) => {
        return `https://api.dicebear.com/6.x/initials/svg?seed=${firstName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`;
    };

    const calculateTimeDifference = (updatedAt) => {
        const now = new Date();
        const updatedTime = new Date(updatedAt);
        const diffInSeconds = Math.floor((now - updatedTime) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
        } else if (diffInMinutes < 1440) { // 60 * 24
            return `${Math.floor(diffInMinutes / 60)}h`;
        } else if (diffInMinutes < 10080) { // 60 * 24 * 7
            return `${Math.floor(diffInMinutes / 1440)}d`;
        } else {
            return `${Math.floor(diffInMinutes / 10080)}w`;
        }
    };

    return (
        <>
            <Navbar />
            <div className='all-posts-top-container mt-2'>
                <div className="top-heading-all-posts">All Posts</div>
                <div className="post-container d-flex flex-column align-items-center mt-3">
                    {loadingPost ? (
                        <Spinner animation="border" />
                    ) : (
                        posts.map((post) => (
                            <div className="single-post-holder mt-5" key={post._id}>
                                <div className="top-username-holder d-flex align-items-center px-3">
                                    <img src={generateUserImgUrl(post.user.username)} alt="User" className="user-img h-75 rounded-circle" style={{ marginRight: "5px" }} />
                                    {post.user.username} • <div style={{ fontSize: '15px', fontWeight: '500', marginLeft: '3px', marginTop: '3px' }}>{calculateTimeDifference(post.createdAt)}</div>
                                </div>
                                <div className="actual-post-div d-flex justify-content-center ">
                                    <img src={post.post} alt="not found" className='image-container' />
                                </div>
                                <div className="post-footer d-flex flex-column justify-content-center">
                                    <div className='d-flex align-items-center'>
                                        {post.likes.includes(userId) ? <FcLike className='icon heart-comment-icons mx-3' style={{ fontSize: '23px', marginBottom: '2px' }} onClick={() => handleLikePost(post._id)} />
                                            : <FaRegHeart
                                                className='icon heart-comment-icons mx-3'
                                                onClick={() => handleLikePost(post._id)}
                                            />}
                                        <FaRegComment
                                            className='icon heart-comment-icons'
                                            onClick={() => handleComment(post._id)}
                                            data-bs-toggle="modal" data-bs-target="#staticBackdrop3"
                                        />
                                    </div>
                                    <div className='mx-3 likes-text'>{post.likes.length} likes</div>

                                    {/* <!-- Modal --> */}
                                    <div className="modal fade" id="staticBackdrop3" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Comments</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setNewComment('')}></button>
                                                </div>
                                                <div className="modal-body">
                                                    {comments[currentPostId] && comments[currentPostId].length > 0 ? (
                                                        <div className="comments-section mx-3 mt-2">
                                                            {comments[currentPostId].map(comment => (
                                                                <div key={comment._id} className="single-comment">
                                                                    <strong>{comment.user.username}:</strong> {comment.text}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="no-comments-found mx-3 mt-2">
                                                            No comments found.
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="modal-footer d-flex justify-content-between">
                                                    <input className='comment-add-input' placeholder='Add a Comment' value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                                    <button type="button" className="btn btn-primary" onClick={handleAddComment} disabled={loadingComment}>
                                                        {loadingComment ? <Spinner animation="border" size="sm" /> : 'Add Comment'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default AllPosts;
