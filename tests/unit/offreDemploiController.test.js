// tests/unit/offreDemploiController.test.js
import mongoose from 'mongoose';
import { createOffre, getAllOffres, getOffreById, updateOffre, deleteOffre, searchJobsByIntitule, GetOffreByIduser } from '../../src/controllers/offreDemploiController';
import OffreEmploi from '../../src/models/OffreDemploi';

jest.mock('../../src/models/OffreDemploi');

describe('Offre d\'emploi Controller', () => {
  describe('createOffre', () => {
    it('should create a new job offer', async () => {
      const req = {
        body: {
          intitule: 'Développeur Full Stack',
          typeOffre: 'CDI',
          description: 'Opportunité passionnante pour un développeur Full Stack!',
          workplaceType: 'Remote',
          entrepriseNom: 'Ma Super Entreprise',
          salaire: 80000,
          photo: 'url_de_la_photo',
          tags: ['développement', 'full-stack'],
          skills: ['Node.js', 'React', 'MongoDB'],
          userId: '12345'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const saveMock = jest.fn().mockResolvedValue(req.body);
      OffreEmploi.mockImplementation(() => ({
        save: saveMock
      }));
      await createOffre(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: req.body });
    });
  });

  describe('getAllOffres', () => {
    it('should return all job offers', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const offres = [{ intitule: 'Développeur Full Stack' }];
      OffreEmploi.find.mockResolvedValue(offres);
      await getAllOffres(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: offres });
    });
  });

  // Add more unit tests for other controller functions here...
});
