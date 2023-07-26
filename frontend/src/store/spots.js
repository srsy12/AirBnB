
const GET_ALL = 'spots/GET_ALL';

const getAll = spots => ({
    type: GET_ALL,
    spots
});

export const getAllSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const list = await response.json();
        dispatch(getAll(list))
    }
}

export const getSpotId = (id) => async dispatch => {
    const response = await fetch(`/api/pokemon/${id}`);

    if (response.ok) {
        const list = await response.json();
        dispatch(getAll(list))
    }
};

const initialState = {
    spots: []
};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL:
            return {
                ...state,
                spots: action.spots
            };
        default:
            return state;

    }
}

export default spotReducer;
