import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams, Switch } from 'react-router-dom';
import { getSpotId } from '../../store/spots';
import { getAllSpots } from '../../store/spots';


const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spotsObject = useSelector(state => state.spotState.spots);
    const spots = Object.values(spotsObject)
    const singleSpot = spots[0]?.find(spot => spot.id === parseInt(spotId));

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);


    return (
        <div>
            <h1>{singleSpot?.name}</h1>
            <h2>{singleSpot?.description}</h2>
        </div>
    )
}

export default SpotDetails;
