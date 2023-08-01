import { getReviewsById } from '../../store/reviews';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getSpotId } from '../../store/spots';
import './SpotDetails.css'; // Import the SpotDetails.css file for styling

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spotState[spotId]);
    const reviews = useSelector(state => state.reviewState[spotId])


    useEffect(() => {
        dispatch(getSpotId(spotId));
        dispatch(getReviewsById(spotId))
    }, [dispatch, spotId]);

    return (
        <div className="spot-details-container">
            {spot && (
                <div className="spot-details">
                    <div className="spot-images">
                        {spot.SpotImages?.map((image) => (
                            <img key={image.id} src={image.url} alt={spot.name} className="spot-image" />
                        ))}
                    </div>
                    <h1 className="spot-name">{spot?.name}</h1>
                    <h2 className="spot-location">{spot?.city}, {spot?.state}, {spot?.country}</h2>
                    <h2 className="spot-host">Hosted By {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    <div className="spot-rating">
                        <h4>{spot.avgRating ? spot.avgRating : 'NEW'}</h4>
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <p className="spot-description">{spot?.description}</p>
                    <NavLink to={`/spots/${spot.id}/reviews`} className="post-review-link">
                        Post a Review
                    </NavLink>
                    <div className="reviews-container">
                        {reviews && reviews.length > 0 ? (
                            <div>
                                {reviews?.map((review) => (
                                    <div key={review.id} className="review-item">
                                        <h2 className="review-date">{new Date(review.createdAt).toLocaleString('en-US', { month: 'long' })} {new Date(review.createdAt).getDate()}</h2>
                                        <p className="review-text">{review.review}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No Reviews Yet for This Spot</div>
                        )}
                    </div>
                    <button className="reserve-button">Reserve</button>
                </div>
            )}
        </div>
    );
};

export default SpotDetails;
