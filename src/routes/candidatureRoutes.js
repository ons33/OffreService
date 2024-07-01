// routes/jobApplicationRoutes.js

import express from 'express';
import {
  creerCandidatureEmploi,
  compterCandidaturesParJobId,
  obtenirToutesCandidaturesEmploi,
  obtenirCandidatureEmploiParId,
  updateJobApplicationStatus,
  getCandidaturesByJobId,
} from '../controllers/candidatureController.js';

const router = express.Router();

router.post('/postCan', creerCandidatureEmploi);

router.get('/getCans', obtenirToutesCandidaturesEmploi);

router.get('/getCans/:id', obtenirCandidatureEmploiParId);

router.put('/updateCanStatus/:id', updateJobApplicationStatus);

router.get('/getCansByJobId/:jobId', getCandidaturesByJobId);

router.get('/count/:jobId', compterCandidaturesParJobId);

export default router;
