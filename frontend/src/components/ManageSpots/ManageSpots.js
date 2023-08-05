import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import OpenModalButton from '../Modal/Modal';
import { getSpotsById } from '../../store/spots';
import './ManageSpots.css'
import DeleteForm from '../DeleteForm/DeleteForm';

const ManageSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    let spotsObject = useSelector((state) => state.spotState);

    spotsObject = Object.entries(spotsObject).filter(([key]) => key !== 'detail');


    useEffect(() => {
        dispatch(getSpotsById());
    }, [dispatch]);



    if (!spotsObject.length) {
        return (
            <div>
                <h1>You do not have any spots currently. Would you like to create one?</h1>
                <button className="manageupdate" onClick={() => history.push(`/spots`)}>Create A New Spot</button>
            </div>
        )
    } else {
        return (
            <div className="spots-container">
                <h1 className="spots-title">Manage Spots</h1>
                <button className="manageupdate" onClick={() => history.push(`/spots`)}>Create A New Spot</button>
                <div className="spots-grid">
                    {spotsObject?.map(([key, spot]) => (
                        <div key={key} className="spot-item1">
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
                            <div className='managebuttons'>
                                <button className="manageupdate" onClick={() => history.push(`/spots/${spot.id}/update`)}>Update</button>
                                <OpenModalButton
                                    buttonName="Delete"
                                    modalComponent={<DeleteForm spotId={spot.id} />}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
};

export default ManageSpots;
