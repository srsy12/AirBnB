import { csrfFetch } from "./csrf";

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const GET_REVIEW = 'reviews/GET_REVIEW'
const DELETE = 'reviews/DELETE'

const loadSpotReviews = reviews => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
});

const makeReview = (reviewPayload) => ({
    type: CREATE_REVIEW,
    reviewPayload
});

const deleteReview = () => ({
    type: DELETE
});



export const getReviewsById = (id) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${id}/reviews`);

        if (response.ok) {
            const reviews = await response.json();
            dispatch(loadSpotReviews(reviews))
            return reviews;
        }
    }
    catch (err) {
        console.error(err)
    }
};

export const createReview = (spotId, reviewData) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    })

    if (response.ok) {
        const newReview = await response.json();
        dispatch(makeReview(newReview));
        return newReview;
    } else {
        const errors = await response.json();
        return errors;
    }
};


export const deleteReviewId = (id) => async (dispatch) => {
    const result = await csrfFetch(`/api/reviews/${id}`, {
        method: "DELETE",
    })

    if (result.ok) {
        const deleted = await result.json();
        dispatch(deleteReview())
        return deleted;
    }
};


const reviewReducer = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case LOAD_SPOT_REVIEWS:
            newState[action.reviews[0].spotId] = [];
            action.reviews.forEach((review) => {
                newState[review.spotId].push(review);
            });
            return newState
        case GET_REVIEW:
            newState[action.reviewPayload.id] = action.reviewPayload;
            return newState
        case DELETE:
            newState = {};
            return newState
        default:
            return state;

    }
}

export default reviewReducer;
