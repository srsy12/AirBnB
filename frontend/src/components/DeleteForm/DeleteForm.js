import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpotId, getSpotId } from "../../store/spots";
import { useEffect } from "react";

const DeleteForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spotState[spotId]);

    useEffect(() => {
        dispatch(getSpotId(spotId));
    }, [dispatch, spotId]);

    const handleDelete = function () {
        if (spot) {
            const deletedSpot = dispatch(deleteSpotId(spotId));
            if (deletedSpot) {
                history.push(`/spots/current`)
            }
        }
    };

    return (
        <div>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={() => handleDelete()} >Yes</button> <button onClick={() => history.push(`/spots/current`)}>No</button>
        </div>
    );
};

export default DeleteForm;
