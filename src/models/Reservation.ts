export interface ReservationRequest {
    idEmplacement: number;
    idVoyageur: number;
    dateArrive: string;
    dateDepart: string;
    prix: number;
}


export interface Reservation {
	idReservation: any;
	id: any;
    idEmplacement: number;
    nom: string;
    dateDebut: string | null;
    dateFin: string | null;
    adresse: string;

}
