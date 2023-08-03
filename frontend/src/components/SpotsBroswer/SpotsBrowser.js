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
                                <div className="spot-name">{spot.name}
                                    <div className='spot-rating'>
                                        {spot.avgRating !== "0.00" ? spot.avgRating : 'NEW'}
                                        <i className="fa-solid fa-star"></i>
                                    </div>
                                </div>
                                <div className="spot-location">{spot.city}, {spot.state} </div>
                                <div className="spot-price">${spot.price}/night</div>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpotsBrowser;
