import {AppDispatch, RootState} from "../app/store";
import {fetchNotifications, markAsRead, markAsReadAPI} from "../features/notifications/notificationsSlice";
import {fetchUserByIdAsync} from "../features/users/usersSlice";

export default class NotificationsController {
    private readonly dispatch: AppDispatch;

    constructor(dispatch: AppDispatch) {
        this.dispatch = dispatch;
    }


    /**
     * Charge les notifications pour l'utilisateur actuel.
     */
    async loadNotifications(): Promise<void> {
        try {
            await this.dispatch(fetchNotifications()).unwrap();
        } catch (error) {
            console.error('Erreur lors du chargement des notifications :', error);
        }
    }

    /**
     * Marque une notification comme lue.
     * @param notificationId L'ID de la notification.
     */
    markNotificationAsRead(notificationId: number): void {
        this.dispatch(markAsReadAPI(notificationId));
    }

    /**
     * Charge les informations de l'utilisateur actuel.
     */
    async loadUserData(getState: () => RootState): Promise<void> {
        const userId = getState().users.id; // Accède à l'état Redux actuel
        console.log(userId);
        if (!userId) {
            console.error('ID utilisateur non disponible.');
            return;
        }

        try {
            await this.dispatch(fetchUserByIdAsync(userId)).unwrap();
        } catch (error) {
            console.error('Erreur lors du chargement des informations utilisateur :', error);
        }
    }

}
