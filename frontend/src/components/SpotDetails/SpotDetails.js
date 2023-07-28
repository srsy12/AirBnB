import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams, Switch } from 'react-router-dom';
import { getSpotId } from '../../store/spots';
import { getReviewsById } from '../../store/reviews';
// import { getAllSpots } from '../../store/spots';


const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spotState[spotId]);
    const reviews = useSelector(state => state.reviewState[spotId])
    // console.log(spot);
    console.log(reviews);

    useEffect(() => {
        dispatch(getSpotId(spotId));
        if (reviews) dispatch(getReviewsById(spotId))
    }, [dispatch, spotId]);


    return (
        <div>
            {spot && (
                <div>
                    <div>
                        {spot.SpotImages?.map((image) => (
                            <img key={image.id} src={image.url} alt={spot.name}></img>
                        ))}
                    </div>
                    <h1>{spot?.name}</h1>
                    <h2>{spot?.city}, {spot?.state}, {spot?.country}</h2>
                    <h2>Hosted By {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    <h4>{spot.avgRating ? spot.avgRating : 'NEW'}<i class="fa-solid fa-star"></i></h4>
                    <h2>{spot?.description}</h2>
                    <div>
                        {reviews && (
                            <div>
                                {reviews?.map((review) => (
                                    <div key={review.id}>
                                        <h2>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long' })} {new Date(review.createdAt).getDate()}</h2>
                                        <p>{review.review}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SpotDetails;
