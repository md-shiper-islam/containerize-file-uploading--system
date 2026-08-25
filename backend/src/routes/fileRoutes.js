const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const protect = require('../middleware/authMiddleware');
const {
  uploadFile,
  getMyFiles,
  getFileById,
  toggleVisibility,
  deleteFile
} = require('../controllers/fileController');

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/my-files', protect, getMyFiles);
router.get('/:id', getFileById); // public/private check controller এর ভেতরে হবে
router.patch('/:id/toggle', protect, toggleVisibility);
router.delete('/:id', protect, deleteFile);

module.exports = router;