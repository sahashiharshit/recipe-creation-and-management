/* eslint-disable no-unused-vars */
import axios from "axios";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import StarRatings from 'react-star-ratings';
const RecipeReviews = ({ recipeId,onAverageRatingChange }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [users,setUsers]= useState([]);
  const [comment, setComment] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/recipes/${recipeId}/reviews`,
        { withCredentials: true }
      );
      
      setReviews(response.data.reviews);
      setUsers(response.data.userIds);
      
      // Calculate average rating
      const totalRating = response.data.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avg = response.data.reviews.length > 0 ? Number((totalRating / response.data.reviews.length).toFixed(1) ): 0;

      onAverageRatingChange(avg); 
    } catch (error) {
      showErrorToast("Error fetching reviews");
    }
  }, [recipeId,onAverageRatingChange]);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3000/api/recipes/${recipeId}/reviews`,
        { rating, comment },
        { withCredentials: true }
      );
      showSuccessToast("Review submitted");
      fetchReviews();
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
        <StarRatings
            rating={review.rating}
            starRatedColor="#ffd700" // Gold color for stars
            numberOfStars={5}
            starDimension="24px"
            starSpacing="2px"
          />
          <p className="comment">{review.comment}</p>
          <span className="comment-username"> - {users.find((user)=>
          user.id===review.userId
          )?.username}</span>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="rating-form">
      <StarRatings
          rating={rating}
          starRatedColor="#ffd700"
          numberOfStars={5}
          changeRating={(newRating) => setRating(newRating)}
          starDimension="24px"
          starSpacing="2px"
        />
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
    </div>
  );
};

RecipeReviews.propTypes = {
  recipeId: PropTypes.string.isRequired,
  onAverageRatingChange:PropTypes.func.isRequired,
};
export default RecipeReviews;
