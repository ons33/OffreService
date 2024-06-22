// routes/jobApplicationRoutes.js

import express from 'express';
import { creerCandidatureEmploi,compterCandidaturesParJobId, obtenirToutesCandidaturesEmploi ,obtenirCandidatureEmploiParId,updateJobApplicationStatus,getCandidaturesByJobId } from '../controllers/candidatureController.js';

const router = express.Router();

// Route pour créer une nouvelle candidature à un emploi
router.post('/postCan', creerCandidatureEmploi);

// Route pour obtenir toutes les candidatures à un emploi
router.get('/getCans', obtenirToutesCandidaturesEmploi);

router.get('/getCans/:id', obtenirCandidatureEmploiParId);

router.put('/updateCanStatus/:id', updateJobApplicationStatus);

router.get('/getCansByJobId/:jobId', getCandidaturesByJobId);

router.get('/count/:jobId', compterCandidaturesParJobId);

export default router;
