import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EmplacementController from '../../src/controllers/EmplacementController';
import { Emplacement } from '../../src/models/Emplacement';
import { getToken } from '../../src/utils/auth';
import { getApiUrl } from '../../src/utils/api';

// Mock de la fonction getToken
jest.mock('../../src/utils/auth', () => ({
    getToken: jest.fn(),
}));


describe('EmplacementController', () => {
    let mockAxios: MockAdapter;

    beforeAll(() => {
        // Initialiser le mock d'Axios
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        // Réinitialiser les mocks après chaque test
        mockAxios.reset();
        jest.clearAllMocks();
    });

    afterAll(() => {
        // Restaurer les mocks après tous les tests
        mockAxios.restore();
    });

    describe('fetchAllEmplacements', () => {
        it('devrait récupérer tous les emplacements avec succès', async () => {
            // Données simulées
            const mockData = [
                {
                    idEmplacement: 1,
                    idHote: 1,
                    nom: 'Emplacement 1',
                    adresse: 'Adresse 1',
                    description: 'Description 1',
                    commodites: ['WiFi', 'Piscine'],
                    image: 'image1.jpg',
                    latitude: 45.0,
                    longitude: 3.0,
                    capacity: 4,
                    prixParNuit: 100,
                    dateDebut: '2024-01-01',
                    dateFin: '2024-01-10',
                },
                // Ajoutez d'autres emplacements si nécessaire
            ];

            // Configurer les mocks
            (getToken as jest.Mock).mockReturnValue('fake-token');

            // Simuler la réponse d'Axios
            mockAxios.onGet('http://localhost:8090/api/v1/emplacements/').reply(200, mockData);

            // Appeler la méthode
            const emplacements = await EmplacementController.fetchAllEmplacements();

            // Assertions
            expect(emplacements).toHaveLength(mockData.length);
            expect(emplacements[0]).toBeInstanceOf(Emplacement);
            expect(emplacements[0].nom).toBe('Emplacement 1');
        });

        it('devrait gérer les erreurs lors de la récupération des emplacements', async () => {
            // Configurer les mocks
            (getToken as jest.Mock).mockReturnValue('fake-token');

            // Simuler une erreur 500
            mockAxios.onGet('http://localhost:8090/api/v1/emplacements/').reply(500);

            // Appeler la méthode et vérifier la nature de l'erreur
            try {
                await EmplacementController.fetchAllEmplacements();
            } catch (error : any) {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Request failed with status code 500');
            }
        });
    });

    // Ajoutez des tests similaires pour les autres méthodes de EmplacementController
});
