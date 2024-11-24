export class Evaluation {
    constructor(
        public hoteId : number, // ID de l'hôte évalué
        public voyageurId: number, // ID de l'utilisateur qui évalue
        public reservationId: number, // ID de la réservation associée
        public emplacementId: number, // ID de l'emplacement associé
        public note: number, // Note de 1 à 5
        public commentaire: string, // Commentaire de l'utilisateur
    ) {}

    // Méthode statique pour valider une note
    static validateNote(note: number): boolean {
        return note >= 1 && note <= 5;
    }
}