import {Reservation} from "./Reservation";


export interface User {
    id: number
    username: string //nom
    lastname: string //prenom
    firstname : string
    email: string
    phone: string
    password?: string;
    isAuthenticated: boolean;
    reservations: Reservation[];
    token?: string;
}
