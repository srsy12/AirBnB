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
            <div onClick={() => { if (modal === false) setModal(true) }}>
                <button onClick={toggleModal}>
                    {buttonName}
                </button>
                {modal && (
                    <div >
                        <div className="overlay" onClick={toggleModal}></div>
                        {modalComponent}
                    </div>
                )}
            </div>
        </context.Provider>
    );
};

export default OpenModalButton;
