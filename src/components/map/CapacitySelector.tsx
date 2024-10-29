import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CapacitySelectorProps {
    minCapacity: number;
    increaseCapacity: () => void;
    decreaseCapacity: () => void;
}

const CapacitySelector: React.FC<CapacitySelectorProps> = ({ minCapacity, increaseCapacity, decreaseCapacity }) => {
    return (
        <View>
            <Text className="font-bold text-lg mt-4">Capacité minimale :</Text>
            <View style={styles.capacitySelector}>
                <TouchableOpacity onPress={decreaseCapacity} className="rounded-full justify-around items-center w-10 h-10 bg-primary">
                    <Text className="font-bold text-2xl color-neutral-900">-</Text>
                </TouchableOpacity>
                <Text className="font-bold text-xl mx-2">{minCapacity}</Text>
                <TouchableOpacity onPress={increaseCapacity} className="rounded-full justify-around items-center w-10 h-10 bg-primary">
                    <Text className="font-bold text-xl color-neutral-900">+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    capacitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
});

export default CapacitySelector;
