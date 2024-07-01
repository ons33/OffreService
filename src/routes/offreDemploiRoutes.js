import * as offreController from '../controllers/offreDemploiController.js';
import express from 'express';

const router = express.Router();

// Define routes for CRUD operations
router.post('/add', offreController.createOffre);
router.get('/', offreController.getAllOffres);
router.get('/:id', offreController.getOffreById);
router.put('/:id', offreController.updateOffre);
router.delete('/:id', offreController.deleteOffre);
router.get('/offre/search', offreController.searchJobsByIntitule);
router.get('/offre/:userId', offreController.GetOffreByIduser);

export default router;
