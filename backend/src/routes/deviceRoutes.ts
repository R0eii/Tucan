import express from 'express';
import { 
  getDevices, restartDevice, retryDevice, refreshSimulation, getCompaniesStats,
  createDevice, updateDevice, deleteDevice, renameCompany, deleteCompany
} from '../controllers/deviceController';

const router = express.Router();

router.get('/', getDevices);
router.post('/', createDevice); // ✅ Create
router.get('/stats/companies', getCompaniesStats);
router.post('/refresh-simulation', refreshSimulation);

// Specific Device Operations
router.put('/:id', updateDevice); // ✅ Update
router.delete('/:id', deleteDevice); // ✅ Delete
router.post('/:id/restart', restartDevice);
router.post('/:id/retry', retryDevice);

// Company Operations
router.put('/companies/:oldName', renameCompany); // ✅ Rename Company
router.delete('/companies/:name', deleteCompany); // ✅ Delete Company

export default router;