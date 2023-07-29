import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getAllSpots } from '../../store/spots';
import './SpotsBrowser.css';
import SpotDetails from '../SpotDetails/SpotDetails';

const SpotsBrowser = () => {
    const dispatch = useDispatch();
    let spotsObject = useSelector((state) => state.spotState);

    spotsObject = Object.entries(spotsObject).filter(([key]) => key !== 'detail');

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    return (
        <div className="spots-container">
            <h1 className="spots-title">Spots List</h1>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpotsBrowser;
