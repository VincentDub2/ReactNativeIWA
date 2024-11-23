export class Emplacement {
    constructor(
        public idEmplacement: number,
        public idHote: number,
        public nom: string,
        public adresse: string,
        public description: string | null,
        public commodites: string[],
        public image: string | null, // Encodé en Base64
        public latitude: number,
        public longitude: number,
        public prixParNuit: number,
        public dateDebut: string, // Format ISO 8601
        public dateFin: string // Format ISO 8601
    ) {}

    // Méthode pour calculer la distance à partir d'une localisation donnée
    static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const toRadians = (deg: number) => (deg * Math.PI) / 180;
        const R = 6371; // Rayon de la Terre en km
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance en km
    }
}
