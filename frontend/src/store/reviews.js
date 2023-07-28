import { csrfFetch } from "./csrf";

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';

const loadSpotReviews = reviews => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
});

export const getReviewsById = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadSpotReviews(reviews))
        return reviews;
    }
};


const reviewReducer = (state = {}, action) => {
    const newState = { ...state }
    switch (action.type) {
        case LOAD_SPOT_REVIEWS:
            newState[action.reviews[0].spotId] = [];
            action.reviews.forEach((review) => {
                newState[review.spotId].push(review);
            });
            return newState
        default:
            return state;

    }
}

export default reviewReducer;
