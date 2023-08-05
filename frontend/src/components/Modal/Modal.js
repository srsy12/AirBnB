import { createContext, useState } from "react";
import './Modal.css'

export const context = createContext(null)

const OpenModalButton = ({ buttonName, modalComponent }) => {

    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    };


    return (
        <context.Provider value={{ setModal }}>
            <div className='button-container' onClick={() => { if (modal === false) setModal(true) }}>
                <button className="modalbutton" onClick={toggleModal}>
                    {buttonName}
                </button>
                {modal && (
                    <div className="overlay" >
                        <div className="modal-content">
                            <div className="buttondiv">
                                <button onClick={toggleModal}>X</button>
                            </div>
                            {modalComponent}
                        </div>
                    </div>
                )}
            </div>
        </context.Provider>
    );
};

export default OpenModalButton;
