const File = require('../models/fileModel');
const cloudinary = require('../Config/cloudinary');

// Upload File
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file yet. Please sent a file' });
    }

    const newFile = await File.create({
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      cloudinaryId: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      isPublic: req.body.isPublic === 'true',
      owner: req.userId
    });

    res.status(201).json({
      message: 'File সফলভাবে upload হয়েছে',
      file: newFile
    });

  } catch (error) {
    res.status(500).json({ message: 'Upload ব্যর্থ হয়েছে', error: error.message });
  }
};

// Get all files of logged-in user (Dashboard)
const getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single file (Public/Private check)
const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File পাওয়া যায়নি' });
    }

    // যদি private হয়, শুধু owner দেখতে পারবে
    if (!file.isPublic) {
      if (!req.userId || file.owner.toString() !== req.userId) {
        return res.status(403).json({ message: 'এই file দেখার অনুমতি নেই' });
      }
    }

    res.status(200).json({ file });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle Public/Private
const toggleVisibility = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File পাওয়া যায়নি' });
    }

    if (file.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'শুধুমাত্র owner এটা পরিবর্তন করতে পারবে' });
    }

    file.isPublic = !file.isPublic;
    await file.save();

    res.status(200).json({ message: 'File visibility পরিবর্তন হয়েছে', file });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete File
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File পাওয়া যায়নি' });
    }

    if (file.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'শুধুমাত্র owner delete করতে পারবে' });
    }

    // Cloudinary থেকেও delete করো
    await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: 'auto' });

    await file.deleteOne();

    res.status(200).json({ message: 'File সফলভাবে delete হয়েছে' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadFile,
  getMyFiles,
  getFileById,
 toggleVisibility,
 deleteFile
};  