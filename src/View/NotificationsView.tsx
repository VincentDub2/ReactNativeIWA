import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import NotificationsController from "../controllers/NotificationController";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";

export default function NotificationsView() {
    const dispatch = useDispatch();

    const notifications = useSelector(
        (state: RootState) => state.notifications.notifications
    );
    const controller = new NotificationsController(dispatch);

    useEffect(() => {
        const loadData = async () => {
            await controller.loadNotifications();
        };

        loadData().catch((error) =>
            console.error("Erreur lors du chargement des données :", error)
        );
    }, [dispatch]);

    const handleMarkAsRead = (id: number) => {
        controller.markNotificationAsRead(id);
    };

    const handleDeleteNotification = (id: number) => {
        console.log("Suppression de la notification", id);
        controller.deleteNotification(id);
    };

    return (
        <View className="px-1 pt-4">
            {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                    {/* Petite croix pour supprimer la notification */}
                    <TouchableOpacity
                        className="absolute
                        top-2 right-1 bg-primary-100
                        rounded-full w-8 h-8
                        flex items-center justify-center"
                        onPress={() => handleDeleteNotification(notification.id)}
                    >
                        <Text className="color-white font-bold">X</Text>
                    </TouchableOpacity>

                    <Text className={`items-start mr-6 mt-2 ${!notification.read ? 'font-bold' : 'color-gray-600'}`} >
                        {notification.message}
                    </Text>
                    {!notification.read && (
                        <TouchableOpacity
                            onPress={() => handleMarkAsRead(notification.id)}
                        >
                            <Text style={styles.markAsReadButton}>
                                Marquer comme lue
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    notificationItem: {
        marginBottom: 15,
        padding: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        position: "relative", // Nécessaire pour positionner la croix
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
