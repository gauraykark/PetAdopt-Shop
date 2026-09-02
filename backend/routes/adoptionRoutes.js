import express from 'express';
import { createAdoption, getAdoptions } from '../controllers/adoptionController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAdoptions);
router.post('/', optionalProtect, createAdoption);

export default router;