import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface CustomModalProps {
    visible: boolean;
    text: string;
    type: 'error' | 'success' | 'message';
    onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, text, type, onClose }) => {
    const headerBackgroundColor =
        type === 'error' ? '#f44336' : type === 'success' ? '#E9D69F' : '#ffeb3b';
    const titleText = type === 'error' ? 'Erreur' : type === 'success' ? 'Succès' : 'Attention';
    const titleColor = type === 'error' ? '#fff' : type === 'success' ? '#fff' : '#f57f17';

    return (
        <Modal transparent visible={visible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
                            <Text style={[styles.title, { color: titleColor }]}>{titleText}</Text>
                            <TouchableWithoutFeedback onPress={onClose}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.messageContainer}>
                            <Text style={styles.text}>{text}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 18,
        color: '#333',
    },
    messageContainer: {
        backgroundColor: '#fff',
        padding: 20,
    },
    text: {
        color: '#333',
        fontSize: 16,
        textAlign: 'left',
    },
});

export default CustomModal;
