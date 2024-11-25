export interface ReservationRequest {
    idEmplacement: number;
    idVoyageur: number;
    dateArrive: string;
    dateDepart: string;
    prix: number;
}


export interface Reservation {
    nom: string;
    dateDebut: string | null;
    dateFin: string | null;
    adresse: string;
}
