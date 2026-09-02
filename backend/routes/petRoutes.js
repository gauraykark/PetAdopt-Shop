import express from 'express';
import { getPets, getPetById } from '../controllers/petController.js';

const router = express.Router();

router.get('/', getPets);
router.get('/:id', getPetById);

export default router;