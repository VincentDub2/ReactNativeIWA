import { Emplacement } from "../models/Emplacement";
import { getToken } from "../utils/auth";
import axios from "axios";

export default class EmplacementController {
    private static API_URL ="http://localhost:8090/api/v1";

    // Méthode pour récupérer tous les emplacements depuis l'API
    static async fetchAllEmplacements(): Promise<Emplacement[]> {
        const token = getToken();
        try {
            const responseAxios = await axios.get(`${this.API_URL}/emplacements/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Ajout du Bearer Token
                },
            });

            if (!responseAxios.status) {
                const data = await responseAxios.data;
                const message = data.message || "Une erreur est survenue";
                throw new Error(`Erreur HTTP : ${responseAxios.status} ${responseAxios});}`);
            }

            const data = await responseAxios.data;
            return data.map(
                (item: any) =>
                    new Emplacement(
                        item.idEmplacement,
                        item.idHote,
                        item.nom,
                        item.adresse,
                        item.description,
                        item.commodites || [],
                        item.image || null,
                        item.latitude,
                        item.longitude,
                        item.prixParNuit,
                        item.dateDebut,
                        item.dateFin
                    )
            );
        } catch (error) {
            console.error("Erreur lors de la récupération des emplacements :", error);
            throw error;
        }
    }

    // Méthode pour récupérer un emplacement par ID
    static async fetchEmplacementById(id: number): Promise<Emplacement> {
        const token = getToken();
        try {
            const response = await fetch(`${this.API_URL}/emplacements/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Ajout du Bearer Token
                    },
                });
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const item = await response.json();
            return new Emplacement(
                item.idEmplacement,
                item.idHote,
                item.nom,
                item.adresse,
                item.description,
                item.commodites || [],
                item.image || null,
                item.latitude,
                item.longitude,
                item.prixParNuit,
                item.dateDebut,
                item.dateFin
            );
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'emplacement ${id} :`, error);
            throw error;
        }
    }

    // controllers/EmplacementController.ts
    static async fetchEmplacementsByCity(city: string): Promise<Emplacement[]> {
        const token = getToken();
        try {
            const response = await fetch(`${this.API_URL}/search?city=${city}`,
            {
                method: "GET",
                    headers: {
                "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Ajout du Bearer Token
            },
            });
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            return data.map((item: any) => new Emplacement(
                item.idEmplacement,
                item.idHote,
                item.nom,
                item.adresse,
                item.description,
                item.commodites || [],
                item.image || null,
                item.latitude,
                item.longitude,
                item.prixParNuit,
                item.dateDebut,
                item.dateFin
            ));
        } catch (error) {
            console.error("Erreur lors de la recherche d'emplacements :", error);
            throw error;
        }
    }

    // Méthode pour créer un nouvel emplacement
    static async createEmplacement(newEmplacement: Emplacement): Promise<Emplacement> {
        const token = getToken();
        try {
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json",
                Authorization: `Bearer ${token}`}, // Ajout du Bearer Token
                body: JSON.stringify(newEmplacement),
            });
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const item = await response.json();
            return new Emplacement(
                item.idEmplacement,
                item.idHote,
                item.nom,
                item.adresse,
                item.description,
                item.commodites || [],
                item.image || null,
                item.latitude,
                item.longitude,
                item.prixParNuit,
                item.dateDebut,
                item.dateFin
            );
        } catch (error) {
            console.error("Erreur lors de la création d'un emplacement :", error);
            throw error;
        }
    }
}