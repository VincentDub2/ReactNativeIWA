import { Emplacement } from "../models/Emplacement";
import { getToken } from "../utils/auth";
import axios from "axios";
import {getApiUrl} from "../utils/api";

export default class EmplacementController {
    private static API_URL = getApiUrl();

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

            const mapData = data.map((item: any) => {

                if (typeof item.prixParNuit !== "number") {
                    console.error(
                        `Erreur : prixParNuit est incorrect pour l'emplacement ${item.idEmplacement}`,
                        item.prixParNuit
                    );
                }

                const emplacement = new Emplacement(
                    item.idEmplacement,
                    item.idHote,
                    item.nom,
                    item.adresse,
                    item.description,
                    item.commodites || [],
                    item.image || null,
                    item.latitude,
                    item.longitude,
                    item.capacity || 10,
                    item.prixParNuit, // Valide que ceci est bien un nombre
                    item.dateDebut,
                    item.dateFin
                );

                return emplacement;
            });

            return mapData;
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
                item.dateFin,
                item.capacity
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
            const response = await fetch(`${this.API_URL}/emplacements/search?city=${city}`,
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
                item.dateFin,
                item.capacity
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
            const response = await fetch(`${this.API_URL}/emplacements`, {
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
                item.dateFin,
                item.capacity
            );
        } catch (error) {
            console.error("Erreur lors de la création d'un emplacement :", error);
            throw error;
        }
    }
}