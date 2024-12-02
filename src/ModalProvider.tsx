import React, { createContext, useContext, useState, ReactNode } from 'react';
import Modal from "./components/Modal";
type ModalType = 'error' | 'success' | 'message';

interface ModalContextProps {
    showModal: (message: string, type: ModalType) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<ModalType>('message');

    const showModal = (message: string, type: ModalType) => {
        setModalMessage(message);
        setModalType(type);
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modalVisible && (
                <Modal
                    visible={modalVisible}
                    text={modalMessage}
                    type={modalType}
                    onClose={hideModal}
                />
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
