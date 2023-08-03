import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot, createSpotImage } from '../../store/spots';
import './CreateSpot.css'


const CreateSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [url, setUrl] = useState('');
    const [url2, setUrl2] = useState('');
    const [url3, setUrl3] = useState('');
    const [url4, setUrl4] = useState('');
    const [url5, setUrl5] = useState('');
    const [preview, setPreview] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const errors = {};
        if (!address.length) errors.address = "Address is required";
        if (!city.length) errors.city = "City is required";
        if (!state.length) errors.state = "State is required";
        if (!country.length) errors.country = "Country is required";
        if (!name.length) errors.name = "Name is required";
        if (description.length < 30) errors.description = "Description needs a minimum of 30 characters";
        if (!price) errors.price = "Price is required";
        if (!url.length) {
            errors.url = "Preview Image is required";
        } else {
            if (!(url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg"))) errors.url = "Image url must end in .png .jpeg or .jpg";
        }
        if (url2.length) {
            if (!(url2.endsWith(".jpg") || url2.endsWith(".png") || url2.endsWith(".jpeg"))) errors.url2 = "Image url must end in .png .jpeg or .jpg";
        };
        if (url3.length) {
            if (!(url3.endsWith(".jpg") || url3.endsWith(".png") || url3.endsWith(".jpeg"))) errors.url3 = "Image url must end in .png .jpeg or .jpg";
        };
        if (url4.length) {
            if (!(url4.endsWith(".jpg") || url4.endsWith(".png") || url4.endsWith(".jpeg"))) errors.url4 = "Image url must end in .png .jpeg or .jpg";
        };
        if (url5.length) {
            if (!(url5.endsWith(".jpg") || url5.endsWith(".png") || url5.endsWith(".jpeg"))) errors.url5 = "Image url must end in .png .jpeg or .jpg";
        };
        setValidationErrors(errors);
    }, [address, city, state, country, name, description, price, url, url2, url3, url4, url5]);


    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateLat = (e) => setLat(e.target.value);
    const updateLng = (e) => setLng(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updateUrl = (e) => {
        setUrl(e.target.value)
        setPreview(true)
    };
    const updateUrl2 = (e) => setUrl2(e.target.value);
    const updateUrl3 = (e) => setUrl3(e.target.value);
    const updateUrl4 = (e) => setUrl4(e.target.value);
    const updateUrl5 = (e) => setUrl5(e.target.value);

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
      ${validationErrors.price ? "* " + validationErrors.price : ""}
      ${validationErrors.url ? "* " + validationErrors.url : ""}
      ${validationErrors.url2 ? "* " + validationErrors.url2 : ""}
      ${validationErrors.url3 ? "* " + validationErrors.url3 : ""}
      ${validationErrors.url4 ? "* " + validationErrors.url4 : ""}
      ${validationErrors.url5 ? "* " + validationErrors.url5 : ""}`
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

        const imgPayload = {
            url,
            preview
        }

        const imgPayload2 = {
            url: url2,
            preview: false
        }
        const imgPayload3 = {
            url: url3,
            preview: false
        }
        const imgPayload4 = {
            url: url4,
            preview: false
        }
        const imgPayload5 = {
            url: url5,
            preview: false
        }


        let createdSpot = await dispatch(createSpot(payload));
        let spotImage;
        if (createdSpot) {
            spotImage = await dispatch(createSpotImage(`${createdSpot.id}`, imgPayload))
            if (url2) {
                let spotImage2 = await dispatch(createSpotImage(`${createdSpot.id}`, imgPayload2))
            }
            if (url3) {
                let spotImage3 = await dispatch(createSpotImage(`${createdSpot.id}`, imgPayload3))
            }
            if (url4) {
                let spotImage4 = await dispatch(createSpotImage(`${createdSpot.id}`, imgPayload4))
            }
            if (url5) {
                let spotImage5 = await dispatch(createSpotImage(`${createdSpot.id}`, imgPayload5))
            }
        }
        if (spotImage) {
            history.push(`/spots/${createdSpot.id}`);
        }
        setValidationErrors({});
        setHasSubmitted(false);
    };


    return (
        <section>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="string"
                        placeholder="Country"
                        value={country}
                        onChange={updateCountry} />
                    <div className="error">
                        {hasSubmitted && validationErrors.country &&
                            `* ${validationErrors.country}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Street Address"
                        value={address}
                        onChange={updateAddress} />
                    <div className="error">
                        {hasSubmitted && validationErrors.address &&
                            `* ${validationErrors.address}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="City"
                        value={city}
                        onChange={updateCity} />
                    <div className="error">
                        {hasSubmitted && validationErrors.city &&
                            `* ${validationErrors.city}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="State"
                        value={state}
                        onChange={updateState} />
                    <div className="error">
                        {hasSubmitted && validationErrors.state &&
                            `* ${validationErrors.state}`}
                    </div>
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Latitutde"
                        min="-90"
                        max="90"
                        value={lat}
                        onChange={updateLat} />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Longitude"
                        min="-180"
                        max="180"
                        value={lng}
                        onChange={updateLng} />
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Please write at least 30 characters"
                        value={description}
                        onChange={updateDescription} />
                    <div className="error">
                        {hasSubmitted && validationErrors.description &&
                            `* ${validationErrors.description}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Name of your Spot"
                        value={name}
                        onChange={updateName} />
                    <div className="error">
                        {hasSubmitted && validationErrors.name &&
                            `* ${validationErrors.name}`}
                    </div>
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Price per Night (USD)"
                        min="0"
                        value={price}
                        onChange={updatePrice} />
                    <div className="error">
                        {hasSubmitted && validationErrors.price &&
                            `* ${validationErrors.price}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Preview Image Url"
                        value={url}
                        onChange={updateUrl} />
                    <div className="error">
                        {hasSubmitted && validationErrors.url &&
                            `* ${validationErrors.url}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Image Url"
                        value={url2}
                        onChange={updateUrl2} />
                    <div className="error">
                        {hasSubmitted && validationErrors.url2 &&
                            `* ${validationErrors.url2}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Image Url"
                        value={url3}
                        onChange={updateUrl3} />
                    <div className="error">
                        {hasSubmitted && validationErrors.url3 &&
                            `* ${validationErrors.url3}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Image Url"
                        value={url4}
                        onChange={updateUrl4} />
                    <div className="error">
                        {hasSubmitted && validationErrors.url4 &&
                            `* ${validationErrors.url4}`}
                    </div>
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Image Url"
                        value={url5}
                        onChange={updateUrl5} />
                    <div className="error">
                        {hasSubmitted && validationErrors.url5 &&
                            `* ${validationErrors.url5}`}
                    </div>
                </div>
                <button type="submit">Create Spot</button>
            </form>
        </section>
    );
}

export default CreateSpot;
