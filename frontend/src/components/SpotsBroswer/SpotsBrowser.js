import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams, Switch } from 'react-router-dom';

import { getAllSpots } from '../../store/spots';
import "./SpotsBrowser.css"
import SpotDetails from '../SpotDetails/SpotDetails';

const SpotsBrowser = () => {
    const dispatch = useDispatch();
    let spotsObject = useSelector(state => state.spotState);

    spotsObject = Object.entries(spotsObject).filter(([key]) => key !== "detail");


    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    return (
        <div>
            <h1>Spots List</h1>
            <div>
                {spotsObject?.map(([key, spot]) => (
                    <div key={key}><NavLink to={`/spots/${spot.id}`}>
                        <div>
                            <img src={spot.previewImage} className='spotImages' />
                            <h1>{spot.name}</h1>
                            <h3>{spot.city}</h3>
                            <h3>{spot.state}</h3>
                            <h4> ${spot.price}/night</h4>
                            <h4>{spot.avgRating ? spot.avgRating : 'NEW'}<i class="fa-solid fa-star"></i></h4>
                        </div>
                    </NavLink>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default SpotsBrowser;
