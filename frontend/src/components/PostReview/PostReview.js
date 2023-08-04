import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createReview } from '../../store/reviews';
import { context } from '../Modal/Modal'
import './PostReview.css'
import { getSpotId } from '../../store/spots';
import { getReviewsById } from '../../store/reviews';

const PostReview = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const { setModal } = useContext(context)
    const updateReview = (e) => setReview(e.target.value);

    // useEffect(() => {
    //     const errors = {};
    //     if (!review) errors.review = "Address is required";
    //     setValidationErrors(errors);
    // }, [review]);

    const handleClick = (starIdx) => {
        const newRating = starIdx + 1;
        setStars(newRating)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        const payload = {
            review,
            stars
        };

        let createdReview = await dispatch(createReview(spotId, payload)).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setValidationErrors(data.errors);
                } else if (data) {
                    setValidationErrors(data)
                }
            }
        );
        if (createdReview) {
            setModal(false)
            dispatch(getSpotId(spotId));
            dispatch(getReviewsById(spotId));
        }

    };

    const avgRating = () => {
        const starsArray = [];
        for (let i = 0; i < 5; i++) {
            const icon = i < stars ? "fa-solid fa-star" : "fa-duotone fa-star";
            starsArray.push(
                <i key={i}
                    className={`fa ${icon} star ${i < stars ? "active" : ""}`}
                    onMouseOver={() => setStars(i + 1)}
                    onClick={() => handleClick(i)}
                >
                </i>
            )
        }
        return starsArray;
    }

    let button;
    if (review.length < 10 || !stars) {
        button = <button type="submit" disabled='true' className='disabledbutton'>Submit Your Review</button>
    } else {
        button = <button type="submit" className='workingbutton'>Submit Your Review</button>
    }

    let errorMessage;
    if (validationErrors.review) {
        errorMessage = `* ${validationErrors.review}`
    } else if (validationErrors.stars) {
        errorMessage = `* ${validationErrors.stars}`
    } else if (validationErrors.message) {
        errorMessage = `* ${validationErrors.message}`
    }

    return (
        <div id='postreviewform'>
            <form onSubmit={handleSubmit} className='new-review-form'>
                <h2>How Was Your Stay?</h2>
                <div>
                    <div className="error">
                        {errorMessage}
                    </div>
                    <textarea
                        type="string"
                        placeholder="Leave your review here..."
                        value={review}
                        onChange={updateReview} />
                </div>
                <div id='starRate'>{avgRating()} Stars</div>
                <div id='reviewButton'>{button}</div>
            </form>
        </div>
    )
};

export default PostReview;
