import { Router } from 'express';
import { apiV1Router } from './v1/index.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok'
    }
  });
});

router.use('/api/v1', apiV1Router);

export { router as rootRouter };
