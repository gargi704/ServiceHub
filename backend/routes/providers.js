const express = require('express');
const router = express.Router();
const multer = require('multer');
const Provider = require('../models/provider');
const { createOrUpdateProvider, getProviderByUserId, updateProviderPhoto, getProviderById, getAllProviders } = require('../controllers/providerController');

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
// router.post('/upload-files', upload.array('files'), uploadProviderFiles);
router.delete('/:providerId', async (req, res) => {
  try {
    const deleted = await Provider.findByIdAndDelete(req.params.providerId);
    if (!deleted) return res.status(404).json({ error: 'Provider not found.' });
    res.json({ message: 'Provider deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
