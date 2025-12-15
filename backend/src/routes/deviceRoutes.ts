import express from 'express';
import { 
  getDevices, 
  restartDevice, 
  retryDevice, 
  refreshSimulation 
} from '../controllers/deviceController';

const router = express.Router();

router.get('/', getDevices);
router.post('/refresh-simulation', refreshSimulation);
router.post('/:id/restart', restartDevice);
router.post('/:id/retry', retryDevice);

export default router;