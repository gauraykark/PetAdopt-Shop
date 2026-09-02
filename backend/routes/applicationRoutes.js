import express from 'express';
import { getUserApplications, createApplication } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getUserApplications);
router.post('/', protect, createApplication);

export default router;