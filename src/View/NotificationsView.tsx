import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import NotificationsController from "../controllers/NotificationController";
import {Notification} from "../models/Notification";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../app/store";


export default function NotificationsView() {
    const dispatch = useDispatch();


    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const controller = new NotificationsController(dispatch);


    useEffect(() => {

        const loadData = async () => {
            await controller.loadNotifications();
        };

        loadData().catch((error) => console.error('Erreur lors du chargement des données :', error));
    }, [dispatch]);

    const handleMarkAsRead = (id: number) => {
        controller.markNotificationAsRead(id);
    };



    return (
        <View style={styles.container}>
            {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                    <Text style={notification.read ? styles.read : styles.unread}>
                        {notification.message}
                    </Text>
                    {!notification.read && (
                        <TouchableOpacity
                            onPress={() => handleMarkAsRead(notification.id)}
                        >
                            <Text style={styles.markAsReadButton}>Marquer comme lue</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    notificationItem: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    unread: {
        fontWeight: "bold",
    },
    read: {
        color: "gray",
    },
    markAsReadButton: {
        color: "blue",
        marginTop: 5,
    },
});
