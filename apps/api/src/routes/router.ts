import { Router } from 'express';
import gameRoutes from './game.route';

export const router = Router();

/** GET /health-check - Check service health */
router.get('/health-check', (_req, res) => res.send('OK'));

router.use('/game', gameRoutes);
