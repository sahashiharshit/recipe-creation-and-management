/* eslint-disable no-unused-vars */
import axios from "axios";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import Rate from 'rc-rate';
import "rc-rate/assets/index.css";
import { API_BASE_URL } from "../utils/config";
const RecipeReviews = ({ recipe,onAverageRatingChange }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [users,setUsers]= useState([]);
  const [comment, setComment] = useState("");
  //
  const [userReview,setUserReview]= useState(null);
  const [userId,setUserId]= useState(null);
  //
  const recipeId= recipe.id;

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/recipes/${recipeId}/reviews`,
        { withCredentials: true }
      );
      
      setReviews(response.data.reviews);
      setUsers(response.data.userIds);
       // ✅ Get logged-in user ID from the backend
      const userResponse = await axios.get(`${API_BASE_URL}/api/users/profile`, { withCredentials: true });
      setUserId(userResponse.data.id); 
      //✅ Check if the user has already reviewed this recipe
      const existingReview = response.data.reviews.find(review => review.userId === userResponse.data.id);
      setUserReview(existingReview || null);
      // Calculate average rating
 
      const totalRating = response.data.reviews.reduce((sum, review) => {
      
     return sum + Number(review.rating);
      
      },0);
     
      const avg = response.data.reviews.length > 0 ? Number((totalRating / response.data.reviews.length).toFixed(1) ): 0;
      
      onAverageRatingChange(avg); 
    } catch (error) {
      showErrorToast("Error fetching reviews");
    }
  }, [recipeId,onAverageRatingChange]);
  
  
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  
  //✅ Handle Review Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(userReview){
      showErrorToast("You have already reviewed this recipe.");
      return;
    }
    if (!rating || rating <= 0) {
      showErrorToast("Please select a rating before submitting.");
      return;
    }
    if(!comment){
    showErrorToast("Comment can't be empty.")
    return;
    }
    try {
    
      await axios.post(
        `${API_BASE_URL}/api/recipes/${recipeId}/reviews`,
        { rating, comment },
        { withCredentials: true }
      );
      showSuccessToast("Review submitted");
      const newReview = { rating, comment, userId };
      setReviews([...reviews, newReview]);
      setUserReview(newReview);
      setRating(0);
      setComment("");
    } catch (error) {
      showErrorToast("Failed to submit review");
    }
  };
  
  return (
    <div className="ratings-container">
      <h3 className="rating-heading">Ratings & Reviews</h3>
      {reviews.map((review, index) => (
        <div key={index} className="ratings">
        <Rate allowHalf value={review.rating} disabled style={{fontSize:"30px"}} />
          <p className="comment">{review.comment}</p>
          <p className="comment-username"> - {
           users.find((user)=>
            String(user.id).trim()===String(review.userId).trim()
            )?.username||"Unknown User"}
          
         </p>
        </div>
      ))}
      {/* ✅ Only show form if the user hasn't reviewed yet */}
      {(!userReview)&&(userId!==recipe.userId) && (
       <form onSubmit={handleSubmit} className="rating-form">
       <Rate allowHalf value={rating} onChange={setRating} style={{fontSize:"30px"}} allowClear/>
         <textarea
           className="comment-text"
           rows="3"
           value={comment}
           onChange={(e) => setComment(e.target.value)}
           placeholder="Write your review..."
         />
         <button
           type="submit"
           className="comment-button"
         >
           Submit Review
         </button>
       </form>
      
      )}
      {/* ✅ Show message if the user already reviewed */}
     {/* {userReview && <p className="already-reviewed">You have already reviewed this recipe.</p>} */}
    </div>
  );
};

RecipeReviews.propTypes = {
  recipe: PropTypes.object.isRequired,
  onAverageRatingChange:PropTypes.func.isRequired,
};
export default RecipeReviews;
