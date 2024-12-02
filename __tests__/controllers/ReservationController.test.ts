import { ReservationController } from '../../src/controllers/ReservationController';

describe('ReservationController', () => {
    it('fait une réservation avec succès', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Success' }),
            })
        ) as jest.Mock;

        const body = {
            idEmplacement: 1,
            idVoyageur: 2,
            dateArrive: '2024-01-01T00:00:00',
            dateDepart: '2024-01-02T00:00:00',
            prix: 100,
        };

        await ReservationController.makeReservation(body, 'fake-token');

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8090/api/v1/reservation',
            expect.any(Object)
        );
    });
});
