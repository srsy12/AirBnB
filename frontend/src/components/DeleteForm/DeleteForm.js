import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpotId, getSpotId, getSpotsById } from "../../store/spots";
import { context } from '../Modal/Modal'
import { useEffect, useContext } from "react";
import './DeleteForm.css'

const DeleteForm = ({ spotId }) => {
    const dispatch = useDispatch();
    const { setModal } = useContext(context)
    const spot = useSelector(state => state.spotState[spotId]);

    useEffect(() => {
        dispatch(getSpotId(spotId));
    }, [dispatch, spotId]);

    const handleDelete = function () {
        if (spot) {
            const deletedSpot = dispatch(deleteSpotId(spotId));
            if (deletedSpot) {
                setModal(false)
                dispatch(getSpotsById());
            }
        }
    };

    return (
        <div id="deleteformcontainer">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <div id="button-container">
                <button id="yesDelete" onClick={() => handleDelete()} >Yes (Delete Spot)</button>
                <button id="noDelete" onClick={() => {
                    dispatch(getSpotsById());
                    setModal(false)
                }}>No (Keep Spot)</button>
            </div>

        </div >
    );
};

export default DeleteForm;
