import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getSpotsById } from '../../store/spots';
import './ManageSpots.css'

const ManageSpots = () => {
    const dispatch = useDispatch();
    let spotsObject = useSelector((state) => state.spotState);

    spotsObject = Object.entries(spotsObject).filter(([key]) => key !== 'detail');


    useEffect(() => {
        dispatch(getSpotsById());
    }, [dispatch]);

    console.log(spotsObject)

    if (!spotsObject.length) {
        return (
            <div>
                <h1>You do not have any spots currently. Would you like to create one?</h1>
                <NavLink to="/spots" className="nav-link">Create A New Spot</NavLink>
            </div>
        )
    } else {
        return (
            <div className="spots-container">
                <h1 className="spots-title">Manage Spots</h1>
                <NavLink to="/spots" className="nav-link">Create A New Spot</NavLink>
                <div className="spots-grid">
                    {spotsObject?.map(([key, spot]) => (
                        <div key={key} className="spot-item">
                            <NavLink to={`/spots/${spot.id}`} title={spot.name}>
                                <div>
                                    <img src={spot.previewImage} className="spot-image" alt="Spot Preview" />
                                    <h1 className="spot-name">{spot.name}</h1>
                                    <h3 className="spot-location">{spot.city}</h3>
                                    <h3 className="spot-location">{spot.state}</h3>
                                    <h4 className="spot-price">${spot.price}/night</h4>
                                    <h4 className="spot-rating">
                                        {spot.avgRating ? spot.avgRating : 'NEW'}
                                        <i className="fa-solid fa-star"></i>
                                    </h4>
                                </div>
                            </NavLink>
                            <NavLink to={`/spots/${spot.id}/delete`}>Delete</NavLink>
                            <NavLink to={`/spots/${spot.id}/update`}>Update</NavLink>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
};

export default ManageSpots;
