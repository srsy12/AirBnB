
import { useDispatch, useSelector } from "react-redux";
import { deleteReviewId, getReviewsById } from "../../store/reviews";
import { getSpotId } from '../../store/spots';
import { context } from '../Modal/Modal'
import { useContext } from "react";
import { useParams } from "react-router-dom";
import './DeleteReview.css'

const DeleteReview = ({ reviewId }) => {
    const dispatch = useDispatch();
    const { setModal } = useContext(context)
    const { spotId } = useParams()
    // const review = useSelector(state => state.reviewState[spotId])

    // useEffect(() => {
    //     dispatch(getReviewsById(spotId));
    // }, [dispatch, spotId]);

    const handleDelete = function () {
        const deletedReview = dispatch(deleteReviewId(reviewId));
        if (deletedReview) {
            setModal(false)
            dispatch(getSpotId(spotId));
            dispatch(getReviewsById(spotId))
        }
    };

    return (
        <div id="deletereviewform">
            <h1>Confirm Delete</h1>
            <div id="deletetext">Are you sure you want to delete this review</div>
            <button id="yesdelete" onClick={() => handleDelete()} >Yes (Delete Review)</button> <button id="nodelete" onClick={() => setModal(false)}>No (Keep Review)</button>
        </div>
    );
};

export default DeleteReview;
