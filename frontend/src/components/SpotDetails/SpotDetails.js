import { getReviewsById } from '../../store/reviews';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getSpotId } from '../../store/spots';
import './SpotDetails.css'; // Import the SpotDetails.css file for styling
import OpenModalButton from '../Modal/Modal';
import PostReview from '../PostReview/PostReview';
import SpotsBrowser from '../SpotsBroswer/SpotsBrowser';
import DeleteReview from '../DeleteReview/DeleteReview';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spotState[spotId]);
    const reviews = useSelector(state => state.reviewState[spotId])
    const user = useSelector(state => state.session.user)





    useEffect(() => {
        dispatch(getSpotId(spotId));
        dispatch(getReviewsById(spotId))
    }, [dispatch, spotId]);

    const found = reviews?.find(review => review.userId === user?.id)



    return (
        <div className="spot-details-container">
            {spot && (
                <div className="spot-details">
                    <h1 className="spot-name">{spot?.name}</h1>
                    <h2 className="spot-location">{spot?.city}, {spot?.state}, {spot?.country}</h2>
                    <div className="spot-images">
                        {spot.SpotImages?.map((image) => (
                            <img key={image.id} src={image.url} alt={spot.name} className="spot-image" />
                        ))}
                    </div>
                    <h2 className="spot-host">Hosted By {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    <div className="spot-rating">
                        <h4>{spot.avgRating !== "0.00" ? spot.avgRating : 'NEW'}</h4>
                        <i className="fa-solid fa-star"></i>
                        {spot.numReviews === 1 ? (
                            <div>{spot.numReviews} review</div>

                        ) : (
                            <div>{spot.numReviews} reviews</div>
                        )}
                    </div>
                    <p className="spot-description">{spot?.description}</p>
                    {!found && user && user?.id !== spot.Owner?.id && (
                        <OpenModalButton
                            buttonName="Post Review"
                            modalComponent={<PostReview />}
                        />
                    )}
                    <div className="reviews-container">
                        {reviews && reviews.length > 0 && (
                            <div>
                                {reviews?.map((review) => (
                                    <div key={review.id} className="review-item">
                                        <div>{review.User.firstName}</div>
                                        <div className="review-date">{new Date(review.createdAt).toLocaleString('en-US', { month: 'long' })} {new Date(review.createdAt).getFullYear()}</div>
                                        <div className="review-text">{review.review}</div>
                                        {user && review && user.id === review.userId && (
                                            <OpenModalButton
                                                buttonName="Delete"
                                                modalComponent={<DeleteReview reviewId={review.id} />}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {user && user?.id !== spot.Owner?.id && (
                            <div>Be the first to post a review!</div>
                        )}
                    </div>
                    <button className="reserve-button" onClick={() => window.alert("Feature coming soon")}>Reserve</button>
                </div>
            )}
        </div>
    );
};

export default SpotDetails;
