import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateSpot, getSpotId } from '../../store/spots';
import './UpdateForm.css'

const UpdateForm = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spotState[spotId]);
    const history = useHistory();
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [country, setCountry] = useState(spot?.country);
    const [lat, setLat] = useState(spot?.lat);
    const [lng, setLng] = useState(spot?.lng);
    const [name, setName] = useState(spot?.name);
    const [description, setDescription] = useState(spot?.description);
    const [price, setPrice] = useState(spot?.price);
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);


    useEffect(() => {
        dispatch(getSpotId(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        const errors = {};
        if (!address?.length) errors.address = "Address is required";
        if (!city?.length) errors.city = "City is required";
        if (!state?.length) errors.state = "State is required";
        if (!country?.length) errors.country = "Country is required";
        if (!name?.length) errors.name = "Name is required";
        if (description?.length < 30) errors.description = "Description needs a minimum of 30 characters";
        if (!price) errors.price = "Price is required";

        setValidationErrors(errors);
    }, [address, city, state, country, name, description, price]);


    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateLat = (e) => setLat(e.target.value);
    const updateLng = (e) => setLng(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setHasSubmitted(true);

        if (Object.values(validationErrors).length)
            return alert(`The following errors were found:

      ${validationErrors.address ? "* " + validationErrors.address : ""}
      ${validationErrors.city ? "* " + validationErrors.city : ""}
      ${validationErrors.state ? "* " + validationErrors.state : ""}
      ${validationErrors.country ? "* " + validationErrors.country : ""}
      ${validationErrors.name ? "* " + validationErrors.name : ""}
      ${validationErrors.description ? "* " + validationErrors.description : ""}
      ${validationErrors.price ? "* " + validationErrors.price : ""}`
            );

        const payload = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        };



        let updatedSpot = await dispatch(updateSpot(spotId, payload));
        if (updatedSpot) {
            history.push(`/spots/${spotId}`);
        }
        setValidationErrors({});
        setHasSubmitted(false);
    };


    return (
        <div className='createSpotContainer'>
            <div className='headingInfo'>
                <div className='createTitle'>Update your Spot</div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='spotlocationdetails'>
                    <div className='subheader'>Where's Your Place Located</div>
                    <div className='captioninfo'>Guests will only get your exact address once they booked a reservation</div>
                    <div>
                        <div className='labelfield'>
                            <div>Country</div>
                            <div className="error">
                                {hasSubmitted && validationErrors.country &&
                                    `* ${validationErrors.country}`}
                            </div>
                        </div>
                        <input
                            type="string"
                            value={spot && (country ? country : setCountry(spot.country))}
                            onChange={updateCountry} />
                    </div>
                    <div>
                        <div className='labelfield'>
                            <div>Address</div>
                            <div className="error">
                                {hasSubmitted && validationErrors.address &&
                                    `* ${validationErrors.address}`}
                            </div>
                        </div>
                        <input
                            type="string"
                            value={spot && (address ? address : setAddress(spot.address))}
                            onChange={updateAddress} />
                    </div>
                    <div className='sidebyside'>
                        <div>
                            <div className='labelfield'>
                                <div>City</div>
                                <div className="error">
                                    {hasSubmitted && validationErrors.city &&
                                        `* ${validationErrors.city}`}
                                </div>
                            </div>
                            <input
                                type="string"
                                value={spot && (city ? city : setCity(spot.city))}
                                onChange={updateCity} />
                        </div>
                        <div>
                            <div className='labelfield'>
                                <div>State</div>
                                <div className="error">
                                    {hasSubmitted && validationErrors.state &&
                                        `* ${validationErrors.state}`}
                                </div>
                            </div>
                            <input
                                type="string"
                                value={spot && (state ? state : setState(spot.state))}
                                onChange={updateState} />
                        </div>
                    </div>
                    <div className='sidebyside'>
                        <div>
                            <input
                                type="number"
                                min="-90"
                                max="90"
                                value={spot && (lat ? lat : setLat(spot.lat))}
                                onChange={updateLat} />
                        </div>
                        <div>
                            <input
                                type="number"
                                min="-180"
                                max="180"
                                value={spot && (lng ? lng : setLng(spot.lng))}
                                onChange={updateLng} />
                        </div>
                    </div>
                </div>
                <div className='descriptionContainer'>
                    <div className='subheader'>Describe your place to guests</div>
                    <div className='captioninfo'>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                    <div>
                        <textarea
                            type="string"
                            value={spot && (description ? description : setDescription(spot.description))}
                            onChange={updateDescription} />
                        <div className="error">
                            {hasSubmitted && validationErrors.description &&
                                `* ${validationErrors.description}`}
                        </div>
                    </div>
                </div>
                <div className='descriptionContainer'>
                    <div className='subheader'>Create a title for your spot</div>
                    <div className='captioninfo'>Catch guests' attention with a spot title that highlights what makes
                        your place special</div>
                    <div>
                        <input
                            type="string"
                            value={spot && (name ? name : setName(spot.name))}
                            onChange={updateName} />
                        <div className="error">
                            {hasSubmitted && validationErrors.name &&
                                `* ${validationErrors.name}`}
                        </div>
                    </div>
                </div>
                <div className='descriptionContainer'>
                    <div className='subheader'>Set a base price for your spot</div>
                    <div className='captioninfo'>Competitive pricing can help your listing stand out and rank higher
                        in search results</div>
                    <div>
                        <input
                            type="number"
                            min="0"
                            value={spot && (price ? price : setPrice(spot.price))}
                            onChange={updatePrice} />
                        <div className="error">
                            {hasSubmitted && validationErrors.price &&
                                `* ${validationErrors.price}`}
                        </div>
                    </div>
                </div>
                <div className='spotbuttcontainer'>
                    <button className="createspotbutt" type="submit">Update Spot</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateForm;
