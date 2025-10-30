const express = require('express');
const router = express.Router();
const Provider = require('../models/provider');
const multer = require('multer');
const { createOrUpdateProvider, getProviderByUserId, updateProviderPhoto, getProviderById, uploadProviderFiles , getAllProviders } = require('../controllers/providerController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload-photo', upload.single('photo'), updateProviderPhoto);
router.post('/', createOrUpdateProvider);
router.get('/', getAllProviders);
router.get('/by-user/:userId', getProviderByUserId);
router.get('/:providerId', getProviderById);
router.post('/upload-files', upload.array('files'), require('../controllers/providerController').uploadProviderFiles);
router.get('/', async (req, res) => {
  const providers = await Provider.find().populate('user', 'name email');
  res.json(providers);
});


module.exports = router;
