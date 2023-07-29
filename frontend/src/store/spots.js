import { csrfFetch } from "./csrf";

const GET_ALL = 'spots/GET_ALL';
const SPOT_DETAIL = 'spots/SPOT_DETAIL';
const CREATE_URL = 'spots/CREATE_URL'

const getAll = (spots) => ({
    type: GET_ALL,
    spots
});

const getSpot = (spot) => ({
    type: SPOT_DETAIL,
    spot
});

const createImage = (imagePayload) => ({
    type: CREATE_URL,
    imagePayload
})

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
        const list = await response.json();
        dispatch(getAll(list.Spots))
        return response;
    }
};

export const getSpotId = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`);

    if (response.ok) {
        const details = await response.json();
        dispatch(getSpot(details))
        return details;
    }
};

export const createSpot = (spotData) => async dispatch => {
    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotData),
    })

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(getSpot(newSpot));
        return newSpot;
    }
};

export const createSpotImage = (id, imagePayload) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/images`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imagePayload)
    })
    const spotImage = await res.json();
    dispatch(createImage(imagePayload))
    return spotImage
};


const spotReducer = (state = {}, action) => {
    const newState = { ...state }
    switch (action.type) {
        case GET_ALL:
            action.spots.forEach((spot) => {
                newState[spot.id] = spot
            });
            return newState
        case SPOT_DETAIL:
            newState[action.spot.id] = action.spot;
            return newState;
        default:
            return state;
    }
};

export default spotReducer;
