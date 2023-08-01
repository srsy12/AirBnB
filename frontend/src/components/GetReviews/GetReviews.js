import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams, Switch } from 'react-router-dom';
import { getSpotId } from '../../store/spots';
import { getReviewsById } from '../../store/reviews';
// import { getAllSpots } from '../../store/spots';


const GetReviews = ({ spotId }) => {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviewState[spotId])


    useEffect(() => {
        if (reviews) dispatch(getReviewsById(spotId));
    }, [dispatch]);

    let reviewItems;
    if (reviews) {
        reviewItems = reviews?.map((review) => (
            <div key={review?.id}>
                <h2>{new Date(review?.createdAt).toLocaleString('en-US', { month: 'long' })} {new Date(review?.createdAt).getDate()}</h2>
                <p>{review?.review}</p>
            </div>
        ))
    }
    return (
        <div>
            {reviewItems}
        </div>
    )
}

export default GetReviews;
